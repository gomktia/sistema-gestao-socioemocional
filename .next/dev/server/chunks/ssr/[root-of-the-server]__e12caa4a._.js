module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/src/core/types/index.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================================
// TIPOS DO DOMÍNIO - Sistema de Gestão Socioemocional
// ============================================================
// --- Enums ---
__turbopack_context__.s([
    "CharacterStrength",
    ()=>CharacterStrength,
    "GradeLevel",
    ()=>GradeLevel,
    "RiskColor",
    ()=>RiskColor,
    "RiskDomain",
    ()=>RiskDomain,
    "RiskTier",
    ()=>RiskTier,
    "ScreeningWindow",
    ()=>ScreeningWindow,
    "UserRole",
    ()=>UserRole,
    "VirtueCategory",
    ()=>VirtueCategory
]);
var GradeLevel = /*#__PURE__*/ function(GradeLevel) {
    GradeLevel["PRIMEIRO_ANO"] = "ANO_1_EM";
    GradeLevel["SEGUNDO_ANO"] = "ANO_2_EM";
    GradeLevel["TERCEIRO_ANO"] = "ANO_3_EM";
    return GradeLevel;
}({});
var RiskTier = /*#__PURE__*/ function(RiskTier) {
    RiskTier["TIER_1"] = "TIER_1";
    RiskTier["TIER_2"] = "TIER_2";
    RiskTier["TIER_3"] = "TIER_3";
    return RiskTier;
}({});
var RiskColor = /*#__PURE__*/ function(RiskColor) {
    RiskColor["GREEN"] = "GREEN";
    RiskColor["YELLOW"] = "YELLOW";
    RiskColor["RED"] = "RED";
    return RiskColor;
}({});
var RiskDomain = /*#__PURE__*/ function(RiskDomain) {
    RiskDomain["EXTERNALIZING"] = "EXTERNALIZING";
    RiskDomain["INTERNALIZING"] = "INTERNALIZING";
    return RiskDomain;
}({});
var UserRole = /*#__PURE__*/ function(UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["MANAGER"] = "MANAGER";
    UserRole["PSYCHOLOGIST"] = "PSYCHOLOGIST";
    UserRole["COUNSELOR"] = "COUNSELOR";
    UserRole["TEACHER"] = "TEACHER";
    UserRole["STUDENT"] = "STUDENT";
    return UserRole;
}({});
var ScreeningWindow = /*#__PURE__*/ function(ScreeningWindow) {
    ScreeningWindow["DIAGNOSTIC"] = "DIAGNOSTIC";
    ScreeningWindow["MONITORING"] = "MONITORING";
    ScreeningWindow["FINAL"] = "FINAL";
    return ScreeningWindow;
}({});
var VirtueCategory = /*#__PURE__*/ function(VirtueCategory) {
    VirtueCategory["SABEDORIA"] = "SABEDORIA";
    VirtueCategory["CORAGEM"] = "CORAGEM";
    VirtueCategory["HUMANIDADE"] = "HUMANIDADE";
    VirtueCategory["JUSTICA"] = "JUSTICA";
    VirtueCategory["MODERACAO"] = "MODERACAO";
    VirtueCategory["TRANSCENDENCIA"] = "TRANSCENDENCIA";
    return VirtueCategory;
}({});
var CharacterStrength = /*#__PURE__*/ function(CharacterStrength) {
    CharacterStrength["CRIATIVIDADE"] = "CRIATIVIDADE";
    CharacterStrength["CURIOSIDADE"] = "CURIOSIDADE";
    CharacterStrength["PENSAMENTO_CRITICO"] = "PENSAMENTO_CRITICO";
    CharacterStrength["AMOR_APRENDIZADO"] = "AMOR_APRENDIZADO";
    CharacterStrength["SENSATEZ"] = "SENSATEZ";
    CharacterStrength["BRAVURA"] = "BRAVURA";
    CharacterStrength["PERSEVERANCA"] = "PERSEVERANCA";
    CharacterStrength["AUTENTICIDADE"] = "AUTENTICIDADE";
    CharacterStrength["VITALIDADE"] = "VITALIDADE";
    CharacterStrength["AMOR"] = "AMOR";
    CharacterStrength["BONDADE"] = "BONDADE";
    CharacterStrength["INTELIGENCIA_SOCIAL"] = "INTELIGENCIA_SOCIAL";
    CharacterStrength["CIDADANIA"] = "CIDADANIA";
    CharacterStrength["IMPARCIALIDADE"] = "IMPARCIALIDADE";
    CharacterStrength["LIDERANCA"] = "LIDERANCA";
    CharacterStrength["PERDAO"] = "PERDAO";
    CharacterStrength["MODESTIA"] = "MODESTIA";
    CharacterStrength["PRUDENCIA"] = "PRUDENCIA";
    CharacterStrength["AUTORREGULACAO"] = "AUTORREGULACAO";
    CharacterStrength["APRECIACAO_BELO"] = "APRECIACAO_BELO";
    CharacterStrength["GRATIDAO"] = "GRATIDAO";
    CharacterStrength["HUMOR"] = "HUMOR";
    CharacterStrength["ESPERANCA"] = "ESPERANCA";
    CharacterStrength["ESPIRITUALIDADE"] = "ESPIRITUALIDADE";
    return CharacterStrength;
}({});
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/lib/utils.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/clsx/dist/clsx.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-rsc] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/components/domain/TierBadge.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RiskTier",
    ()=>RiskTier,
    "TierBadge",
    ()=>TierBadge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/lib/utils.ts [app-rsc] (ecmascript)");
