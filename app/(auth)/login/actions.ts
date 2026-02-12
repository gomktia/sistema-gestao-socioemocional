'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Preencha todos os campos.' };
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Login error:', error.message);
        return { error: 'Email ou senha incorretos.' };
    }

    // O middleware cuidará do redirecionamento para o '/' e o app/(portal)/page.tsx 
    // cuidará do redirect baseado no Role.
    redirect('/');
}
