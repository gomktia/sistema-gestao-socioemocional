import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const PUBLIC_PATHS = ['/login', '/marketing', '/subscription-expired'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Pular arquivos estáticos e API
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    const { user, supabase, response } = await updateSession(request);

    // 2. Proteção de Rotas (Auth)
    if (!user && !PUBLIC_PATHS.some((p) => pathname.startsWith(p)) && pathname !== '/') {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // 3. Verificação de Assinatura (Bloqueio SaaS)
    if (user && !pathname.startsWith('/subscription-expired') && !pathname.startsWith('/login')) {
        // Buscar tenantId do usuário (usando metadata do user ou buscando rápido)
        const { data: dbUser } = await supabase
            .from('users')
            .select('tenantId')
            .eq('supabaseUid', user.id)
            .single();

        if (dbUser?.tenantId) {
            const { data: tenant } = await supabase
                .from('tenants')
                .select('subscriptionStatus')
                .eq('id', dbUser.tenantId)
                .single();

            if (tenant && tenant.subscriptionStatus !== 'active') {
                const url = request.nextUrl.clone();
                url.pathname = '/subscription-expired';
                return NextResponse.redirect(url);
            }
        }
    }

    // 4. Redirecionamento de Login
    if (user && pathname.startsWith('/login')) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    return response;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
