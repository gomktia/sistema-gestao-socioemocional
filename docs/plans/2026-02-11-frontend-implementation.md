# Frontend Implementation Plan - Sistema de Gestao Socioemocional

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the complete Next.js frontend for the socioemotional management SaaS, connecting to the existing scoring engine, RBAC, and Supabase backend.

**Architecture:** Next.js App Router with route groups `(auth)` and `(portal)`. Server Components by default, Client Components only for interactivity (questionnaire, grid, charts). Server Actions for all data mutations. Supabase SSR for auth with middleware-based RBAC route protection.

**Tech Stack:** Next.js 15, React 19, Supabase SSR, Tailwind CSS 4, shadcn/ui, Recharts, Prisma Client (existing)

**Existing Core (DO NOT modify):**
- `src/core/types/index.ts` - Domain types: UserRole, GradeLevel, RiskTier, VirtueCategory, CharacterStrength, StudentProfile, StrengthScore, etc.
- `src/core/logic/scoring.ts` - Scoring engine: calculateStudentProfile, calculateStrengthScores, calculateRiskScores, generateGradeAlerts, generateInterventionSuggestions, VIA_STRENGTH_MAP, SRSS_ITEMS
- `src/core/rbac/permissions.ts` - RBAC: hasPermission, filterProfileByRole, Permission enum
- `prisma/schema.prisma` - Database schema: Tenant, User, Student, Classroom, Assessment, InterventionLog

**Design Document:** `docs/plans/2026-02-11-navigation-flow-design.md`

---

## Task 1: Initialize Next.js inside existing project

The project currently has a plain TypeScript setup. We need to convert it to Next.js while preserving the existing `src/core/` module.

**Files:**
- Modify: `package.json`
- Modify: `tsconfig.json`
- Create: `next.config.ts`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `tailwind.config.ts`
- Create: `app/globals.css`
- Modify: `.env.example` (add NEXT_PUBLIC_ vars)

**Step 1: Install Next.js + React + Tailwind dependencies**

```bash
npm install next@latest react@latest react-dom@latest @supabase/supabase-js @supabase/ssr
npm install -D tailwindcss@latest @tailwindcss/postcss postcss autoprefixer @types/react @types/react-dom
```

**Step 2: Update package.json scripts**

Replace the existing scripts block with:
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev"
  }
}
```

**Step 3: Replace tsconfig.json for Next.js**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"],
      "@core/*": ["./src/core/*"]
    },
    "baseUrl": "."
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Step 4: Create next.config.ts**

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
```

**Step 5: Create app/globals.css**

```css
@import "tailwindcss";
```

**Step 6: Create app/layout.tsx (root layout)**

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gestao Socioemocional',
  description: 'Sistema de Gestao Socioemocional - RTI + VIA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

**Step 7: Create app/page.tsx (temporary landing)**

```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Gestao Socioemocional</h1>
    </main>
  );
}
```

**Step 8: Update .env.example**

Add these lines to the existing .env.example:
```
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

**Step 9: Add NEXT_PUBLIC_ vars to .env**

Copy the existing SUPABASE_URL and SUPABASE_ANON_KEY values with NEXT_PUBLIC_ prefix:
```
NEXT_PUBLIC_SUPABASE_URL=<same as SUPABASE_URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<same as SUPABASE_ANON_KEY>
```

**Step 10: Run dev server to verify**

```bash
npm run dev
```
Expected: Server starts at http://localhost:3000, shows "Gestao Socioemocional" centered on page.

**Step 11: Commit**

```bash
git add -A && git commit -m "feat: initialize Next.js app with Tailwind CSS"
```

---

## Task 2: Setup shadcn/ui + design system tokens

**Files:**
- Modify: `app/globals.css`
- Create: `components/ui/` (via shadcn CLI)
- Create: `lib/utils.ts`
- Create: `components.json`

**Step 1: Initialize shadcn**

```bash
npx shadcn@latest init
```

When prompted, select:
- Style: New York
- Base color: Slate
- CSS variables: Yes

**Step 2: Add essential shadcn components**

```bash
npx shadcn@latest add button card badge progress tabs table dialog sheet separator avatar tooltip skeleton sonner
```

**Step 3: Add design system tokens to globals.css**

Append after the existing @import:
```css
:root {
  /* RTI Tier Colors */
  --tier-1: 142.1 76.2% 36.3%;  /* green-500 */
  --tier-2: 47.9 95.8% 53.1%;   /* yellow-500 */
  --tier-3: 0 84.2% 60.2%;      /* red-500 */

  /* Virtue Colors */
  --virtue-sabedoria: 217.2 91.2% 59.8%;       /* blue-500 */
  --virtue-coragem: 24.6 95% 53.1%;             /* orange-500 */
  --virtue-humanidade: 330.4 81.2% 60.4%;       /* pink-500 */
  --virtue-justica: 258.3 89.5% 63.7%;          /* violet-500 */
  --virtue-moderacao: 188.7 94.5% 42.7%;        /* cyan-500 */
  --virtue-transcendencia: 271.5 81.3% 55.9%;   /* purple-500 */
}
```

**Step 4: Run dev to verify components load**

```bash
npm run dev
```

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: add shadcn/ui components and design system tokens"
```

---

## Task 3: Supabase client helpers (browser + server + middleware)

**Files:**
- Create: `lib/supabase/client.ts` (browser client)
- Create: `lib/supabase/server.ts` (server component client)
- Create: `lib/supabase/middleware.ts` (middleware client)

**Step 1: Create browser client**

Create `lib/supabase/client.ts`:
```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**Step 2: Create server client**

Create `lib/supabase/server.ts`:
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component - ignore
          }
        },
      },
    }
  );
}
```

**Step 3: Create middleware helper**

Create `lib/supabase/middleware.ts`:
```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user, response: supabaseResponse };
}
```

**Step 4: Commit**

```bash
git add lib/supabase/ && git commit -m "feat: add Supabase client helpers (browser, server, middleware)"
```

---

## Task 4: Auth middleware with RBAC route protection

**Files:**
- Create: `middleware.ts` (project root)
- Create: `lib/auth.ts` (user role resolver)

**Step 1: Create role resolver**

Create `lib/auth.ts`:
```typescript
import { createClient } from '@/lib/supabase/server';
import { UserRole } from '@core/types';

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
  studentId: string | null;
}

export async function getCurrentUser(): Promise<AppUser | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: dbUser } = await supabase
    .from('users')
    .select('id, email, name, role, tenantId, studentId')
    .eq('supabaseUid', user.id)
    .single();

  if (!dbUser) return null;

  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    role: dbUser.role as UserRole,
    tenantId: dbUser.tenantId,
    studentId: dbUser.studentId,
  };
}

const ROLE_HOME: Record<string, string> = {
  STUDENT: '/minhas-forcas',
  TEACHER: '/turma',
  PSYCHOLOGIST: '/alunos',
  COUNSELOR: '/alunos',
  MANAGER: '/turma',
  ADMIN: '/gestao',
};

export function getHomeForRole(role: string): string {
  return ROLE_HOME[role] ?? '/';
}

const ROUTE_ACCESS: Record<string, string[]> = {
  '/questionario': ['STUDENT'],
  '/minhas-forcas': ['STUDENT'],
  '/turma': ['TEACHER', 'MANAGER', 'ADMIN'],
  '/alunos': ['PSYCHOLOGIST', 'COUNSELOR', 'MANAGER', 'ADMIN'],
  '/intervencoes': ['PSYCHOLOGIST', 'COUNSELOR', 'MANAGER', 'ADMIN'],
  '/relatorios': ['PSYCHOLOGIST', 'COUNSELOR', 'MANAGER', 'ADMIN'],
  '/gestao': ['MANAGER', 'ADMIN'],
};

export function canAccessRoute(role: string, pathname: string): boolean {
  const matchedRoute = Object.keys(ROUTE_ACCESS).find(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );
  if (!matchedRoute) return true; // Routes not in map are public within portal
  return ROUTE_ACCESS[matchedRoute].includes(role);
}
```

**Step 2: Create middleware.ts**

Create `middleware.ts` at project root:
```typescript
import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const PUBLIC_PATHS = ['/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const { user, response } = await updateSession(request);

  // Not authenticated -> redirect to login (except public paths)
  if (!user && !PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Authenticated on login page -> redirect to home
  if (user && pathname.startsWith('/login')) {
    const url = request.nextUrl.clone();
    url.pathname = '/'; // Will be resolved by portal page.tsx
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

Note: Full RBAC route checking happens in the `(portal)/layout.tsx` server component where we have access to the database user role. The middleware handles only auth session refresh and login redirect.

**Step 3: Commit**

```bash
git add middleware.ts lib/auth.ts && git commit -m "feat: add auth middleware and RBAC route resolver"
```

---

## Task 5: Login page

**Files:**
- Create: `app/(auth)/layout.tsx`
- Create: `app/(auth)/login/page.tsx`
- Create: `app/(auth)/login/actions.ts`

**Step 1: Create auth layout**

Create `app/(auth)/layout.tsx`:
```tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
```

**Step 2: Create login server action**

Create `app/(auth)/login/actions.ts`:
```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: 'Email ou senha incorretos.' };
  }

  redirect('/');
}
```

**Step 3: Create login page**

Create `app/(auth)/login/page.tsx`:
```tsx
'use client';

