'use server';

import { prisma } from '@/lib/prisma';
import { requireSuperAdmin, getCurrentUser } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { OrganizationType, Role } from '@prisma/client';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://triavium.com.br';

function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error('Supabase credentials missing (Service Role Key)');
    }

    return createClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

// ---------------------------------------------------------------------------
// Impersonation
// ---------------------------------------------------------------------------

export async function impersonateTenant(tenantId: string) {
    const admin = await requireSuperAdmin();

    const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { id: true, name: true },
    });

    if (!tenant) {
        return { error: 'Escola não encontrada.' };
    }

    const cookieStore = await cookies();
    cookieStore.set('original_tenant_id', admin.tenantId, {
        path: '/',
        maxAge: 60 * 60 * 4, // 4 hours
    });
    cookieStore.set('active_tenant_id', tenantId, {
        path: '/',
        maxAge: 60 * 60 * 4,
    });
    cookieStore.set('impersonating', 'true', {
        path: '/',
        maxAge: 60 * 60 * 4,
    });

    await logAudit({
        tenantId: admin.tenantId,
        userId: admin.id,
        action: 'IMPERSONATE_TENANT',
        targetId: tenantId,
        details: { tenantName: tenant.name },
    });

    revalidatePath('/');
    return { success: true, redirectTo: '/inicio' };
}

export async function exitImpersonation() {
    const user = await getCurrentUser();
    if (!user) {
        return { error: 'Não autenticado.' };
    }

    const cookieStore = await cookies();
    const originalTenantId = cookieStore.get('original_tenant_id')?.value;

    if (originalTenantId) {
        cookieStore.set('active_tenant_id', originalTenantId, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
        });
    } else {
        cookieStore.delete('active_tenant_id');
    }

    cookieStore.delete('original_tenant_id');
    cookieStore.delete('impersonating');

    await logAudit({
        tenantId: user.tenantId,
        userId: user.id,
        action: 'EXIT_IMPERSONATION',
    });

    revalidatePath('/');
    return { success: true, redirectTo: '/super-admin' };
}

export async function isImpersonating(): Promise<boolean> {
    const cookieStore = await cookies();
    return cookieStore.get('impersonating')?.value === 'true';
}

// ---------------------------------------------------------------------------
// Dashboard Metrics
// ---------------------------------------------------------------------------

export async function getDashboardMetrics() {
    await requireSuperAdmin();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
        totalTenants,
        activeTenants,
        totalStudents,
        totalAssessments,
        totalReports,
        tenants,
        tenantsWithRecentAssessments,
    ] = await Promise.all([
        prisma.tenant.count(),
        prisma.tenant.count({ where: { isActive: true } }),
        prisma.student.count(),
        prisma.assessment.count(),
        prisma.interventionLog.count({ where: { type: 'INDIVIDUAL_PLAN' } }),
        prisma.tenant.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                slug: true,
                isActive: true,
                createdAt: true,
                city: true,
                state: true,
                _count: {
                    select: {
                        users: true,
                        students: true,
                        assessments: true,
                    },
                },
            },
        }),
        prisma.tenant.findMany({
            where: {
                assessments: {
                    some: { createdAt: { gte: thirtyDaysAgo } },
                },
            },
            select: { id: true },
        }),
    ]);

    const activeAssessmentTenantIds = new Set(
        tenantsWithRecentAssessments.map((t) => t.id)
    );

    const inactiveSchools = tenants.filter(
        (t) => t.isActive && !activeAssessmentTenantIds.has(t.id)
    );

    return {
        totalTenants,
        activeTenants,
        totalStudents,
        totalAssessments,
        totalReports,
        inactiveSchools: inactiveSchools.length,
        tenants,
    };
}

// ---------------------------------------------------------------------------
// Tenant Management
// ---------------------------------------------------------------------------

