'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getMyTenants() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Busca o CPF do usuário atual para encontrar outros vínculos
    const currentUserData = await prisma.user.findFirst({
        where: {
            OR: [
                { supabaseUid: user.id },
                { email: user.email || '' }
            ]
        },
        select: { cpf: true, email: true }
    });

    if (!currentUserData) return [];

    // Busca todos os usuários que compartilham o mesmo CPF ou Email (vínculos em outras escolas)
    const linkedUsers = await prisma.user.findMany({
        where: {
            OR: [
                currentUserData.cpf ? { cpf: currentUserData.cpf } : {},
                { email: currentUserData.email },
                { supabaseUid: user.id }
            ]
        },
        include: {
            tenant: {
                select: { id: true, name: true, slug: true }
            }
        }
    });

    // Remover duplicatas de tenant em caso de múltiplos perfis na mesma escola
    const uniqueTenants = linkedUsers.reduce((acc, current) => {
        if (!acc.find(item => item.id === current.tenantId)) {
            acc.push({
                id: current.tenantId,
                name: current.tenant.name,
                slug: current.tenant.slug,
                role: current.role
            });
        }
        return acc;
    }, [] as any[]);

    return uniqueTenants;
}

export async function switchTenant(tenantId: string) {
    const cookieStore = await cookies();
    cookieStore.set('active_tenant_id', tenantId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30 // 30 dias
    });

    revalidatePath('/');
    redirect('/inicio');
}
