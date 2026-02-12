(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__ed360656._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/lib/supabase/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updateSession",
    ()=>updateSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/@supabase/ssr/dist/module/index.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/@supabase/ssr/dist/module/createServerClient.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
;
async function updateSession(request) {
    let supabaseResponse = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
        request
    });
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://terwfdltjoiodcdzyctk.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlcndmZGx0am9pb2RjZHp5Y3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MjY2OTMsImV4cCI6MjA4NjQwMjY5M30.lZQ1RFqUfLJumiTTnEUdrUK06bPj8Hn2FbhmhIu774E"), {
        cookies: {
            getAll () {
                return request.cookies.getAll();
            },
            setAll (cookiesToSet) {
                cookiesToSet.forEach(({ name, value })=>request.cookies.set(name, value));
                supabaseResponse = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
                    request
                });
                cookiesToSet.forEach(({ name, value, options })=>supabaseResponse.cookies.set(name, value, options));
            }
        }
    });
    // Importante: Não remova este getUser()!
    // É ele quem garante que o token será atualizado se estiver expirando.
    const { data: { user } } = await supabase.auth.getUser();
    return {
        supabase,
        user,
        response: supabaseResponse
    };
}
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$supabase$2f$middleware$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/lib/supabase/middleware.ts [middleware-edge] (ecmascript)");
;
;
const PUBLIC_PATHS = [
    '/login',
    '/marketing',
    '/subscription-expired'
];
async function middleware(request) {
    const { pathname } = request.nextUrl;
    // 1. Pular arquivos estáticos e API
    if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    const { user, supabase, response } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$supabase$2f$middleware$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["updateSession"])(request);
    // 2. Proteção de Rotas (Auth)
    if (!user && !PUBLIC_PATHS.some((p)=>pathname.startsWith(p)) && pathname !== '/') {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
    }
    // 3. Verificação de Assinatura (Bloqueio SaaS)
    if (user && !pathname.startsWith('/subscription-expired') && !pathname.startsWith('/login')) {
        // Buscar tenantId do usuário (usando metadata do user ou buscando rápido)
        const { data: dbUser } = await supabase.from('users').select('tenantId').eq('supabaseUid', user.id).single();
        if (dbUser?.tenantId) {
            const { data: tenant } = await supabase.from('tenants').select('subscriptionStatus').eq('id', dbUser.tenantId).single();
            if (tenant && tenant.subscriptionStatus !== 'active') {
                const url = request.nextUrl.clone();
                url.pathname = '/subscription-expired';
                return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
            }
        }
    }
    // 4. Redirecionamento de Login
    if (user && pathname.startsWith('/login')) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
    }
    return response;
}
const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__ed360656._.js.map