export async function getTenantDetails(tenantId: string) {
    await requireSuperAdmin();

    const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        include: {
            _count: {
                select: {
                    users: true,
                    students: true,
                    assessments: true,
                    classrooms: true,
                    interventionLogs: true,
                },
            },
        },
    });

    if (!tenant) {
        return { error: 'Escola não encontrada.' };
    }

    const [usersByRole, riskDistribution, lastAssessment] = await Promise.all([
        prisma.user.groupBy({
            by: ['role'],
            where: { tenantId },
            _count: { role: true },
        }),
        prisma.assessment.groupBy({
            by: ['overallTier'],
            where: { tenantId, overallTier: { not: null } },
            _count: { overallTier: true },
        }),
        prisma.assessment.findFirst({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
            select: { createdAt: true },
        }),
    ]);

    const usersByRoleMap: Record<string, number> = {};
    for (const entry of usersByRole) {
        usersByRoleMap[entry.role] = entry._count.role;
    }

    const riskDistributionMap: Record<string, number> = {};
    for (const entry of riskDistribution) {
        if (entry.overallTier) {
            riskDistributionMap[entry.overallTier] = entry._count.overallTier;
        }
    }

    return {
        tenant,
        usersByRole: usersByRoleMap,
        riskDistribution: riskDistributionMap,
        lastActivity: lastAssessment?.createdAt ?? null,
    };
}

export async function updateTenantDetails(
    tenantId: string,
    data: {
        name?: string;
        city?: string;
        state?: string;
        phone?: string;
        email?: string;
        address?: string;
        cnpj?: string;
        logoUrl?: string;
        customDomain?: string;
        organizationType?: OrganizationType;
        subscriptionStatus?: string;
    }
) {
    const admin = await requireSuperAdmin();

    if (data.state && data.state.length !== 2) {
        return { error: 'O estado deve ter exatamente 2 caracteres (ex: SP, RJ).' };
    }

    const existing = await prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { id: true, name: true },
    });

    if (!existing) {
        return { error: 'Escola não encontrada.' };
    }

    try {
        await prisma.tenant.update({
            where: { id: tenantId },
            data,
        });

        await logAudit({
            tenantId: admin.tenantId,
            userId: admin.id,
            action: 'UPDATE_TENANT',
            targetId: tenantId,
            details: { tenantName: existing.name, updatedFields: Object.keys(data) },
        });

        revalidatePath('/super-admin');
        return { success: true };
    } catch (e: any) {
        console.error('[SUPER_ADMIN] Error updating tenant:', e.message);
        return { error: 'Erro ao atualizar escola.' };
    }
}

export async function toggleTenantActive(tenantId: string) {
    const admin = await requireSuperAdmin();

    const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { id: true, name: true, isActive: true },
    });

    if (!tenant) {
        return { error: 'Escola não encontrada.' };
    }

    const newStatus = !tenant.isActive;

    await prisma.tenant.update({
        where: { id: tenantId },
        data: { isActive: newStatus },
    });

    await logAudit({
        tenantId: admin.tenantId,
        userId: admin.id,
        action: newStatus ? 'ACTIVATE_TENANT' : 'DEACTIVATE_TENANT',
        targetId: tenantId,
        details: { tenantName: tenant.name },
    });

    revalidatePath('/super-admin');
    return { success: true, isActive: newStatus };
}

// ---------------------------------------------------------------------------
// User Management
// ---------------------------------------------------------------------------

export async function getUsers(filters?: {
    tenantId?: string;
    role?: string;
    isActive?: boolean;
    search?: string;
    page?: number;
    pageSize?: number;
}) {
    await requireSuperAdmin();

    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 50;
    const skip = (page - 1) * pageSize;

    const where: any = {};

    if (filters?.tenantId) {
        where.tenantId = filters.tenantId;
    }

    if (filters?.role) {
        where.role = filters.role;
    }

    if (filters?.isActive !== undefined) {
        where.isActive = filters.isActive;
    }

    if (filters?.search) {
        where.OR = [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { email: { contains: filters.search, mode: 'insensitive' } },
        ];
    }

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take: pageSize,
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
                tenantId: true,
                tenant: {
                    select: { name: true },
                },
            },
        }),
        prisma.user.count({ where }),
    ]);

    return {
        users,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    };
}

