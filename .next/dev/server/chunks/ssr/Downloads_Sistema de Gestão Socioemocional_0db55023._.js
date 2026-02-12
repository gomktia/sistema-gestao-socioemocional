module.exports = [
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
"[project]/Downloads/Sistema de Gestão Socioemocional/components/Sidebar.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Sidebar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Sidebar() from the server but Sidebar is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Downloads/Sistema de Gestão Socioemocional/components/Sidebar.tsx <module evaluation>", "Sidebar");
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/components/Sidebar.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Sidebar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Sidebar() from the server but Sidebar is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Downloads/Sistema de Gestão Socioemocional/components/Sidebar.tsx", "Sidebar");
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/components/Sidebar.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/components/Sidebar.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/components/Sidebar.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/components/NotificationBell.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NotificationBell",
    ()=>NotificationBell
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const NotificationBell = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call NotificationBell() from the server but NotificationBell is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Downloads/Sistema de Gestão Socioemocional/components/NotificationBell.tsx <module evaluation>", "NotificationBell");
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/components/NotificationBell.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NotificationBell",
    ()=>NotificationBell
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const NotificationBell = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call NotificationBell() from the server but NotificationBell is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Downloads/Sistema de Gestão Socioemocional/components/NotificationBell.tsx", "NotificationBell");
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/components/NotificationBell.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$components$2f$NotificationBell$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/components/NotificationBell.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$components$2f$NotificationBell$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/components/NotificationBell.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$components$2f$NotificationBell$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/components/Header.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Header",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$components$2f$NotificationBell$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/components/NotificationBell.tsx [app-rsc] (ecmascript)");
;
;
function Header({ userName, userRole }) {
    const roleLabels = {
        STUDENT: 'Aluno',
        TEACHER: 'Professor',
        PSYCHOLOGIST: 'Psicólogo',
        COUNSELOR: 'Orientador',
        MANAGER: 'Gestor',
        ADMIN: 'Admin'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4 lg:hidden"
            }, void 0, false, {
                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/components/Header.tsx",
                lineNumber: 21,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hidden sm:block",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest",
                        children: "Bem-vindo(a)"
                    }, void 0, false, {
                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/components/Header.tsx",
                        lineNumber: 26,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-bold text-slate-700",
                        children: userName
                    }, void 0, false, {
                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/components/Header.tsx",
                        lineNumber: 27,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/components/Header.tsx",
                lineNumber: 25,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: [
                    (userRole === 'MANAGER' || userRole === 'PSYCHOLOGIST' || userRole === 'ADMIN') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$components$2f$NotificationBell$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NotificationBell"], {}, void 0, false, {
                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/components/Header.tsx",
                        lineNumber: 32,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-8 w-[1px] bg-slate-100 mx-2 hidden sm:block"
                    }, void 0, false, {
                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/components/Header.tsx",
                        lineNumber: 35,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-2 w-2 rounded-full bg-emerald-500 animate-pulse"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/components/Header.tsx",
                                lineNumber: 38,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] font-black text-slate-600 uppercase tracking-tighter",
                                children: roleLabels[userRole] || userRole
                            }, void 0, false, {
                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/components/Header.tsx",
                                lineNumber: 39,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/components/Header.tsx",
                        lineNumber: 37,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/components/Header.tsx",
                lineNumber: 30,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/components/Header.tsx",
        lineNumber: 20,
        columnNumber: 9
    }, this);
}
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/components/sidebar-nav.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NAV_BY_ROLE",
    ()=>NAV_BY_ROLE,
    "getNavForRole",
    ()=>getNavForRole
]);
const NAV_BY_ROLE = {
    STUDENT: [
        {
            label: 'Início',
            href: '/',
            iconName: 'Home'
        },
        {
            label: 'Responder VIA',
            href: '/questionario',
            iconName: 'ClipboardList'
        },
        {
            label: 'Minhas Forças',
            href: '/minhas-forcas',
            iconName: 'Trophy'
        }
    ],
    TEACHER: [
        {
            label: 'Início',
            href: '/',
            iconName: 'Home'
        },
        {
            label: 'Minha Turma',
            href: '/turma',
            iconName: 'LayoutDashboard'
        },
        {
            label: 'Lançar Triagem',
            href: '/turma/triagem',
            iconName: 'ClipboardList'
        }
    ],
    PSYCHOLOGIST: [
        {
            label: 'Início',
            href: '/',
            iconName: 'Home'
        },
        {
            label: 'Mapa de Risco',
            href: '/turma',
            iconName: 'ClipboardList'
        },
        {
            label: 'Lista de Alunos',
            href: '/alunos',
            iconName: 'Users'
        },
        {
            label: 'Intervenções (C2)',
            href: '/intervencoes',
            iconName: 'Layers'
        },
        {
            label: 'Relatórios',
            href: '/relatorios',
            iconName: 'FileText'
        }
    ],
    COUNSELOR: [
        {
            label: 'Início',
            href: '/',
            iconName: 'Home'
        },
        {
            label: 'Mapa de Risco',
            href: '/turma',
            iconName: 'ClipboardList'
        },
        {
            label: 'Alunos',
            href: '/alunos',
            iconName: 'Users'
        },
        {
            label: 'Intervenções (C2)',
            href: '/intervencoes',
            iconName: 'Layers'
        }
    ],
    MANAGER: [
        {
            label: 'Início',
            href: '/',
            iconName: 'Home'
        },
        {
            label: 'Gestão de Impacto',
            href: '/gestao',
            iconName: 'LayoutDashboard'
        },
        {
            label: 'Mapa de Risco',
            href: '/turma',
            iconName: 'ClipboardList'
        },
        {
            label: 'Alunos',
            href: '/alunos',
            iconName: 'Users'
        },
        {
            label: 'Intervenções (C2)',
            href: '/intervencoes',
            iconName: 'Layers'
        }
    ],
    ADMIN: [
        {
            label: 'Visão Geral',
            href: '/super-admin',
            iconName: 'Home'
        },
        {
            label: 'Escolas',
            href: '/super-admin',
            iconName: 'School'
        },
        {
            label: 'Financeiro',
            href: '/super-admin',
            iconName: 'CreditCard'
        },
        {
            label: 'Usuários',
            href: '/alunos',
            iconName: 'Users'
        },
        {
            label: 'Suporte',
            href: '/super-admin',
            iconName: 'LifeBuoy'
        },
        {
            label: 'Configurações',
            href: '/super-admin',
            iconName: 'Settings'
        }
    ]
};
function getNavForRole(role) {
    return NAV_BY_ROLE[role] ?? [];
}
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/layout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PortalLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/lib/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/components/Sidebar.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$components$2f$Header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/components/Header.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$components$2f$sidebar$2d$nav$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/components/sidebar-nav.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
async function PortalLayout({ children }) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentUser"])();
    if (!user) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/login');
    }
    // Obter o pathname atual para verificar permissão RBAC
    // Nota: Next.js não fornece o pathname diretamente em Server Components,
    // mas podemos passar através do middleware se necessário ou usar headers.
    // Por simplicidade aqui, confiamos no middleware para a proteção básica
    // e no canAccessRoute para lógica de renderização se necessário.
    const navItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$components$2f$sidebar$2d$nav$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getNavForRole"])(user.role);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col h-screen overflow-hidden lg:flex-row bg-slate-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Sidebar"], {
                items: navItems,
                userName: user.name,
                userRole: user.role
            }, void 0, false, {
                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/layout.tsx",
                lineNumber: 29,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1 flex flex-col min-h-0 pt-16 lg:pt-0 overflow-y-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$components$2f$Header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Header"], {
                        userName: user.name,
                        userRole: user.role
                    }, void 0, false, {
                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/layout.tsx",
                        lineNumber: 36,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/layout.tsx",
                        lineNumber: 41,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/layout.tsx",
                lineNumber: 35,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/layout.tsx",
        lineNumber: 28,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=Downloads_Sistema%20de%20Gest%C3%A3o%20Socioemocional_0db55023._.js.map