'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function updateTenantSettings(formData: FormData) {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'MANAGER' && user.role !== 'ADMIN')) {
        return { error: 'Não autorizado.' };
    }

    const name = formData.get('name') as string;
    const logoUrl = formData.get('logoUrl') as string;

    if (!name) {
        return { error: 'O nome da escola é obrigatório.' };
    }

    try {
        await prisma.tenant.update({
            where: { id: user.tenantId },
            data: {
                name,
                logoUrl: logoUrl || null,
            },
        });

        revalidatePath('/escola/configuracoes');
        revalidatePath('/inicio');
        return { success: true };
    } catch (e: any) {
        console.error('Error updating tenant:', e.message);
        return { error: 'Erro ao salvar configurações.' };
    }
}
