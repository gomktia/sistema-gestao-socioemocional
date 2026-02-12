(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Downloads/Sistema de Gestão Socioemocional/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Slot$3e$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript) <export * as Slot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2 has-[>svg]:px-3",
            xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
            sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
            lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
            icon: "size-9",
            "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
            "icon-sm": "size-8",
            "icon-lg": "size-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
function Button({ className, variant = "default", size = "default", asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Slot$3e$__["Slot"].Root : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        "data-variant": variant,
        "data-size": size,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/components/ui/button.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LandingPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-client] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2d$circuit$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BrainCircuit$3e$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/lucide-react/dist/esm/icons/brain-circuit.js [app-client] (ecmascript) <export default as BrainCircuit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LineChart$3e$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/lucide-react/dist/esm/icons/chart-line.js [app-client] (ecmascript) <export default as LineChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users2$3e$__ = __turbopack_context__.i("[project]/Downloads/Sistema de Gestão Socioemocional/node_modules/lucide-react/dist/esm/icons/users-round.js [app-client] (ecmascript) <export default as Users2>");
'use client';
;
;
;
;
;
function LandingPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "px-4 lg:px-6 h-20 flex items-center bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        className: "flex items-center justify-center gap-2 group",
                        href: "#",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2d$circuit$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BrainCircuit$3e$__["BrainCircuit"], {
                                    size: 24
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                    lineNumber: 26,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                lineNumber: 25,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-black text-xl tracking-tighter text-slate-900",
                                children: "EduInteligência"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                lineNumber: 28,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                        lineNumber: 24,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "ml-auto flex gap-4 sm:gap-8 items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                className: "text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors hidden md:block",
                                href: "#features",
                                children: "Funcionalidades"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                lineNumber: 31,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                className: "text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors hidden md:block",
                                href: "#impact",
                                children: "Impacto"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                lineNumber: 32,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                className: "text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors",
                                href: "/login",
                                children: "Entrar"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                lineNumber: 33,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                className: "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 font-black text-xs uppercase tracking-widest px-6 h-11",
                                children: "Acessar Demo"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                lineNumber: 34,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                        lineNumber: 30,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                lineNumber: 23,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "w-full py-20 lg:py-32 bg-white relative overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-3xl -z-10"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                lineNumber: 41,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "container px-4 md:px-6 mx-auto",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-12 lg:grid-cols-2 lg:gap-16 items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col justify-center space-y-8 animate-in slide-in-from-left duration-700",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em]",
                                                            children: "SaaS Socioemocional de Próxima Geração"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                            lineNumber: 46,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                            className: "text-4xl font-black tracking-tight sm:text-5xl xl:text-7xl/none text-slate-900",
                                                            children: [
                                                                "A Inteligência que sua Escola precisa para ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-indigo-600",
                                                                    children: "Proteger e Desenvolver"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                                    lineNumber: 48,
                                                                    columnNumber: 84
                                                                }, this),
                                                                " seus alunos."
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                            lineNumber: 47,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "max-w-[540px] text-slate-500 md:text-xl font-medium leading-relaxed",
                                                            children: "A primeira plataforma SaaS que une o framework RTI (Resposta à Intervenção) com dados acadêmicos para prever riscos e sugerir intervenções personalizadas."
                                                        }, void 0, false, {
                                                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                            lineNumber: 50,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                    lineNumber: 45,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col gap-4 min-[400px]:flex-row",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                            className: "bg-indigo-600 hover:bg-indigo-700 h-14 px-8 text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-200",
                                                            children: [
                                                                "Solicitar Proposta ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                                    className: "ml-2",
                                                                    size: 18
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                                    lineNumber: 56,
                                                                    columnNumber: 60
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                            lineNumber: 55,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                            variant: "outline",
                                                            className: "h-14 px-8 border-slate-200 text-sm font-black uppercase tracking-widest hover:bg-slate-50",
                                                            children: "Ver Demonstração"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                            lineNumber: 58,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                    lineNumber: 54,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-4 text-sm font-bold text-slate-400",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex -space-x-2",
                                                            children: [
                                                                1,
                                                                2,
                                                                3
                                                            ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users2$3e$__["Users2"], {
                                                                        size: 14
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                                        lineNumber: 64,
                                                                        columnNumber: 175
                                                                    }, this)
                                                                }, i, false, {
                                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                                    lineNumber: 64,
                                                                    columnNumber: 61
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                            lineNumber: 63,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "+50 Escolas utilizando a metodologia RTI"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                            lineNumber: 66,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                    lineNumber: 62,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                            lineNumber: 44,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative animate-in zoom-in duration-1000",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative z-10 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            alt: "Dashboard Preview",
                                                            className: "aspect-video object-cover",
                                                            src: "https://images.unsplash.com/photo-1551288049-bbbda546697c?q=80&w=2070&auto=format&fit=crop"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                            lineNumber: 71,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/20 to-transparent h-1/2"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                            lineNumber: 76,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                    lineNumber: 70,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute -top-6 -right-6 h-32 w-32 bg-indigo-600 rounded-3xl -z-10 shadow-3xl rotate-12"
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                    lineNumber: 78,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute -bottom-6 -left-6 h-32 w-32 bg-emerald-500 rounded-full -z-10 shadow-3xl opacity-20 blur-2xl"
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                    lineNumber: 79,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                            lineNumber: 69,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                    lineNumber: 43,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                lineNumber: 42,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                        lineNumber: 40,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        id: "impact",
                        className: "w-full py-20 bg-slate-50",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "container px-4 md:px-6 mx-auto",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col items-center justify-center space-y-4 text-center mb-16",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-[10px] font-black text-indigo-600 uppercase tracking-widest",
                                            children: "Resultados Comprovados"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                            lineNumber: 89,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-3xl font-black tracking-tighter sm:text-5xl text-slate-900",
                                            children: "Educação data-driven para decisões assertivas."
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                            lineNumber: 90,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "max-w-[700px] text-slate-500 md:text-lg font-medium",
                                            children: "Nossa plataforma transforma dados complexos em ações pedagógicas claras, reduzindo custos e aumentando a retenção."
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                            lineNumber: 91,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                    lineNumber: 88,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-8 sm:grid-cols-2 lg:grid-cols-3",
                                    children: [
                                        {
                                            title: "Redução de Riscos",
                                            value: "65%",
                                            label: "Queda em alertas críticos (Tier 3) no primeiro ano de uso.",
                                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"],
                                            color: "text-emerald-500"
                                        },
                                        {
                                            title: "Prevenção de Evasão",
                                            value: "40%",
                                            label: "Antecipação de evasão escolar através dos indicadores EWS.",
                                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"],
                                            color: "text-indigo-500"
                                        },
                                        {
                                            title: "Gestão do Tempo",
                                            value: "80%",
                                            label: "Economia de tempo da equipe técnica com PEIs automatizados.",
                                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"],
                                            color: "text-amber-500"
                                        }
                                    ].map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                                            className: "border-none shadow-xl shadow-slate-200/50 bg-white p-8 group hover:-translate-y-2 transition-transform duration-300",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `p-3 rounded-2xl bg-slate-50 inline-block mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors ${item.color}`,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                                        size: 32
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                        lineNumber: 103,
                                                        columnNumber: 41
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                    lineNumber: 102,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-4xl font-black text-slate-900 mb-2",
                                                    children: item.value
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                    lineNumber: 105,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-lg font-bold text-slate-800 mb-4",
                                                    children: item.title
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                    lineNumber: 106,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-slate-500 text-sm font-medium leading-relaxed",
                                                    children: item.label
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                    lineNumber: 107,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, i, true, {
                                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                            lineNumber: 101,
                                            columnNumber: 33
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                    lineNumber: 95,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                            lineNumber: 87,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                        lineNumber: 86,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        id: "features",
                        className: "w-full py-20 bg-white relative",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "container px-4 md:px-6 mx-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid gap-12 lg:grid-cols-2 items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-indigo-600 rounded-[40px] aspect-square flex items-center justify-center overflow-hidden shadow-2xl",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop",
                                                    className: "object-cover w-full h-full opacity-80",
                                                    alt: "School environment"
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                    lineNumber: 120,
                                                    columnNumber: 37
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                lineNumber: 119,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 max-w-[200px]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-1 mb-2",
                                                        children: [
                                                            1,
                                                            2,
                                                            3,
                                                            4,
                                                            5
                                                        ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                                size: 12,
                                                                className: "fill-amber-400 text-amber-400"
                                                            }, i, false, {
                                                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                                lineNumber: 128,
                                                                columnNumber: 67
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                        lineNumber: 127,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs font-bold text-slate-700 italic",
                                                        children: '"Mudou completamente o clima escolar do Colégio."'
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                        lineNumber: 130,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                lineNumber: 126,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                        lineNumber: 118,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-10",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "text-4xl font-black tracking-tighter text-slate-900",
                                                        children: "O que a sua escola ganha?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                        lineNumber: 135,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-slate-500 font-medium",
                                                        children: "Combinamos psicologia positiva com machine learning para resultados pedagógicos."
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                        lineNumber: 136,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                lineNumber: 134,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-6",
                                                children: [
                                                    {
                                                        title: "RTI Socioemocional",
                                                        desc: "Framework de resposta à intervenção automatizado para camadas 1, 2 e 3.",
                                                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"]
                                                    },
                                                    {
                                                        title: "Early Warning System (EWS)",
                                                        desc: "Alerta precoce cruzando faltas, notas e comportamento.",
                                                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LineChart$3e$__["LineChart"]
                                                    },
                                                    {
                                                        title: "Framework VIA Strengths",
                                                        desc: "Mapeamento completo das 24 forças de caráter dos alunos.",
                                                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2d$circuit$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BrainCircuit$3e$__["BrainCircuit"]
                                                    },
                                                    {
                                                        title: "Protocolos de Crise Digital",
                                                        desc: "Encaminhamentos automáticos para rede de saúde (CAPS/SAMU).",
                                                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"]
                                                    }
                                                ].map((feat, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(feat.icon, {
                                                                    size: 24
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                                    lineNumber: 147,
                                                                    columnNumber: 49
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                                lineNumber: 146,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        className: "font-bold text-slate-900",
                                                                        children: feat.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                                        lineNumber: 150,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-slate-500 mt-1",
                                                                        children: feat.desc
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                                        lineNumber: 151,
                                                                        columnNumber: 49
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                                lineNumber: 149,
                                                                columnNumber: 45
                                                            }, this)
                                                        ]
                                                    }, i, true, {
                                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                        lineNumber: 145,
                                                        columnNumber: 41
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                lineNumber: 138,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                        lineNumber: 133,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                lineNumber: 117,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                            lineNumber: 116,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                        lineNumber: 115,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "w-full py-20 bg-indigo-600 relative overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 bg-indigo-900/20"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                lineNumber: 163,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "container px-4 md:px-6 mx-auto relative z-10 text-center space-y-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-3xl font-black tracking-tighter sm:text-6xl text-white",
                                        children: "Pronto para digitalizar o suporte socioemocional?"
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                        lineNumber: 165,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "max-w-[800px] mx-auto text-indigo-100 text-lg md:text-xl font-medium",
                                        children: "Agende uma reunião estratégica agora e descubra como o EduInteligência pode transformar o desempenho e o bem-estar dos seus alunos."
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                        lineNumber: 166,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col sm:flex-row gap-4 justify-center pt-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                className: "bg-white text-indigo-600 hover:bg-indigo-50 h-16 px-12 text-md font-black uppercase tracking-widest shadow-2xl",
                                                children: "Começar Agora"
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                lineNumber: 170,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "outline",
                                                className: "h-16 px-12 text-md font-black uppercase tracking-widest bg-transparent border-white text-white hover:bg-white/10",
                                                children: "Falar com consultor"
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                lineNumber: 173,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                        lineNumber: 169,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                lineNumber: 164,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                        lineNumber: 162,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                lineNumber: 38,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "w-full py-12 bg-white border-t border-slate-100",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container px-4 md:px-6 mx-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-12 sm:grid-cols-2 lg:grid-cols-4 mb-12",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            className: "flex items-center gap-2",
                                            href: "#",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2d$circuit$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BrainCircuit$3e$__["BrainCircuit"], {
                                                    className: "text-indigo-600",
                                                    size: 28
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                    lineNumber: 186,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-black text-xl tracking-tighter text-slate-900",
                                                    children: "EduInteligência"
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                    lineNumber: 187,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                            lineNumber: 185,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-slate-500 font-medium",
                                            children: "Transformando a educação através de dados, psicologia e inteligência artificial."
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                            lineNumber: 189,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                    lineNumber: 184,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "font-black text-xs uppercase tracking-widest mb-6",
                                            children: "Plataforma"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                            lineNumber: 194,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "space-y-4 text-sm font-bold text-slate-400",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "#",
                                                        className: "hover:text-indigo-600 transition-colors",
                                                        children: "Framework RTI"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                        lineNumber: 196,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                    lineNumber: 196,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "#",
                                                        className: "hover:text-indigo-600 transition-colors",
                                                        children: "VIA Strengths"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                        lineNumber: 197,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                    lineNumber: 197,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "#",
                                                        className: "hover:text-indigo-600 transition-colors",
                                                        children: "Alertas EWS"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                        lineNumber: 198,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                    lineNumber: 198,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                            lineNumber: 195,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                    lineNumber: 193,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "font-black text-xs uppercase tracking-widest mb-6",
                                            children: "Escola"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                            lineNumber: 202,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "space-y-4 text-sm font-bold text-slate-400",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "#",
                                                        className: "hover:text-indigo-600 transition-colors",
                                                        children: "Casos de Sucesso"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                        lineNumber: 204,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                    lineNumber: 204,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "#",
                                                        className: "hover:text-indigo-600 transition-colors",
                                                        children: "Metodologia"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                        lineNumber: 205,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                    lineNumber: 205,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "#",
                                                        className: "hover:text-indigo-600 transition-colors",
                                                        children: "Página de Preços"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                        lineNumber: 206,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                    lineNumber: 206,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                            lineNumber: 203,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                    lineNumber: 201,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "font-black text-xs uppercase tracking-widest mb-6",
                                            children: "Suporte"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                            lineNumber: 210,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "space-y-4 text-sm font-bold text-slate-400",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "#",
                                                        className: "hover:text-indigo-600 transition-colors",
                                                        children: "Centro de Ajuda"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                        lineNumber: 212,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                    lineNumber: 212,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "#",
                                                        className: "hover:text-indigo-600 transition-colors",
                                                        children: "Fale conosco"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                        lineNumber: 213,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                    lineNumber: 213,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "#",
                                                        className: "hover:text-indigo-600 transition-colors",
                                                        children: "Privacidade & LGPD"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                        lineNumber: 214,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                    lineNumber: 214,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                            lineNumber: 211,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                    lineNumber: 209,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                            lineNumber: 183,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pt-8 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[10px] font-black text-slate-400 uppercase tracking-widest",
                                    children: "© 2026 EduInteligência SaaS. Todos os direitos reservados."
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                    lineNumber: 219,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "#",
                                            className: "text-slate-400 hover:text-indigo-600",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users2$3e$__["Users2"], {
                                                size: 20
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                lineNumber: 221,
                                                columnNumber: 93
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                            lineNumber: 221,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "#",
                                            className: "text-slate-400 hover:text-indigo-600",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                                size: 20
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                                lineNumber: 222,
                                                columnNumber: 93
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                            lineNumber: 222,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                                    lineNumber: 220,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                            lineNumber: 218,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                    lineNumber: 182,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
                lineNumber: 181,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
        lineNumber: 21,
        columnNumber: 9
    }, this);
}
_c = LandingPage;
function Card({ children, className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Sistema__de__Gest$e3$o__Socioemocional$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-[2rem] border border-slate-200", className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/Downloads/Sistema de Gestão Socioemocional/app/marketing/page.tsx",
        lineNumber: 241,
        columnNumber: 9
    }, this);
}
_c1 = Card;
var _c, _c1;
__turbopack_context__.k.register(_c, "LandingPage");
__turbopack_context__.k.register(_c1, "Card");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Downloads_Sistema%20de%20Gest%C3%A3o%20Socioemocional_ca24558b._.js.map