export async function updateUserRole(userId: string, newRole: string) {
    const admin = await requireSuperAdmin();

    if (!Object.values(Role).includes(newRole as Role)) {
        return { error: 'Role inválida.' };
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, role: true, tenantId: true },
    });

    if (!user) {
        return { error: 'Usuário não encontrado.' };
    }

    await prisma.user.update({
        where: { id: userId },
        data: { role: newRole as Role },
    });

    await logAudit({
        tenantId: admin.tenantId,
        userId: admin.id,
        action: 'UPDATE_USER_ROLE',
        targetId: userId,
        details: {
            userName: user.name,
            previousRole: user.role,
            newRole,
        },
    });

    revalidatePath('/super-admin');
    return { success: true };
}

export async function toggleUserActive(userId: string) {
    const admin = await requireSuperAdmin();

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, isActive: true, tenantId: true },
    });

    if (!user) {
        return { error: 'Usuário não encontrado.' };
    }

    const newStatus = !user.isActive;

    await prisma.user.update({
        where: { id: userId },
        data: { isActive: newStatus },
    });

    await logAudit({
        tenantId: admin.tenantId,
        userId: admin.id,
        action: newStatus ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
        targetId: userId,
        details: { userName: user.name, userEmail: user.email },
    });

    revalidatePath('/super-admin');
    return { success: true, isActive: newStatus };
}

export async function resetUserPassword(userId: string) {
    const admin = await requireSuperAdmin();

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, tenantId: true },
    });

    if (!user) {
        return { error: 'Usuário não encontrado.' };
    }

    try {
        const supabaseAdmin = getSupabaseAdmin();

        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
            type: 'recovery',
            email: user.email,
            options: {
                redirectTo: `${APP_URL}/auth/callback?next=/redefinir-senha`,
            },
        });

        if (error) {
            console.error('[SUPER_ADMIN] generateLink error:', error);
            return { error: 'Erro ao gerar link de recuperação.' };
        }

        await logAudit({
            tenantId: admin.tenantId,
            userId: admin.id,
            action: 'RESET_USER_PASSWORD',
            targetId: userId,
            details: { userName: user.name, userEmail: user.email },
        });

        revalidatePath('/super-admin');
        return {
            success: true,
            recoveryLink: data.properties?.action_link ?? null,
        };
    } catch (e: any) {
        console.error('[SUPER_ADMIN] Error resetting password:', e.message);
        return { error: 'Erro ao redefinir senha do usuário.' };
    }
}

// ---------------------------------------------------------------------------
// Audit Logs
// ---------------------------------------------------------------------------

export async function getAuditLogs(filters?: {
    tenantId?: string;
    userId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
}) {
    await requireSuperAdmin();

    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 50;
    const skip = (page - 1) * pageSize;

    const where: any = {};

    if (filters?.tenantId) {
        where.tenantId = filters.tenantId;
    }

    if (filters?.userId) {
        where.userId = filters.userId;
    }

    if (filters?.action) {
        where.action = filters.action;
    }

    if (filters?.startDate || filters?.endDate) {
        where.timestamp = {};
        if (filters.startDate) {
            where.timestamp.gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
            where.timestamp.lte = new Date(filters.endDate);
        }
    }

    const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
            where,
            skip,
            take: pageSize,
            orderBy: { timestamp: 'desc' },
            select: {
                id: true,
                action: true,
                targetId: true,
                details: true,
                timestamp: true,
                user: {
                    select: { name: true, email: true },
                },
                tenant: {
                    select: { name: true },
                },
            },
        }),
        prisma.auditLog.count({ where }),
    ]);

    return {
        logs,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    };
}
