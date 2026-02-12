module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/lib/supabase/server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/@supabase/ssr/dist/module/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/headers.js [app-rsc] (ecmascript)");
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://terwfdltjoiodcdzyctk.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlcndmZGx0am9pb2RjZHp5Y3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MjY2OTMsImV4cCI6MjA4NjQwMjY5M30.lZQ1RFqUfLJumiTTnEUdrUK06bPj8Hn2FbhmhIu774E"), {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // Chamado de um Server Component - pode ignorar se for apenas leitura
                }
            }
        }
    });
}
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/lib/auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "canAccessRoute",
    ()=>canAccessRoute,
    "getCurrentUser",
    ()=>getCurrentUser,
    "getHomeForRole",
    ()=>getHomeForRole
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/lib/supabase/server.ts [app-rsc] (ecmascript)");
;
async function getCurrentUser() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    // 1. Tentar buscar por UID (já vinculado)
    let { data: dbUser } = await supabase.from('users').select('id, email, name, role, tenantId, studentId, supabaseUid').eq('supabaseUid', user.id).single();
    // 2. Se não encontrou por UID, tentar por Email (Primeiro acesso)
    if (!dbUser) {
        const { data: matchedEmail } = await supabase.from('users').select('id, email, name, role, tenantId, studentId, supabaseUid').eq('email', user.email).single();
        if (matchedEmail) {
            // Vincular o UID do Supabase ao registro no banco
            const { data: updatedUser } = await supabase.from('users').update({
                supabaseUid: user.id
            }).eq('id', matchedEmail.id).select().single();
            dbUser = updatedUser;
        }
    }
    if (!dbUser) return null;
    return {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
        tenantId: dbUser.tenantId,
        studentId: dbUser.studentId
    };
}
/**
 * Mapeia cada Role para sua página inicial padrão.
 */ const ROLE_HOME = {
    STUDENT: '/minhas-forcas',
    TEACHER: '/turma',
    PSYCHOLOGIST: '/alunos',
    COUNSELOR: '/alunos',
    MANAGER: '/turma',
    ADMIN: '/super-admin'
};
function getHomeForRole(role) {
    return ROLE_HOME[role] ?? '/';
}
/**
 * Define quais permissões são necessárias para cada grupo de rotas.
 */ const ROUTE_ACCESS = {
    '/questionario': [
        'STUDENT'
    ],
    '/minhas-forcas': [
        'STUDENT'
    ],
    '/turma': [
        'TEACHER',
        'MANAGER',
        'ADMIN'
    ],
    '/alunos': [
        'PSYCHOLOGIST',
        'COUNSELOR',
        'MANAGER',
        'ADMIN'
    ],
    '/intervencoes': [
        'PSYCHOLOGIST',
        'COUNSELOR',
        'MANAGER',
        'ADMIN'
    ],
    '/relatorios': [
        'PSYCHOLOGIST',
        'COUNSELOR',
        'MANAGER',
        'ADMIN'
    ],
    '/gestao': [
        'MANAGER',
        'ADMIN'
    ],
    '/super-admin': [
        'ADMIN'
    ]
};
function canAccessRoute(role, pathname) {
    const matchedRoute = Object.keys(ROUTE_ACCESS).find((route)=>pathname === route || pathname.startsWith(route + '/'));
    if (!matchedRoute) return true; // Rotas não mapeadas são tratadas como públicas dentro do portal
    return ROUTE_ACCESS[matchedRoute].includes(role);
}
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx <module evaluation>", "default");
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx", "default");
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$app$2f$marketing$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$app$2f$marketing$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$app$2f$marketing$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/lib/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$app$2f$marketing$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx [app-rsc] (ecmascript)");
;
;
;
;
async function Home() {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentUser"])();
    if (user) {
        const homePath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getHomeForRole"])(user.role);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(homePath);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$app$2f$marketing$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/page.tsx",
        lineNumber: 13,
        columnNumber: 12
    }, this);
}
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/app/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__121bca7e._.js.map