import { useState } from 'react';
import { login } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-xl">Gestao Socioemocional</CardTitle>
        <p className="text-center text-sm text-muted-foreground">
          Entre com suas credenciais
        </p>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

**Step 4: Commit**

```bash
git add app/\(auth\)/ && git commit -m "feat: add login page with Supabase Auth"
```

---

## Task 6: Portal layout with dynamic sidebar

**Files:**
- Create: `app/(portal)/layout.tsx`
- Create: `app/(portal)/page.tsx`
- Create: `components/sidebar.tsx`
- Create: `components/sidebar-nav.tsx`

**Step 1: Create sidebar nav config**

Create `components/sidebar-nav.tsx`:
```tsx
import { UserRole } from '@core/types';
import {
  Home, ClipboardList, Trophy, LayoutDashboard,
  Users, FileText, Settings, Target
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_BY_ROLE: Record<string, NavItem[]> = {
  STUDENT: [
    { label: 'Inicio', href: '/', icon: Home },
    { label: 'Responder VIA', href: '/questionario', icon: ClipboardList },
    { label: 'Minhas Forcas', href: '/minhas-forcas', icon: Trophy },
  ],
  TEACHER: [
    { label: 'Inicio', href: '/', icon: Home },
    { label: 'Dashboard da Turma', href: '/turma', icon: LayoutDashboard },
    { label: 'Preencher SRSS-IE', href: '/turma/triagem', icon: ClipboardList },
  ],
  PSYCHOLOGIST: [
    { label: 'Inicio', href: '/', icon: Home },
    { label: 'Dashboard', href: '/turma', icon: LayoutDashboard },
    { label: 'Alunos', href: '/alunos', icon: Users },
    { label: 'Intervencoes', href: '/intervencoes', icon: Target },
    { label: 'Relatorios', href: '/relatorios', icon: FileText },
  ],
  COUNSELOR: [
    { label: 'Inicio', href: '/', icon: Home },
    { label: 'Dashboard', href: '/turma', icon: LayoutDashboard },
    { label: 'Alunos', href: '/alunos', icon: Users },
    { label: 'Intervencoes', href: '/intervencoes', icon: Target },
    { label: 'Relatorios', href: '/relatorios', icon: FileText },
  ],
  MANAGER: [
    { label: 'Inicio', href: '/', icon: Home },
    { label: 'Dashboard', href: '/turma', icon: LayoutDashboard },
    { label: 'Alunos', href: '/alunos', icon: Users },
    { label: 'Intervencoes', href: '/intervencoes', icon: Target },
    { label: 'Relatorios', href: '/relatorios', icon: FileText },
    { label: 'Gestao', href: '/gestao', icon: Settings },
  ],
  ADMIN: [
    { label: 'Inicio', href: '/', icon: Home },
    { label: 'Dashboard', href: '/turma', icon: LayoutDashboard },
    { label: 'Alunos', href: '/alunos', icon: Users },
    { label: 'Intervencoes', href: '/intervencoes', icon: Target },
    { label: 'Relatorios', href: '/relatorios', icon: FileText },
    { label: 'Gestao', href: '/gestao', icon: Settings },
  ],
};

export function getNavForRole(role: string): NavItem[] {
  return NAV_BY_ROLE[role] ?? [];
}
```

**Step 2: Create sidebar component**

Create `components/sidebar.tsx`:
```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NavItem } from './sidebar-nav';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, LogOut } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  items: NavItem[];
  userName: string;
  userRole: string;
}

function NavLinks({ items, pathname, onSelect }: {
  items: NavItem[];
  pathname: string;
  onSelect?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1 p-3">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onSelect}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
              active
                ? 'bg-indigo-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar({ items, userName, userRole }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const roleLabels: Record<string, string> = {
    STUDENT: 'Aluno',
    TEACHER: 'Professor',
    PSYCHOLOGIST: 'Psicologo',
    COUNSELOR: 'Orientador',
    MANAGER: 'Gestor',
    ADMIN: 'Admin',
  };

  const sidebarContent = (
    <>
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-sm font-bold text-white">Gestao Socioemocional</h2>
      </div>
      <NavLinks items={items} pathname={pathname} onSelect={() => setOpen(false)} />
      <div className="mt-auto p-4 border-t border-slate-700">
        <p className="text-xs text-slate-400 truncate">{userName}</p>
        <p className="text-xs text-slate-500">{roleLabels[userRole] ?? userRole}</p>
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="mt-2 flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <LogOut className="h-3 w-3" />
            Sair
          </button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-56 md:flex-col md:fixed md:inset-y-0 bg-slate-900">
        {sidebarContent}
      </aside>

      {/* Mobile header + sheet */}
      <div className="md:hidden flex items-center justify-between p-3 bg-slate-900 text-white sticky top-0 z-40">
        <span className="text-sm font-bold">Gestao Socioemocional</span>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-56 p-0 bg-slate-900 border-none">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
```

**Step 3: Create portal layout**

Create `app/(portal)/layout.tsx`:
```tsx
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { canAccessRoute } from '@/lib/auth';
import { Sidebar } from '@/components/sidebar';
import { getNavForRole } from '@/components/sidebar-nav';
import { headers } from 'next/headers';

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  // RBAC route check
  const headerList = await headers();
  const pathname = headerList.get('x-pathname') ?? '/';
  if (!canAccessRoute(user.role, pathname)) {
    redirect('/');
  }

  const navItems = getNavForRole(user.role);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar items={navItems} userName={user.name} userRole={user.role} />
      <main className="md:ml-56 p-4 md:p-6">{children}</main>
    </div>
  );
}
```

**Step 4: Create portal home (redirect by role)**

Create `app/(portal)/page.tsx`:
```tsx
import { redirect } from 'next/navigation';
import { getCurrentUser, getHomeForRole } from '@/lib/auth';

export default async function PortalHome() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const home = getHomeForRole(user.role);
  if (home !== '/') redirect(home);

  return (
    <div className="text-center py-20">
      <h1 className="text-2xl font-bold">Bem-vindo ao Gestao Socioemocional</h1>
      <p className="text-muted-foreground mt-2">Selecione uma opcao no menu lateral.</p>
    </div>
  );
}
```

**Step 5: Create sign-out API route**

Create `app/api/auth/signout/route.ts`:
```typescript
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:3000'));
}
```

Note: The sign-out redirect URL should use the app's URL, not Supabase URL. Fix during implementation to use request headers for the origin.

**Step 6: Run dev and verify login -> sidebar flow**

```bash
npm run dev
```

Expected: Visiting / redirects to /login. After login, sidebar appears with role-appropriate items.

**Step 7: Commit**

```bash
git add app/\(portal\)/ components/sidebar.tsx components/sidebar-nav.tsx app/api/ && git commit -m "feat: add portal layout with dynamic sidebar and role-based navigation"
```

---

## Task 7: Domain UI components (TierBadge, StrengthBar, etc.)

**Files:**
- Create: `components/domain/tier-badge.tsx`
- Create: `components/domain/strength-bar.tsx`
- Create: `components/domain/risk-summary-card.tsx`
- Create: `components/domain/virtue-group.tsx`
- Create: `components/domain/crossover-card.tsx`

**Step 1: Create TierBadge**

Create `components/domain/tier-badge.tsx`:
```tsx
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const TIER_CONFIG = {
  TIER_1: { label: 'Tier 1', color: 'bg-green-500 text-white', dot: 'bg-green-400' },
  TIER_2: { label: 'Tier 2', color: 'bg-yellow-500 text-black', dot: 'bg-yellow-400' },
  TIER_3: { label: 'Tier 3', color: 'bg-red-500 text-white', dot: 'bg-red-400' },
} as const;

interface TierBadgeProps {
  tier: keyof typeof TIER_CONFIG;
  showLabel?: boolean;
  className?: string;
}

export function TierBadge({ tier, showLabel = true, className }: TierBadgeProps) {
  const config = TIER_CONFIG[tier];
  return (
    <Badge className={cn(config.color, 'gap-1.5', className)}>
      <span className={cn('h-2 w-2 rounded-full', config.dot)} />
      {showLabel && config.label}
    </Badge>
  );
}
```

