import { LucideIcon } from 'lucide-react';

export interface NavItem {
    label: string;
    href: string;
    iconName: string;
}

export const NAV_BY_ROLE: Record<string, NavItem[]> = {
    STUDENT: [
        { label: 'Início', href: '/', iconName: 'Home' },
        { label: 'Responder VIA', href: '/questionario', iconName: 'ClipboardList' },
        { label: 'Minhas Forças', href: '/minhas-forcas', iconName: 'Trophy' },
    ],
    TEACHER: [
        { label: 'Início', href: '/', iconName: 'Home' },
        { label: 'Minha Turma', href: '/turma', iconName: 'LayoutDashboard' },
        { label: 'Lançar Triagem', href: '/turma/triagem', iconName: 'ClipboardList' },
    ],
    PSYCHOLOGIST: [
        { label: 'Início', href: '/', iconName: 'Home' },
        { label: 'Mapa de Risco', href: '/turma', iconName: 'ClipboardList' },
        { label: 'Lista de Alunos', href: '/alunos', iconName: 'Users' },
        { label: 'Intervenções (C2)', href: '/intervencoes', iconName: 'Layers' },
        { label: 'Relatórios', href: '/relatorios', iconName: 'FileText' },
    ],
    COUNSELOR: [
        { label: 'Início', href: '/', iconName: 'Home' },
        { label: 'Mapa de Risco', href: '/turma', iconName: 'ClipboardList' },
        { label: 'Alunos', href: '/alunos', iconName: 'Users' },
        { label: 'Intervenções (C2)', href: '/intervencoes', iconName: 'Layers' },
    ],
    MANAGER: [
        { label: 'Início', href: '/', iconName: 'Home' },
        { label: 'Gestão de Impacto', href: '/gestao', iconName: 'LayoutDashboard' },
        { label: 'Mapa de Risco', href: '/turma', iconName: 'ClipboardList' },
        { label: 'Alunos', href: '/alunos', iconName: 'Users' },
        { label: 'Intervenções (C2)', href: '/intervencoes', iconName: 'Layers' },
    ],
    ADMIN: [
        { label: 'Visão Geral', href: '/super-admin', iconName: 'Home' },
        { label: 'Escolas', href: '/super-admin/escolas', iconName: 'School' },
        { label: 'Financeiro', href: '/super-admin/financeiro', iconName: 'CreditCard' },
        { label: 'Usuários', href: '/alunos', iconName: 'Users' },
        { label: 'Suporte', href: '/super-admin/suporte', iconName: 'LifeBuoy' },
        { label: 'Configurações', href: '/super-admin/configuracoes', iconName: 'Settings' },
    ],
};

export function getNavForRole(role: string): NavItem[] {
    return NAV_BY_ROLE[role] ?? [];
}
