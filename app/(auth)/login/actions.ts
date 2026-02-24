'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { prisma } from '@/lib/prisma';
import { getHomeForRole } from '@/lib/auth';

import { isValidCPF, cleanCPF } from '@/src/lib/utils/cpf';

export async function login(formData: FormData) {
    try {
        // Verificação de variáveis de ambiente
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            console.error('[LOGIN] Missing Supabase env vars');
            return { error: 'Configuração do servidor incompleta (Supabase). Contacte o administrador.' };
        }

        const supabase = await createClient();
        const identifier = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!identifier || !password) {
            return { error: 'Preencha todos os campos.' };
        }

        let emailToAuth = identifier;

        // Se não for email (não tem @), tenta validar como CPF
        if (!identifier.includes('@')) {
            if (isValidCPF(identifier)) {
                const cpf = cleanCPF(identifier);
                const user = await prisma.user.findFirst({
                    where: { cpf },
                    select: { email: true }
                });

                if (!user) {
                    return { error: 'CPF não encontrado no sistema.' };
                }
                emailToAuth = user.email;
            } else {
                return { error: 'Formato de CPF ou Email inválido.' };
            }
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: emailToAuth,
            password,
        });

        if (error) {
            console.error('[LOGIN] Supabase auth error:', error.message, '| user:', emailToAuth);
            return { error: 'Credenciais inválidas.' };
        }

        // Vincular UID ao registro Prisma se ainda não vinculado
        const supabaseUid = data.user?.id;
        if (supabaseUid) {
            const dbUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { supabaseUid },
                        { email: emailToAuth }
                    ]
                },
                select: { id: true, role: true, supabaseUid: true, tenantId: true },
            });

            if (dbUser) {
                if (!dbUser.supabaseUid) {
                    await prisma.user.update({
                        where: { id: dbUser.id },
                        data: { supabaseUid },
                    });
                    console.warn('[LOGIN] Linked Supabase UID to user record.');
                }

                // Setar o tenant ativo inicial
                const { cookies } = await import('next/headers');
                const cookieStore = await cookies();
                cookieStore.set('active_tenant_id', dbUser.tenantId, { path: '/' });

                redirect(getHomeForRole(dbUser.role));
            }

            // Autenticou no Supabase mas não existe no Prisma
            console.error('[LOGIN] User authenticated but not found in database:', emailToAuth);
            await supabase.auth.signOut();
            return { error: 'Usuário não cadastrado no sistema. Contacte o administrador.' };
        }

    } catch (error: any) {
        // Next.js redirect lança um erro especial - deve ser re-lançado
        if (isRedirectError(error)) throw error;

        console.error('[LOGIN CRITICAL ERROR]', error?.message || error);

        return { error: 'Erro interno do servidor. Tente novamente ou contacte o administrador.' };
    }

    redirect('/');
}