**Step 2: Create StrengthBar**

Create `components/domain/strength-bar.tsx`:
```tsx
import { cn } from '@/lib/utils';

const VIRTUE_COLORS: Record<string, string> = {
  SABEDORIA: 'bg-blue-500',
  CORAGEM: 'bg-orange-500',
  HUMANIDADE: 'bg-pink-500',
  JUSTICA: 'bg-violet-500',
  MODERACAO: 'bg-cyan-500',
  TRANSCENDENCIA: 'bg-purple-500',
};

interface StrengthBarProps {
  label: string;
  score: number; // 0-100
  virtue: string;
}

export function StrengthBar({ label, score, virtue }: StrengthBarProps) {
  const barColor = VIRTUE_COLORS[virtue] ?? 'bg-slate-500';
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm w-40 truncate">{label}</span>
      <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', barColor)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-8 text-right">{score}</span>
    </div>
  );
}
```

**Step 3: Create RiskSummaryCard**

Create `components/domain/risk-summary-card.tsx`:
```tsx
import { Card, CardContent } from '@/components/ui/card';
import { TierBadge } from './tier-badge';

interface RiskSubscale {
  domain: string;
  score: number;
  maxPossible: number;
  tier: string;
  label: string;
}

interface RiskSummaryCardProps {
  externalizing: RiskSubscale;
  internalizing: RiskSubscale;
  overallTier: string;
}

export function RiskSummaryCard({ externalizing, internalizing, overallTier }: RiskSummaryCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Risco Geral</h3>
          <TierBadge tier={overallTier as 'TIER_1' | 'TIER_2' | 'TIER_3'} />
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Externalizante</span>
            <span className="font-mono">{externalizing.score}/{externalizing.maxPossible}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Internalizante</span>
            <span className="font-mono">{internalizing.score}/{internalizing.maxPossible}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Step 4: Create VirtueGroup**

Create `components/domain/virtue-group.tsx`:
```tsx
'use client';

import { useState } from 'react';
import { StrengthBar } from './strength-bar';
import { ChevronDown, ChevronRight } from 'lucide-react';

const VIRTUE_LABELS: Record<string, string> = {
  SABEDORIA: 'Sabedoria',
  CORAGEM: 'Coragem',
  HUMANIDADE: 'Humanidade',
  JUSTICA: 'Justica',
  MODERACAO: 'Moderacao',
  TRANSCENDENCIA: 'Transcendencia',
};

interface Strength {
  label: string;
  normalizedScore: number;
  virtue: string;
}

interface VirtueGroupProps {
  virtue: string;
  strengths: Strength[];
}

export function VirtueGroup({ virtue, strengths }: VirtueGroupProps) {
  const [open, setOpen] = useState(true);
  const label = VIRTUE_LABELS[virtue] ?? virtue;

  return (
    <div className="border rounded-lg p-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full text-left font-medium text-sm"
      >
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        {label}
      </button>
      {open && (
        <div className="mt-3 space-y-2">
          {strengths.map((s) => (
            <StrengthBar key={s.label} label={s.label} score={s.normalizedScore} virtue={s.virtue} />
          ))}
        </div>
      )}
    </div>
  );
}
```

**Step 5: Create CrossoverCard**

Create `components/domain/crossover-card.tsx`:
```tsx
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Sparkles } from 'lucide-react';

interface CrossoverCardProps {
  targetRisk: string;
  leverageStrength: string;
  strengthLabel: string;
  strategy: string;
  rationale: string;
  onCreateIntervention?: () => void;
}

