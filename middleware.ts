import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const PUBLIC_PATHS = ['/login', '/marketing', '/subscription-expired', '/demo-setup'];

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

    const { user, response } = await updateSession(request);

    // 2. Proteção de Rotas (Auth)
    if (!user && !PUBLIC_PATHS.some((p) => pathname.startsWith(p)) && pathname !== '/') {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // 3. Redirecionamento de Login (se já autenticado, sai do /login)
    if (user && pathname.startsWith('/login')) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    // Nota: A verificação de assinatura (subscription) é feita no PortalLayout
    // usando Prisma, pois o middleware Edge não suporta Prisma e o Supabase Client
    // é bloqueado por RLS nas tabelas do aplicativo.

    return response;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
