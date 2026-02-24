import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { resolveTenant, isMainDomain, extractSubdomain } from '@/lib/tenant-resolver';
import { apiRateLimiter, authRateLimiter } from '@/lib/rate-limit';

const PUBLIC_PATHS = ['/login', '/marketing', '/metodologia', '/subscription-expired', '/registrar', '/convite', '/convite-responsavel', '/esqueci-senha', '/redefinir-senha', '/auth'];
const MARKETING_PATHS = ['/', '/marketing', '/metodologia'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hostname = request.headers.get('host') || 'localhost:3000';

    // 1. Pular arquivos estáticos
    if (
        pathname.startsWith('/_next') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // 1.5 Rate limiting
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || request.headers.get('x-real-ip')
        || 'unknown';

    if (pathname.startsWith('/api')) {
        if (!apiRateLimiter.check(clientIp)) {
            return NextResponse.json(
                { error: 'Muitas requisicoes. Tente novamente em breve.' },
                { status: 429 }
            );
        }
        return NextResponse.next();
    }

    if (pathname === '/login') {
        if (!authRateLimiter.check(clientIp)) {
            return NextResponse.json(
                { error: 'Muitas tentativas de login. Aguarde 1 minuto.' },
                { status: 429 }
            );
        }
    }

    // 2. Multi-tenant routing
    const tenantResolution = await resolveTenant(request);

    // 2a. Marketing pages (main domain without subdomain)
    if (tenantResolution.type === 'marketing') {
        // Allow marketing paths on main domain
        if (MARKETING_PATHS.includes(pathname) || pathname.startsWith('/super-admin')) {
            const { user, response } = await updateSession(request);

            // Super admin requires auth
            if (pathname.startsWith('/super-admin') && !user) {
                const url = request.nextUrl.clone();
                url.pathname = '/login';
                return NextResponse.redirect(url);
            }

            return response;
        }

        // Non-marketing paths on main domain need auth check
        const { user, response } = await updateSession(request);

        if (!user && !PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }

        return response;
    }

    // 2b. Tenant not found
    if (tenantResolution.type === 'not_found') {
        // Redirect to main marketing page
        const mainUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://triavium.com.br';
        return NextResponse.redirect(`${mainUrl}/marketing?error=tenant_not_found`);
    }

    // 2c. Valid tenant found - inject tenant info into request headers
    const tenant = tenantResolution.tenant;

    const { user, response } = await updateSession(request);

    // Clone response to add tenant headers
    const modifiedResponse = NextResponse.next({
        request: {
            headers: new Headers(request.headers),
        },
    });

    // Copy cookies from session response
    response.cookies.getAll().forEach((cookie) => {
        modifiedResponse.cookies.set(cookie.name, cookie.value, {
            ...cookie,
        });
    });

    // Add tenant info as headers (accessible in server components)
    modifiedResponse.headers.set('x-tenant-id', tenant.id);
    modifiedResponse.headers.set('x-tenant-slug', tenant.slug);
    modifiedResponse.headers.set('x-tenant-name', encodeURIComponent(tenant.name));
    if (tenant.customDomain) {
        modifiedResponse.headers.set('x-tenant-domain', tenant.customDomain);
    }

    // 3. Proteção de Rotas (Auth) para tenant
    if (!user && !PUBLIC_PATHS.some((p) => pathname.startsWith(p)) && pathname !== '/') {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // 4. Redirecionamento de Login (se já autenticado, sai do /login)
    if (user && pathname.startsWith('/login')) {
        const url = request.nextUrl.clone();
        url.pathname = '/inicio';
        return NextResponse.redirect(url);
    }

    // 5. Root path for tenant → redirect to /inicio
    if (pathname === '/' && user) {
        const url = request.nextUrl.clone();
        url.pathname = '/inicio';
        return NextResponse.redirect(url);
    }

    return modifiedResponse;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