export function CrossoverCard({
  targetRisk,
  strengthLabel,
  strategy,
  rationale,
  onCreateIntervention,
}: CrossoverCardProps) {
  return (
    <Card className="border-l-4 border-l-indigo-500">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-red-500" />
            <span className="font-medium">{targetRisk}</span>
            <span className="text-muted-foreground">x</span>
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">{strengthLabel}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-2">{strategy}</p>
        <p className="text-xs text-muted-foreground italic mb-3">{rationale}</p>
        {onCreateIntervention && (
          <Button variant="outline" size="sm" onClick={onCreateIntervention}>
            Criar Intervencao
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
```

**Step 6: Commit**

```bash
git add components/domain/ && git commit -m "feat: add domain UI components (TierBadge, StrengthBar, RiskSummaryCard, VirtueGroup, CrossoverCard)"
```

---

## Task 8: Questionnaire data + content files

**Files:**
- Create: `src/core/content/questionnaire-items.ts` (71 VIA items with text)
- Create: `src/core/content/strength-descriptions.ts` (24 friendly descriptions)

**Step 1: Create questionnaire items**

Create `src/core/content/questionnaire-items.ts`:

This file must contain all 71 VIA items with their Portuguese text. The item numbers must match the `VIA_STRENGTH_MAP` in `src/core/logic/scoring.ts`. Extract the exact question texts from `Questionario Socioemocional.pdf`.

```typescript
export interface QuestionnaireItem {
  number: number;
  text: string;
}

// Items organized by virtue for step display
export const VIA_ITEMS_BY_VIRTUE = {
  SABEDORIA: {
    label: 'Sabedoria e Conhecimento',
    description: 'Estas perguntas sao sobre como voce aprende, pensa e resolve problemas.',
    // Items: 3,30,48 (Criatividade), 23,25,69 (Curiosidade), 7,9,71 (Pens.Critico), 5,17,45 (Amor Aprend.), 4,63,6 (Sensatez)
    items: [3, 4, 5, 6, 7, 9, 17, 23, 25, 30, 45, 48, 63, 69, 71],
  },
  CORAGEM: {
    label: 'Coragem',
    description: 'Estas perguntas sao sobre como voce enfrenta desafios e dificuldades.',
    // Items: 35,57,67 (Bravura), 40,47,52 (Perseveranca), 10,33,41 (Autenticidade), 13,18,53 (Vitalidade)
    items: [10, 13, 18, 33, 35, 40, 41, 47, 52, 53, 57, 67],
  },
  HUMANIDADE: {
    label: 'Humanidade',
    description: 'Estas perguntas sao sobre como voce se relaciona com as outras pessoas.',
    // Items: 16,37,70 (Amor), 21,50,66 (Bondade), 1,20,59 (Int.Social)
    items: [1, 16, 20, 21, 37, 50, 59, 66, 70],
  },
  JUSTICA: {
    label: 'Justica',
    description: 'Estas perguntas sao sobre como voce age em grupo e na comunidade.',
    // Items: 31,34,61 (Cidadania), 2,58,68 (Imparcialidade), 19,62,55 (Lideranca)
    items: [2, 19, 31, 34, 55, 58, 61, 62, 68],
  },
  MODERACAO: {
    label: 'Moderacao',
    description: 'Estas perguntas sao sobre como voce controla seus impulsos e emocoes.',
    // Items: 26,32,54 (Perdao), 11,46,56 (Modestia), 29,36,65 (Prudencia), 12,38,60 (Autorregulacao)
    items: [11, 12, 26, 29, 32, 36, 38, 46, 54, 56, 60, 65],
  },
  TRANSCENDENCIA: {
    label: 'Transcendencia',
    description: 'Estas perguntas sao sobre o que da sentido e alegria a sua vida.',
    // Items: 39,43 (Aprec.Belo), 22,24,44 (Gratidao), 14,42,64 (Humor), 15,27,49 (Esperanca), 8,28,51 (Espiritualidade)
    items: [8, 14, 15, 22, 24, 27, 28, 39, 42, 43, 44, 49, 51, 64],
  },
} as const;

// The actual item texts must be extracted from the PDF.
// Placeholder structure - fill from Questionario Socioemocional.pdf:
export const VIA_ITEM_TEXTS: Record<number, string> = {
  // These will be populated from the PDF in the implementation step.
  // Format: itemNumber -> Portuguese question text
};
```

Note to implementer: Extract the 71 item texts from `Questionario Socioemocional.pdf` using the Read tool on the PDF file during implementation.

**Step 2: Create strength descriptions**

Create `src/core/content/strength-descriptions.ts`:
```typescript
import { CharacterStrength } from '@core/types';

export interface StrengthDescription {
  name: string;
  description: string;
  tip: string;
}

export const STRENGTH_DESCRIPTIONS: Record<CharacterStrength, StrengthDescription> = {
  CRIATIVIDADE: {
    name: 'Criatividade',
    description: 'Voce encontra formas originais de resolver problemas e se expressar. Gosta de pensar "fora da caixa".',
    tip: 'Experimente atividades artisticas, escreva historias ou invente solucoes diferentes para problemas do dia a dia.',
  },
  CURIOSIDADE: {
    name: 'Curiosidade',
    description: 'Voce tem interesse genuino pelo mundo. Gosta de explorar, perguntar e descobrir coisas novas.',
    tip: 'Explore um tema novo por semana. Assista documentarios, leia sobre assuntos que nunca estudou.',
  },
  PENSAMENTO_CRITICO: {
    name: 'Pensamento Critico',
    description: 'Voce analisa as situacoes com cuidado antes de formar uma opiniao. Nao aceita as coisas sem questionar.',
    tip: 'Pratique ver os dois lados de uma questao. Quando ouvir uma noticia, pergunte: "Sera que e so isso?"',
  },
  AMOR_APRENDIZADO: {
    name: 'Amor ao Aprendizado',
    description: 'Voce sente prazer em aprender coisas novas, seja na escola ou fora dela.',
    tip: 'Comece um projeto de aprendizado pessoal: um idioma, um instrumento, uma habilidade nova.',
  },
  SENSATEZ: {
    name: 'Sensatez',
    description: 'Voce consegue dar bons conselhos e ver as situacoes com maturidade.',
    tip: 'Quando um amigo pedir conselho, pare e pense antes de responder. Sua reflexao e valiosa.',
  },
  BRAVURA: {
    name: 'Bravura',
    description: 'Voce defende o que acredita, mesmo quando e dificil. Enfrenta desafios de frente.',
    tip: 'Na proxima vez que sentir medo de falar algo importante, lembre-se: sua voz importa.',
  },
  PERSEVERANCA: {
    name: 'Perseveranca',
    description: 'Voce nao desiste facilmente. Quando comeca algo, vai ate o fim apesar das dificuldades.',
    tip: 'Divida metas grandes em passos pequenos. Celebre cada passo completado.',
  },
  AUTENTICIDADE: {
    name: 'Autenticidade',
    description: 'Voce e verdadeiro e honesto. Age de acordo com seus valores, sem fingir ser outra pessoa.',
    tip: 'Pratique dizer o que realmente pensa, com respeito. Ser autentico fortalece seus relacionamentos.',
  },
  VITALIDADE: {
    name: 'Vitalidade',
    description: 'Voce tem energia e entusiasmo pela vida. Aborda o dia a dia com empolgacao.',
    tip: 'Mantenha uma rotina de exercicios e sono. Sua energia contagia quem esta ao seu redor.',
  },
  AMOR: {
    name: 'Amor',
    description: 'Voce valoriza relacionamentos profundos. Sabe dar e receber carinho.',
    tip: 'Demonstre afeto pelas pessoas importantes na sua vida. Um abraco, uma mensagem, um gesto.',
  },
  BONDADE: {
    name: 'Bondade',
    description: 'Voce se preocupa com o bem-estar dos outros e faz coisas boas sem esperar nada em troca.',
    tip: 'Faca um ato de bondade por dia, por menor que seja. Ajudar os outros tambem te faz bem.',
  },
  INTELIGENCIA_SOCIAL: {
    name: 'Inteligencia Social',
    description: 'Voce entende as emocoes das pessoas e sabe como agir em diferentes situacoes sociais.',
    tip: 'Observe a linguagem corporal das pessoas. Pergunte como elas estao se sentindo de verdade.',
  },
  CIDADANIA: {
    name: 'Cidadania',
    description: 'Voce trabalha bem em equipe e se importa com o bem do grupo, nao so o seu.',
    tip: 'Participe de projetos coletivos na escola ou comunidade. Sua contribuicao faz diferenca.',
  },
  IMPARCIALIDADE: {
    name: 'Imparcialidade',
    description: 'Voce trata todos com justica, sem favoritismo. Acredita que todos merecem oportunidades iguais.',
    tip: 'Quando presenciar uma injustica, posicione-se. Sua voz pela justica inspira outros.',
  },
  LIDERANCA: {
    name: 'Lideranca',
    description: 'Voce sabe organizar pessoas e motivar o grupo para atingir objetivos juntos.',
    tip: 'Liderar nao e mandar. Pratique ouvir sua equipe e valorizar as ideias de todos.',
  },
  PERDAO: {
    name: 'Perdao',
    description: 'Voce consegue deixar magoas para tras e dar segundas chances.',
    tip: 'Perdoar nao e esquecer. E escolher nao carregar o peso da raiva. Libere-se.',
  },
  MODESTIA: {
    name: 'Modestia',
    description: 'Voce nao precisa se gabar. Deixa suas conquistas falarem por si.',
    tip: 'Continue sendo humilde, mas nao tenha medo de reconhecer seus meritos quando perguntado.',
  },
  PRUDENCIA: {
    name: 'Prudencia',
    description: 'Voce pensa antes de agir. Considera as consequencias antes de tomar decisoes.',
    tip: 'Antes de decisoes importantes, use a regra dos 10 minutos: espere, respire, depois decida.',
  },
  AUTORREGULACAO: {
    name: 'Autorregulacao',
    description: 'Voce consegue controlar suas emocoes e impulsos. Nao age por impulso.',
    tip: 'Quando sentir raiva ou ansiedade, conte ate 10 e respire fundo. Voce tem o controle.',
  },
  APRECIACAO_BELO: {
    name: 'Apreciacao ao Belo',
    description: 'Voce percebe e valoriza a beleza na arte, na natureza e nas pequenas coisas.',
    tip: 'Reserve um momento do dia para observar algo bonito: um por do sol, uma musica, uma obra de arte.',
  },
  GRATIDAO: {
    name: 'Gratidao',
    description: 'Voce reconhece as coisas boas da vida e agradece por elas.',
    tip: 'Antes de dormir, pense em 3 coisas boas que aconteceram hoje. Isso muda sua perspectiva.',
  },
  HUMOR: {
    name: 'Humor',
    description: 'Voce ve o lado leve da vida e sabe fazer as pessoas rirem.',
    tip: 'O humor e um superpoder social. Use-o para aproximar pessoas, nunca para machucar.',
  },
  ESPERANCA: {
    name: 'Esperanca',
    description: 'Voce acredita que o futuro pode ser bom e trabalha para isso.',
    tip: 'Quando as coisas ficarem dificeis, lembre-se de momentos em que voce superou desafios.',
  },
  ESPIRITUALIDADE: {
    name: 'Espiritualidade',
    description: 'Voce sente que ha um proposito maior na vida. Busca significado alem do material.',
    tip: 'Reserve momentos de reflexao ou meditacao. Conecte-se com o que da sentido a sua vida.',
  },
};
```

**Step 3: Commit**

```bash
git add src/core/content/ && git commit -m "feat: add questionnaire items structure and strength descriptions"
```

---

## Task 9: Server Actions for assessments

**Files:**
- Create: `app/actions/assessment.ts`

**Step 1: Create assessment server actions**

Create `app/actions/assessment.ts`:
```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { calculateStudentProfile } from '@core/logic/scoring';
import { GradeLevel, VIARawAnswers, SRSSRawAnswers } from '@core/types';

export async function saveVIAAnswers(answers: VIARawAnswers) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'STUDENT' || !user.studentId) {
    return { error: 'Nao autorizado' };
  }

  const supabase = await createClient();

  // Get student grade
  const { data: student } = await supabase
    .from('students')
    .select('grade')
    .eq('id', user.studentId)
    .single();

  if (!student) return { error: 'Aluno nao encontrado' };

  // Check if all 71 items are answered
  const answeredCount = Object.keys(answers).length;
  if (answeredCount < 71) {
    // Partial save (draft) - save raw answers only
    const { error } = await supabase.from('assessments').upsert({
      tenantId: user.tenantId,
      studentId: user.studentId,
      type: 'VIA_STRENGTHS',
      screeningWindow: 'DIAGNOSTIC', // TODO: determine from current date
      academicYear: new Date().getFullYear(),
      rawAnswers: answers,
      processedScores: null,
    }, {
      onConflict: 'tenantId,studentId,type,screeningWindow,academicYear',
      ignoreDuplicates: false,
    });

    if (error) return { error: 'Erro ao salvar respostas' };
    return { saved: true, complete: false };
  }

  // Complete - calculate scores
  // We need SRSS data too for full profile, but VIA can be saved independently
  const { data: existingSrss } = await supabase
    .from('assessments')
    .select('rawAnswers')
    .eq('studentId', user.studentId)
    .eq('type', 'SRSS_IE')
    .order('appliedAt', { ascending: false })
    .limit(1)
    .single();

  // Calculate VIA-only processed scores
  const { calculateStrengthScores } = await import('@core/logic/scoring');
  const strengthScores = calculateStrengthScores(answers);
  const sorted = [...strengthScores].sort((a, b) => b.normalizedScore - a.normalizedScore);

  const processedScores = {
    strengths: strengthScores,
    signatureTop5: sorted.slice(0, 5),
    developmentAreas: sorted.slice(-5).reverse(),
  };

  const { error } = await supabase.from('assessments').upsert({
    tenantId: user.tenantId,
    studentId: user.studentId,
    type: 'VIA_STRENGTHS',
    screeningWindow: 'DIAGNOSTIC',
    academicYear: new Date().getFullYear(),
    rawAnswers: answers,
    processedScores,
    selfKnowledgeScore: Math.round(sorted[0].normalizedScore / 10), // rough proxy
  }, {
    onConflict: 'tenantId,studentId,type,screeningWindow,academicYear',
    ignoreDuplicates: false,
  });

  if (error) return { error: 'Erro ao salvar respostas' };
  return { saved: true, complete: true };
}

export async function saveSRSSScreening(
  studentId: string,
  answers: SRSSRawAnswers
) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'TEACHER' && user.role !== 'PSYCHOLOGIST' && user.role !== 'COUNSELOR' && user.role !== 'MANAGER' && user.role !== 'ADMIN')) {
    return { error: 'Nao autorizado' };
  }

  const supabase = await createClient();

  // Get student info
  const { data: student } = await supabase
    .from('students')
    .select('tenantId, grade')
    .eq('id', studentId)
    .single();

  if (!student || student.tenantId !== user.tenantId) {
    return { error: 'Aluno nao encontrado' };
  }

  // Calculate risk scores
  const { calculateRiskScores } = await import('@core/logic/scoring');
  const risk = calculateRiskScores(answers);

  // Determine overall tier
  const tierOrder = ['TIER_1', 'TIER_2', 'TIER_3'];
  const overallTierIdx = Math.max(
    tierOrder.indexOf(risk.externalizing.tier),
    tierOrder.indexOf(risk.internalizing.tier)
  );

  const processedScores = {
    externalizing: risk.externalizing,
    internalizing: risk.internalizing,
  };

  const { error } = await supabase.from('assessments').upsert({
    tenantId: user.tenantId,
    studentId,
    type: 'SRSS_IE',
    screeningWindow: 'DIAGNOSTIC',
    academicYear: new Date().getFullYear(),
    screeningTeacherId: user.id,
    rawAnswers: answers,
    processedScores,
    overallTier: tierOrder[overallTierIdx],
    externalizingScore: risk.externalizing.score,
    internalizingScore: risk.internalizing.score,
  }, {
    onConflict: 'tenantId,studentId,type,screeningWindow,academicYear',
    ignoreDuplicates: false,
  });

  if (error) return { error: 'Erro ao salvar triagem' };
  return { saved: true, tier: tierOrder[overallTierIdx] };
}

