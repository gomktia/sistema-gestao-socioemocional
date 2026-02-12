'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { UserRole } from '@/src/core/types';
import { revalidatePath } from 'next/cache';

/**
 * Cria um novo grupo de intervenção de Camada 2.
 */
export async function createInterventionGroup(name: string, type: any, studentIds: string[]) {
    const user = await getCurrentUser();
    if (!user || user.role === UserRole.STUDENT) return { error: 'Não autorizado.' };

    const supabase = await createClient();

    const { data: group, error: groupError } = await supabase
        .from('intervention_groups')
        .insert({
            tenantId: user.tenantId,
            name,
            type,
            startDate: new Date().toISOString(),
            isActive: true,
        })
        .select()
        .single();

    if (groupError) return { error: 'Erro ao criar grupo.' };

    // Adicionar estudantes ao grupo (relação Many-to-Many no Prisma, mas no Supabase pode ser uma tabela pivot se não usarmos o Prisma Client)
    // Como definimos students Student[] no Prisma, ele cria uma tabela implícita _InterventionGroupToStudent

    // No Supabase Direct (SQL), vamos precisar saber o nome da tabela pivot gerada pelo Prisma
    // Geralmente é _InterventionGroupToStudent

    const pivotEntries = studentIds.map(sid => ({
        A: group.id, // ID do InterventionGroup
        B: sid     // ID do Student
    }));

    const { error: pivotError } = await supabase
        .from('_InterventionGroupToStudent')
        .insert(pivotEntries);

    if (pivotError) {
        console.error('Pivot Error:', pivotError);
        return { error: 'Erro ao vincular alunos ao grupo.' };
    }

    revalidatePath('/intervencoes');
    return { success: true, group };
}

/**
 * Busca grupos de intervenção ativos.
 */
export async function getInterventionGroups() {
    const user = await getCurrentUser();
    if (!user) return [];

    const supabase = await createClient();
    const { data } = await supabase
        .from('intervention_groups')
        .select('*, students(id, name, overallTier)')
        .eq('tenantId', user.tenantId)
        .eq('isActive', true);

    return data || [];
}