;
;
var RiskTier = /*#__PURE__*/ function(RiskTier) {
    RiskTier["TIER_1"] = "TIER_1";
    RiskTier["TIER_2"] = "TIER_2";
    RiskTier["TIER_3"] = "TIER_3";
    return RiskTier;
}({});
const TIER_CONFIG = {
    ["TIER_1"]: {
        label: 'Rastro Verde (Universal)',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500'
    },
    ["TIER_2"]: {
        label: 'Rastro Amarelo (Focalizado)',
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500'
    },
    ["TIER_3"]: {
        label: 'Rastro Vermelho (Intensivo)',
        color: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500'
    }
};
function TierBadge({ tier, showLabel = true, className }) {
    const config = TIER_CONFIG[tier] || TIER_CONFIG["TIER_1"];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider', config.color, className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])('h-1.5 w-1.5 rounded-full', config.dot)
            }, void 0, false, {
                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/components/domain/TierBadge.tsx",
                lineNumber: 42,
                columnNumber: 13
            }, this),
            showLabel ? config.label : tier
        ]
    }, void 0, true, {
        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/components/domain/TierBadge.tsx",
        lineNumber: 37,
        columnNumber: 9
    }, this);
}
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/components/ui/card.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardAction",
    ()=>CardAction,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/lib/utils.ts [app-rsc] (ecmascript)");
;
;
function Card({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/components/ui/card.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
function CardHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/components/ui/card.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
function CardTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("leading-none font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/components/ui/card.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
function CardDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/components/ui/card.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
function CardAction({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-action",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/components/ui/card.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
function CardContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("px-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/components/ui/card.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
function CardFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("flex items-center px-6 [.border-t]:pt-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/components/ui/card.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/alunos/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AlunosPage,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/lib/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$src$2f$core$2f$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/src/core/types/index.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$components$2f$domain$2f$TierBadge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/components/domain/TierBadge.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/components/ui/card.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$search$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__UserSearch$3e$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/lucide-react/dist/esm/icons/user-search.js [app-rsc] (ecmascript) <export default as UserSearch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-rsc] (ecmascript) <export default as ChevronRight>");
;
;
;
;
;
;
;
;
;
const metadata = {
    title: 'Gestão de Alunos'
};
async function AlunosPage() {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentUser"])();
    const allowedRoles = [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$src$2f$core$2f$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UserRole"].PSYCHOLOGIST,
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$src$2f$core$2f$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UserRole"].COUNSELOR,
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$src$2f$core$2f$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UserRole"].MANAGER,
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$src$2f$core$2f$types$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UserRole"].ADMIN
    ];
    if (!user || !allowedRoles.includes(user.role)) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/');
    }
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: students } = await supabase.from('students').select('id, name, grade').eq('tenantId', user.tenantId).eq('isActive', true).order('name');
    const { data: assessments } = await supabase.from('assessments').select('studentId, overallTier').eq('tenantId', user.tenantId).eq('type', 'SRSS_IE').eq('academicYear', new Date().getFullYear());
    const tierMap = new Map((assessments || []).map((a)=>[
            a.studentId,
            a.overallTier
        ]));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl font-black text-slate-900 tracking-tight",
                            children: "Gestão de Alunos"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/alunos/page.tsx",
                            lineNumber: 44,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-slate-500 mt-1",
                            children: "Monitore o risco socioemocional e planeje intervenções."
                        }, void 0, false, {
                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/alunos/page.tsx",
                            lineNumber: 45,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/alunos/page.tsx",
                    lineNumber: 43,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/alunos/page.tsx",
                lineNumber: 42,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-3",
                children: students?.map((student)=>{
                    const tier = tierMap.get(student.id);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        href: `/alunos/${student.id}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                            className: "hover:border-indigo-300 hover:shadow-md transition-all group",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "p-4 flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$search$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__UserSearch$3e$__["UserSearch"], {
                                                    size: 20
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/alunos/page.tsx",
                                                    lineNumber: 58,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/alunos/page.tsx",
                                                lineNumber: 57,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "font-bold text-slate-800 group-hover:text-indigo-600 transition-colors",
                                                        children: student.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/alunos/page.tsx",
                                                        lineNumber: 61,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest",
                                                        children: student.grade
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/alunos/page.tsx",
                                                        lineNumber: 62,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/alunos/page.tsx",
                                                lineNumber: 60,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/alunos/page.tsx",
                                        lineNumber: 56,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-4",
                                        children: [
                                            tier ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$components$2f$domain$2f$TierBadge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TierBadge"], {
                                                tier: tier
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/alunos/page.tsx",
                                                lineNumber: 68,
                                                columnNumber: 45
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] font-black text-slate-300 uppercase tracking-tighter",
                                                children: "Pendente"
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/alunos/page.tsx",
                                                lineNumber: 70,
                                                columnNumber: 45
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                className: "text-slate-300 group-hover:text-indigo-400 transition-colors",
                                                size: 20
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/alunos/page.tsx",
                                                lineNumber: 72,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/alunos/page.tsx",
                                        lineNumber: 66,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/alunos/page.tsx",
                                lineNumber: 55,
                                columnNumber: 33
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/alunos/page.tsx",
                            lineNumber: 54,
                            columnNumber: 29
                        }, this)
                    }, student.id, false, {
                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/alunos/page.tsx",
                        lineNumber: 53,
                        columnNumber: 25
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/alunos/page.tsx",
                lineNumber: 49,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/alunos/page.tsx",
        lineNumber: 41,
        columnNumber: 9
    }, this);
}
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/alunos/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/app/(portal)/alunos/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e12caa4a._.js.map