export async function getStudentProfile(studentId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Nao autorizado' };

  const supabase = await createClient();

  const { data: via } = await supabase
    .from('assessments')
    .select('rawAnswers, processedScores')
    .eq('studentId', studentId)
    .eq('type', 'VIA_STRENGTHS')
    .order('appliedAt', { ascending: false })
    .limit(1)
    .single();

  const { data: srss } = await supabase
    .from('assessments')
    .select('rawAnswers, processedScores, overallTier')
    .eq('studentId', studentId)
    .eq('type', 'SRSS_IE')
    .order('appliedAt', { ascending: false })
    .limit(1)
    .single();

  const { data: student } = await supabase
    .from('students')
    .select('grade')
    .eq('id', studentId)
    .single();

  if (!student) return { error: 'Aluno nao encontrado' };

  // If we have both VIA and SRSS, compute full profile
  if (via?.rawAnswers && srss?.rawAnswers) {
    const gradeMap: Record<string, GradeLevel> = {
      ANO_1_EM: GradeLevel.PRIMEIRO_ANO,
      ANO_2_EM: GradeLevel.SEGUNDO_ANO,
      ANO_3_EM: GradeLevel.TERCEIRO_ANO,
    };
    const grade = gradeMap[student.grade] ?? GradeLevel.PRIMEIRO_ANO;
    const profile = calculateStudentProfile(
      via.rawAnswers as VIARawAnswers,
      srss.rawAnswers as SRSSRawAnswers,
      grade
    );
    return { profile };
  }

  // Partial data
  return {
    viaScores: via?.processedScores ?? null,
    srssScores: srss?.processedScores ?? null,
    overallTier: srss?.overallTier ?? null,
  };
}
```

**Step 2: Commit**

```bash
git add app/actions/ && git commit -m "feat: add server actions for VIA and SRSS-IE assessments"
```

---

## Task 10: VIA Questionnaire page (student)

**Files:**
- Create: `app/(portal)/questionario/page.tsx`
- Create: `components/questionnaire/questionnaire-wizard.tsx`
- Create: `components/questionnaire/question-card.tsx`

**Step 1: Create question card**

Create `components/questionnaire/question-card.tsx`:
```tsx
'use client';

import { cn } from '@/lib/utils';

const EMOJIS = ['😟', '😕', '😐', '🙂', '😄'];
const LABELS = ['Nada a ver comigo', 'Pouco a ver', 'Mais ou menos', 'Bastante a ver', 'Tudo a ver comigo'];

interface QuestionCardProps {
  number: number;
  text: string;
  value: number | undefined;
  onChange: (value: number) => void;
}

export function QuestionCard({ number, text, value, onChange }: QuestionCardProps) {
  return (
    <div className="bg-white rounded-lg border p-4 space-y-3">
      <p className="text-sm">
        <span className="text-muted-foreground mr-2">{number}.</span>
        {text}
      </p>
      <div className="flex justify-between gap-1">
        {EMOJIS.map((emoji, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-lg p-2 flex-1 transition-all min-h-[60px]',
              value === i
                ? 'bg-indigo-100 border-2 border-indigo-500 scale-105'
                : 'border border-slate-200 hover:bg-slate-50'
            )}
          >
            <span className="text-xl">{emoji}</span>
            <span className="text-[10px] text-muted-foreground leading-tight text-center">{LABELS[i]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Create questionnaire wizard**

Create `components/questionnaire/questionnaire-wizard.tsx`:
```tsx
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { QuestionCard } from './question-card';
import { VIA_ITEMS_BY_VIRTUE } from '@core/content/questionnaire-items';
import { saveVIAAnswers } from '@/app/actions/assessment';
import { useRouter } from 'next/navigation';

const VIRTUE_ORDER = ['SABEDORIA', 'CORAGEM', 'HUMANIDADE', 'JUSTICA', 'MODERACAO', 'TRANSCENDENCIA'] as const;

interface QuestionnaireWizardProps {
  itemTexts: Record<number, string>;
  initialAnswers?: Record<number, number>;
}

export function QuestionnaireWizard({ itemTexts, initialAnswers }: QuestionnaireWizardProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>(initialAnswers ?? {});
  const [saving, setSaving] = useState(false);
  const saveTimeout = useRef<NodeJS.Timeout>();
  const router = useRouter();

  const currentVirtue = VIRTUE_ORDER[step];
  const virtueData = VIA_ITEMS_BY_VIRTUE[currentVirtue];
  const progress = ((step + 1) / VIRTUE_ORDER.length) * 100;

  // Auto-save with debounce
  const debouncedSave = useCallback((newAnswers: Record<number, number>) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      // Save to localStorage as fallback
      localStorage.setItem('via-draft', JSON.stringify(newAnswers));
      // Save to server
      await saveVIAAnswers(newAnswers as any);
    }, 500);
  }, []);

  function handleAnswer(itemNumber: number, value: number) {
    const newAnswers = { ...answers, [itemNumber]: value };
    setAnswers(newAnswers);
    debouncedSave(newAnswers);
  }

  // Check if current step is complete
  const stepComplete = virtueData.items.every((item) => answers[item] !== undefined);
  const allComplete = Object.keys(answers).length >= 71;

  async function handleFinish() {
    setSaving(true);
    const result = await saveVIAAnswers(answers as any);
    setSaving(false);
    if (result.complete) {
      localStorage.removeItem('via-draft');
      router.push('/minhas-forcas');
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress header */}
      <div className="sticky top-0 bg-slate-50 z-10 pb-4 pt-2">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium">{virtueData.label}</span>
          <span className="text-muted-foreground">Etapa {step + 1} de {VIRTUE_ORDER.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">{virtueData.description}</p>
      </div>

      {/* Questions */}
      <div className="space-y-3 pb-24">
        {virtueData.items.map((itemNum) => (
          <QuestionCard
            key={itemNum}
            number={itemNum}
            text={itemTexts[itemNum] ?? `Pergunta ${itemNum}`}
            value={answers[itemNum]}
            onChange={(val) => handleAnswer(itemNum, val)}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between md:ml-56">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          Anterior
        </Button>
        {step < VIRTUE_ORDER.length - 1 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!stepComplete}
          >
            Proximo
          </Button>
        ) : (
          <Button
            onClick={handleFinish}
            disabled={!allComplete || saving}
          >
            {saving ? 'Salvando...' : 'Finalizar'}
          </Button>
        )}
      </div>

      {/* Auto-save indicator */}
      <div className="fixed bottom-16 right-4 md:right-4">
        <span className="text-xs text-muted-foreground">Salvo automaticamente</span>
      </div>
    </div>
  );
}
```

**Step 3: Create questionnaire page**

Create `app/(portal)/questionario/page.tsx`:
```tsx
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { QuestionnaireWizard } from '@/components/questionnaire/questionnaire-wizard';
import { VIA_ITEM_TEXTS } from '@core/content/questionnaire-items';

export default async function QuestionarioPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'STUDENT') redirect('/');

  // Check for existing draft
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from('assessments')
    .select('rawAnswers')
    .eq('studentId', user.studentId!)
    .eq('type', 'VIA_STRENGTHS')
    .eq('academicYear', new Date().getFullYear())
    .order('appliedAt', { ascending: false })
    .limit(1)
    .single();

  const initialAnswers = existing?.rawAnswers as Record<number, number> | null;

  return (
    <div>
      <h1 className="text-xl font-bold mb-1">Questionario de Forcas de Carater</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Responda com calma. Nao existem respostas certas ou erradas.
      </p>
      <QuestionnaireWizard
        itemTexts={VIA_ITEM_TEXTS}
        initialAnswers={initialAnswers ?? undefined}
      />
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add app/\(portal\)/questionario/ components/questionnaire/ && git commit -m "feat: add VIA questionnaire with step-by-virtue wizard and auto-save"
```

---

## Task 11: "Minhas Forcas" page (student results)

**Files:**
- Create: `app/(portal)/minhas-forcas/page.tsx`
- Create: `components/student/strengths-view.tsx`

**Step 1: Create strengths view component**

Create `components/student/strengths-view.tsx`:
```tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { VirtueGroup } from '@/components/domain/virtue-group';
import { STRENGTH_DESCRIPTIONS } from '@core/content/strength-descriptions';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Strength {
  strength: string;
  virtue: string;
  label: string;
  normalizedScore: number;
}

interface StrengthsViewProps {
  signatureStrengths: Strength[];
  allStrengths: Strength[];
}

const MEDALS = ['🥇', '🥈', '🥉', '4.', '5.'];

export function StrengthsView({ signatureStrengths, allStrengths }: StrengthsViewProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  // Group all strengths by virtue
  const byVirtue: Record<string, Strength[]> = {};
  for (const s of allStrengths) {
    if (!byVirtue[s.virtue]) byVirtue[s.virtue] = [];
    byVirtue[s.virtue].push(s);
  }

  // Bottom 3 for development areas
  const sorted = [...allStrengths].sort((a, b) => a.normalizedScore - b.normalizedScore);
  const developmentAreas = sorted.slice(0, 3);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Top 5 Signature Strengths */}
      <section>
        <h2 className="text-lg font-bold mb-3">Suas 5 Forcas de Assinatura</h2>
        <div className="space-y-2">
          {signatureStrengths.map((s, i) => {
            const desc = STRENGTH_DESCRIPTIONS[s.strength as keyof typeof STRENGTH_DESCRIPTIONS];
            const isExpanded = expandedIdx === i;
            return (
              <Card key={s.strength} className="overflow-hidden">
                <button
                  onClick={() => setExpandedIdx(isExpanded ? null : i)}
                  className="w-full text-left"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{MEDALS[i]}</span>
                        <span className="font-medium">{s.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-muted-foreground">{s.normalizedScore}%</span>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>
                    {isExpanded && desc && (
                      <div className="mt-3 pt-3 border-t text-sm space-y-2">
                        <p>{desc.description}</p>
                        <p className="text-indigo-600 font-medium">💡 {desc.tip}</p>
                      </div>
                    )}
                  </CardContent>
                </button>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Full Map by Virtue */}
      <section>
        <h2 className="text-lg font-bold mb-3">Mapa das 24 Forcas</h2>
        <div className="space-y-3">
          {Object.entries(byVirtue).map(([virtue, strengths]) => (
            <VirtueGroup key={virtue} virtue={virtue} strengths={strengths} />
          ))}
        </div>
      </section>

      {/* Development Areas */}
      <section>
        <h2 className="text-lg font-bold mb-1">Areas para Desenvolver</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Essas forcas podem crescer com pratica. Veja como:
        </p>
        <div className="space-y-2">
          {developmentAreas.map((s) => {
            const desc = STRENGTH_DESCRIPTIONS[s.strength as keyof typeof STRENGTH_DESCRIPTIONS];
            return (
              <Card key={s.strength}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">💡 {s.label}</span>
                    <span className="text-xs text-muted-foreground">{s.normalizedScore}%</span>
                  </div>
                  {desc && (
                    <p className="text-sm text-muted-foreground">{desc.tip}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
```

**Step 2: Create page**

Create `app/(portal)/minhas-forcas/page.tsx`:
```tsx
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { StrengthsView } from '@/components/student/strengths-view';

export default async function MinhasForcasPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'STUDENT' || !user.studentId) redirect('/');

  const supabase = await createClient();
  const { data: assessment } = await supabase
    .from('assessments')
    .select('processedScores')
    .eq('studentId', user.studentId)
    .eq('type', 'VIA_STRENGTHS')
    .order('appliedAt', { ascending: false })
    .limit(1)
    .single();

  if (!assessment?.processedScores) {
    redirect('/questionario');
  }

  const scores = assessment.processedScores as {
    strengths: any[];
    signatureTop5: any[];
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-1">Minhas Forcas de Carater</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Veja o que te torna unico(a).
      </p>
      <StrengthsView
        signatureStrengths={scores.signatureTop5}
        allStrengths={scores.strengths}
      />
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add app/\(portal\)/minhas-forcas/ components/student/ && git commit -m "feat: add Minhas Forcas page with strength cards and virtue map"
```

---

## Task 12: Teacher SRSS-IE grid page

**Files:**
- Create: `app/(portal)/turma/triagem/page.tsx`
- Create: `components/teacher/srss-grid.tsx`

**Step 1: Create SRSS Grid component**

Create `components/teacher/srss-grid.tsx`:
```tsx
'use client';

import { useState, useCallback, useRef } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TierBadge } from '@/components/domain/tier-badge';
import { saveSRSSScreening } from '@/app/actions/assessment';
import { SRSS_ITEMS } from '@core/logic/scoring';
import { cn } from '@/lib/utils';

const ALL_ITEMS = [...SRSS_ITEMS.externalizing, ...SRSS_ITEMS.internalizing];

interface Student {
  id: string;
  name: string;
}

interface SrssGridProps {
  students: Student[];
  existingData: Record<string, { answers: Record<number, number>; tier?: string }>;
}

export function SrssGrid({ students, existingData }: SrssGridProps) {
  const [data, setData] = useState(existingData);
  const saveTimeout = useRef<Record<string, NodeJS.Timeout>>({});

  const handleCellClick = useCallback((studentId: string, itemNum: number) => {
    setData((prev) => {
      const studentData = prev[studentId] ?? { answers: {} };
      const current = studentData.answers[itemNum];
      const next = current === undefined ? 0 : (current + 1) % 4;
      const newAnswers = { ...studentData.answers, [itemNum]: next };
      const newData = {
        ...prev,
        [studentId]: { ...studentData, answers: newAnswers },
      };

      // Check if all 12 items are filled - compute tier
      const filledCount = Object.keys(newAnswers).length;
      if (filledCount === 12) {
        // Auto-save with debounce
        if (saveTimeout.current[studentId]) clearTimeout(saveTimeout.current[studentId]);
        saveTimeout.current[studentId] = setTimeout(async () => {
          const result = await saveSRSSScreening(studentId, newAnswers as any);
          if (result.tier) {
            setData((d) => ({
              ...d,
              [studentId]: { ...d[studentId], tier: result.tier },
            }));
          }
        }, 300);
      }

      return newData;
    });
  }, []);

  const filledCount = students.filter((s) => {
    const d = data[s.id];
    return d && Object.keys(d.answers).length === 12;
  }).length;

  return (
    <TooltipProvider>
      <div className="text-sm text-muted-foreground mb-4">
        {filledCount}/{students.length} alunos preenchidos
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2 sticky left-0 bg-white z-10 min-w-[150px]">Aluno</th>
              {ALL_ITEMS.map((item) => (
                <Tooltip key={item.item}>
                  <TooltipTrigger asChild>
                    <th className="p-2 text-center w-10 cursor-help">
                      {item.item}
                    </th>
                  </TooltipTrigger>
                  <TooltipContent><p className="max-w-xs">{item.label}</p></TooltipContent>
                </Tooltip>
              ))}
              <th className="p-2 text-center">Tier</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const studentData = data[student.id] ?? { answers: {} };
              return (
                <tr key={student.id} className="border-b hover:bg-slate-50">
                  <td className="p-2 sticky left-0 bg-white font-medium">{student.name}</td>
                  {ALL_ITEMS.map((item) => {
                    const val = studentData.answers[item.item];
                    return (
                      <td key={item.item} className="p-1 text-center">
                        <button
                          onClick={() => handleCellClick(student.id, item.item)}
                          className={cn(
                            'w-8 h-8 rounded text-xs font-mono transition-colors',
                            val === undefined && 'bg-slate-100 text-slate-400',
                            val === 0 && 'bg-green-50 text-green-700',
                            val === 1 && 'bg-yellow-50 text-yellow-700',
                            val === 2 && 'bg-orange-50 text-orange-700',
                            val === 3 && 'bg-red-50 text-red-700',
                          )}
                        >
                          {val ?? '·'}
                        </button>
                      </td>
                    );
                  })}
                  <td className="p-2 text-center">
                    {studentData.tier ? (
                      <TierBadge tier={studentData.tier as any} />
                    ) : (
                      <span className="text-slate-300">◌</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </TooltipProvider>
  );
}
```

**Step 2: Create triagem page**

Create `app/(portal)/turma/triagem/page.tsx`:
```tsx
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SrssGrid } from '@/components/teacher/srss-grid';

export default async function TriagemPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'TEACHER' && user.role !== 'PSYCHOLOGIST' && user.role !== 'MANAGER' && user.role !== 'ADMIN')) {
    redirect('/');
  }

  const supabase = await createClient();

  // Get students for this teacher's classrooms
  // For now, get all students in the tenant
  const { data: students } = await supabase
    .from('students')
    .select('id, name')
    .eq('tenantId', user.tenantId)
    .eq('isActive', true)
    .order('name');

  // Get existing SRSS assessments for current year
  const { data: assessments } = await supabase
    .from('assessments')
    .select('studentId, rawAnswers, overallTier')
    .eq('tenantId', user.tenantId)
    .eq('type', 'SRSS_IE')
    .eq('academicYear', new Date().getFullYear());

  const existingData: Record<string, { answers: Record<number, number>; tier?: string }> = {};
  for (const a of assessments ?? []) {
    existingData[a.studentId] = {
      answers: a.rawAnswers as Record<number, number>,
      tier: a.overallTier ?? undefined,
    };
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-1">Triagem SRSS-IE</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Preencha a avaliacao de cada aluno. Clique na celula para ciclar entre 0-3.
      </p>
      <SrssGrid students={students ?? []} existingData={existingData} />
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add app/\(portal\)/turma/triagem/ components/teacher/ && git commit -m "feat: add SRSS-IE screening grid for teachers"
```

---

## Task 13: Teacher dashboard (class risk overview)

**Files:**
- Create: `app/(portal)/turma/page.tsx`
- Create: `components/teacher/class-dashboard.tsx`

**Step 1: Create class dashboard**

Create `components/teacher/class-dashboard.tsx`:
```tsx
import { Card, CardContent } from '@/components/ui/card';
import { TierBadge } from '@/components/domain/tier-badge';
import { cn } from '@/lib/utils';

interface StudentRisk {
  id: string;
  name: string;
  overallTier: string;
  externalizingScore: number | null;
  internalizingScore: number | null;
  alerts: string[];
}

interface ClassDashboardProps {
  students: StudentRisk[];
  gradeFocus: string;
}

export function ClassDashboard({ students, gradeFocus }: ClassDashboardProps) {
  const tier1 = students.filter((s) => s.overallTier === 'TIER_1');
  const tier2 = students.filter((s) => s.overallTier === 'TIER_2');
  const tier3 = students.filter((s) => s.overallTier === 'TIER_3');
  const total = students.length || 1;

  const atRisk = [...tier3, ...tier2]; // Tier 3 first

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{tier1.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Tier 1 ({Math.round((tier1.length / total) * 100)}%)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600">{tier2.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Tier 2 ({Math.round((tier2.length / total) * 100)}%)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-red-600">{tier3.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Tier 3 ({Math.round((tier3.length / total) * 100)}%)</div>
          </CardContent>
        </Card>
      </div>

      {/* At-risk students list */}
      <section>
        <h2 className="font-semibold mb-3">Alunos que precisam de atencao</h2>
        {atRisk.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum aluno em Tier 2 ou 3.</p>
        ) : (
          <div className="space-y-2">
            {atRisk.map((s) => (
              <Card key={s.id}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <TierBadge tier={s.overallTier as any} />
                      <span className="font-medium text-sm">{s.name}</span>
                    </div>
                    {s.alerts.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Alertas: {s.alerts.join(', ')}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Grade focus info */}
      <section>
        <h2 className="font-semibold mb-2">Foco da Serie</h2>
        <p className="text-sm text-muted-foreground">{gradeFocus}</p>
      </section>
    </div>
  );
}
```

**Step 2: Create turma page**

Create `app/(portal)/turma/page.tsx`:
```tsx
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ClassDashboard } from '@/components/teacher/class-dashboard';

export default async function TurmaPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const supabase = await createClient();

  // Get students with their latest SRSS assessment
  const { data: students } = await supabase
    .from('students')
    .select('id, name, grade')
    .eq('tenantId', user.tenantId)
    .eq('isActive', true)
    .order('name');

  const { data: assessments } = await supabase
    .from('assessments')
    .select('studentId, overallTier, externalizingScore, internalizingScore, rawAnswers')
    .eq('tenantId', user.tenantId)
    .eq('type', 'SRSS_IE')
    .eq('academicYear', new Date().getFullYear());

  const assessmentMap = new Map(
    (assessments ?? []).map((a) => [a.studentId, a])
  );

  const studentsWithRisk = (students ?? [])
    .filter((s) => assessmentMap.has(s.id))
    .map((s) => {
      const a = assessmentMap.get(s.id)!;
      // Identify high items for alerts
      const raw = a.rawAnswers as Record<number, number>;
      const alerts: string[] = [];
      if (raw) {
        Object.entries(raw).forEach(([item, score]) => {
          if (score >= 2) alerts.push(`Item ${item}(${score})`);
        });
      }
      return {
        id: s.id,
        name: s.name,
        overallTier: a.overallTier ?? 'TIER_1',
        externalizingScore: a.externalizingScore,
        internalizingScore: a.internalizingScore,
        alerts,
      };
    });

  return (
    <div>
      <h1 className="text-xl font-bold mb-1">Dashboard da Turma</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Visao geral do risco socioemocional.
      </p>
      <ClassDashboard
        students={studentsWithRisk}
        gradeFocus="Consulte a triagem para detalhes por serie."
      />
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add app/\(portal\)/turma/page.tsx components/teacher/class-dashboard.tsx && git commit -m "feat: add teacher class dashboard with tier summary and risk list"
```

---

## Task 14: Student profile page (psychologist crossover view)

**Files:**
- Create: `app/(portal)/alunos/page.tsx`
- Create: `app/(portal)/alunos/[id]/page.tsx`
- Create: `components/psychologist/student-profile-view.tsx`

**Step 1: Create student list page**

Create `app/(portal)/alunos/page.tsx`:
```tsx
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { TierBadge } from '@/components/domain/tier-badge';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export default async function AlunosPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const supabase = await createClient();

  const { data: students } = await supabase
    .from('students')
    .select('id, name, grade')
    .eq('tenantId', user.tenantId)
    .eq('isActive', true)
    .order('name');

  const { data: assessments } = await supabase
    .from('assessments')
    .select('studentId, overallTier')
    .eq('tenantId', user.tenantId)
    .eq('type', 'SRSS_IE')
    .eq('academicYear', new Date().getFullYear());

  const tierMap = new Map(
    (assessments ?? []).map((a) => [a.studentId, a.overallTier])
  );

  // Sort: Tier 3 first, then Tier 2, then Tier 1, then unscreened
  const tierPriority: Record<string, number> = { TIER_3: 0, TIER_2: 1, TIER_1: 2 };
  const sorted = (students ?? []).sort((a, b) => {
    const ta = tierMap.get(a.id);
    const tb = tierMap.get(b.id);
    const pa = ta ? tierPriority[ta] ?? 3 : 4;
    const pb = tb ? tierPriority[tb] ?? 3 : 4;
    return pa - pb || a.name.localeCompare(b.name);
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Alunos</h1>
      <div className="space-y-2">
        {sorted.map((s) => {
          const tier = tierMap.get(s.id);
          return (
            <Link key={s.id} href={`/alunos/${s.id}`}>
              <Card className="hover:bg-slate-50 transition-colors">
                <CardContent className="p-3 flex items-center justify-between">
                  <span className="font-medium text-sm">{s.name}</span>
                  {tier ? (
                    <TierBadge tier={tier as any} />
                  ) : (
                    <span className="text-xs text-muted-foreground">Sem triagem</span>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
```

**Step 2: Create student profile view**

Create `components/psychologist/student-profile-view.tsx`:
```tsx
import { RiskSummaryCard } from '@/components/domain/risk-summary-card';
import { CrossoverCard } from '@/components/domain/crossover-card';
import { VirtueGroup } from '@/components/domain/virtue-group';
import { TierBadge } from '@/components/domain/tier-badge';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StudentProfileViewProps {
  studentName: string;
  grade: string;
  profile: {
    externalizing: any;
    internalizing: any;
    overallTier: string;
    overallColor: string;
    allStrengths: any[];
    signatureStrengths: any[];
    gradeAlerts: any[];
    interventionSuggestions: any[];
  };
}

export function StudentProfileView({ studentName, grade, profile }: StudentProfileViewProps) {
  // Group strengths by virtue
  const byVirtue: Record<string, any[]> = {};
  for (const s of profile.allStrengths) {
    if (!byVirtue[s.virtue]) byVirtue[s.virtue] = [];
    byVirtue[s.virtue].push(s);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold">{studentName}</h1>
        <p className="text-sm text-muted-foreground">{grade}</p>
      </div>

      {/* Risk + Strengths side by side on desktop */}
      <div className="grid md:grid-cols-2 gap-4">
        <RiskSummaryCard
          externalizing={profile.externalizing}
          internalizing={profile.internalizing}
          overallTier={profile.overallTier}
        />
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-3">Top 5 Forcas</h3>
            <div className="space-y-1">
              {profile.signatureStrengths.map((s: any, i: number) => (
                <div key={s.strength} className="flex justify-between text-sm">
                  <span>{i + 1}. {s.label}</span>
                  <span className="font-mono text-muted-foreground">{s.normalizedScore}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grade Alerts */}
      {profile.gradeAlerts.length > 0 && (
        <section>
          <h2 className="font-semibold mb-3">Alertas da Serie</h2>
          <div className="space-y-2">
            {profile.gradeAlerts.map((alert: any) => (
              <div
                key={alert.itemNumber}
                className="flex items-start gap-2 text-sm p-3 rounded-lg bg-slate-50"
              >
                <Badge variant={alert.severity === 'CRITICAL' ? 'destructive' : 'secondary'}>
                  {alert.severity === 'CRITICAL' ? 'CRITICO' : 'OBSERVAR'}
                </Badge>
                <div>
                  <p className="font-medium">{alert.itemLabel} (item {alert.itemNumber}) = {alert.score}</p>
                  <p className="text-muted-foreground">{alert.rationale}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Crossover Cards */}
      {profile.interventionSuggestions.length > 0 && (
        <section>
          <h2 className="font-semibold mb-3">Cruzamento Preditivo: Forcas como Alavanca</h2>
          <div className="space-y-3">
            {profile.interventionSuggestions.map((sugg: any, i: number) => (
              <CrossoverCard
                key={i}
                targetRisk={sugg.targetRisk}
                leverageStrength={sugg.leverageStrength}
                strengthLabel={sugg.strengthLabel}
                strategy={sugg.strategy}
                rationale={sugg.rationale}
              />
            ))}
          </div>
        </section>
      )}

      {/* Full Strength Map */}
      <section>
        <h2 className="font-semibold mb-3">Mapa Completo de Forcas</h2>
        <div className="space-y-3">
          {Object.entries(byVirtue).map(([virtue, strengths]) => (
            <VirtueGroup key={virtue} virtue={virtue} strengths={strengths} />
          ))}
        </div>
      </section>
    </div>
  );
}
```

**Step 3: Create student detail page**

Create `app/(portal)/alunos/[id]/page.tsx`:
```tsx
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getStudentProfile } from '@/app/actions/assessment';
import { createClient } from '@/lib/supabase/server';
import { StudentProfileView } from '@/components/psychologist/student-profile-view';

const GRADE_LABELS: Record<string, string> = {
  ANO_1_EM: '1a Serie - Ensino Medio',
  ANO_2_EM: '2a Serie - Ensino Medio',
  ANO_3_EM: '3a Serie - Ensino Medio',
};

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const supabase = await createClient();
  const { data: student } = await supabase
    .from('students')
    .select('name, grade')
    .eq('id', id)
    .single();

  if (!student) redirect('/alunos');

  const result = await getStudentProfile(id);

  if ('error' in result) {
    return <p className="text-red-500">{result.error}</p>;
  }

  if (!result.profile) {
    return (
      <div>
        <h1 className="text-xl font-bold mb-4">{student.name}</h1>
        <p className="text-muted-foreground">
          Dados incompletos. Aguardando VIA e/ou SRSS-IE.
        </p>
      </div>
    );
  }

  return (
    <StudentProfileView
      studentName={student.name}
      grade={GRADE_LABELS[student.grade] ?? student.grade}
      profile={result.profile}
    />
  );
}
```

**Step 4: Commit**

```bash
git add app/\(portal\)/alunos/ components/psychologist/ && git commit -m "feat: add student list and integrated profile with predictive crossover"
```

---

## Task 15: Extract VIA item texts from PDF

**Files:**
- Modify: `src/core/content/questionnaire-items.ts`

**Step 1: Read the PDF and extract all 71 item texts**

Use the Read tool on `Questionario Socioemocional.pdf` to extract all 71 items. Each item follows the pattern of a numbered statement that the student rates 0-4.

**Step 2: Populate VIA_ITEM_TEXTS**

Fill the `VIA_ITEM_TEXTS` record in `src/core/content/questionnaire-items.ts` with all 71 items. Each entry maps item number to the Portuguese text.

**Step 3: Verify count**

Ensure exactly 71 items are present and all item numbers referenced in `VIA_STRENGTH_MAP` (scoring.ts) have corresponding texts.

**Step 4: Commit**

```bash
git add src/core/content/questionnaire-items.ts && git commit -m "feat: populate 71 VIA item texts from questionnaire PDF"
```

---

## Task 16: Smoke test the full flow

**Step 1: Start dev server**

```bash
npm run dev
```

**Step 2: Create test user in Supabase**

Via Supabase dashboard, create a test user with email/password. Then insert a corresponding row in the `users` table with role STUDENT and link to a student record.

**Step 3: Test student flow**

1. Login at /login
2. Redirected to /questionario (first time)
3. Answer all 71 items across 6 steps
4. Click "Finalizar" -> redirected to /minhas-forcas
5. See Top 5 strengths, virtue map, development areas

**Step 4: Test teacher flow**

Create a teacher user in Supabase. Login:
1. Redirected to /turma (dashboard)
2. Navigate to /turma/triagem
3. Fill SRSS-IE grid for students
4. Return to /turma to see risk summary

**Step 5: Test psychologist flow**

Create a psychologist user. Login:
1. See /alunos list with tier badges
2. Click a student with both VIA and SRSS data
3. See full profile with crossover cards

**Step 6: Commit any fixes**

```bash
git add -A && git commit -m "fix: smoke test adjustments"
```

---

## Summary

| Task | What | Key Files |
|------|------|-----------|
| 1 | Next.js + Tailwind init | next.config.ts, app/layout.tsx, globals.css |
| 2 | shadcn/ui + design tokens | components/ui/*, globals.css |
| 3 | Supabase clients | lib/supabase/{client,server,middleware}.ts |
| 4 | Auth middleware + RBAC | middleware.ts, lib/auth.ts |
| 5 | Login page | app/(auth)/login/ |
| 6 | Portal layout + sidebar | app/(portal)/layout.tsx, components/sidebar.tsx |
| 7 | Domain components | components/domain/*.tsx |
| 8 | Content files | src/core/content/*.ts |
| 9 | Server Actions | app/actions/assessment.ts |
| 10 | VIA questionnaire | app/(portal)/questionario/, components/questionnaire/ |
| 11 | Minhas Forcas | app/(portal)/minhas-forcas/, components/student/ |
| 12 | SRSS-IE grid | app/(portal)/turma/triagem/, components/teacher/ |
| 13 | Class dashboard | app/(portal)/turma/page.tsx |
| 14 | Student profile | app/(portal)/alunos/[id]/, components/psychologist/ |
| 15 | PDF text extraction | src/core/content/questionnaire-items.ts |
| 16 | Smoke test | Manual verification |

Total: 16 tasks. Estimated: Tasks 1-2 are setup, 3-6 are infrastructure, 7-14 are features, 15-16 are data + testing.
