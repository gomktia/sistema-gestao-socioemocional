import { LucideIcon } from 'lucide-react';
import { getLabels } from '@/src/lib/utils/labels';
import { OrganizationType } from '@/src/core/types';

export interface NavItem {
    label: string;
    href: string;
    iconName: string;
    children?: NavItem[];
}

export function getNavForRole(role: string, organizationType?: string): NavItem[] {
    const labels = getLabels(organizationType as OrganizationType);

    const NAV_BY_ROLE: Record<string, NavItem[]> = {
        STUDENT: [
            { label: 'Início', href: '/inicio', iconName: 'Home' },
            { label: 'Responder VIA', href: '/questionario', iconName: 'ClipboardList' },
            { label: 'Minhas Forças', href: '/minhas-forcas', iconName: 'Trophy' },
            { label: 'Perfil', href: '/configuracoes', iconName: 'Settings' },
        ],
        TEACHER: [
            { label: 'Início', href: '/inicio', iconName: 'Home' },
            {
                label: 'Turmas',
                href: '/turmas',
                iconName: 'School',
                children: [
                    { label: 'Gestão de Turmas', href: '/turmas', iconName: 'LayoutDashboard' },
                    { label: 'Mapa de Risco', href: '/turma', iconName: 'HeartPulse' },
                    { label: 'Lançar Triagem', href: '/turma/triagem', iconName: 'ClipboardList' },
                ]
            },
            { label: 'Configurações', href: '/configuracoes', iconName: 'Settings' },
        ],
        PSYCHOLOGIST: [
            { label: 'Início', href: '/inicio', iconName: 'Home' },
            {
                label: 'Turmas',
                href: '/turmas',
                iconName: 'School',
                children: [
                    { label: 'Gestão de Turmas', href: '/turmas', iconName: 'LayoutDashboard' },
                    { label: 'Mapa de Risco', href: '/turma', iconName: 'HeartPulse' },
                ]
            },
            { label: labels.subjects, href: '/alunos', iconName: 'Users' },
            { label: 'Intervenções (C2)', href: '/intervencoes', iconName: 'Layers' },
            { label: 'Relatórios', href: '/relatorios', iconName: 'FileText' },
            { label: 'Configurações', href: '/configuracoes', iconName: 'Settings' },
        ],
        COUNSELOR: [
            { label: 'Início', href: '/inicio', iconName: 'Home' },
            {
                label: 'Turmas',
                href: '/turmas',
                iconName: 'School',
                children: [
                    { label: 'Gestão de Turmas', href: '/turmas', iconName: 'LayoutDashboard' },
                    { label: 'Mapa de Risco', href: '/turma', iconName: 'HeartPulse' },
                ]
            },
            { label: labels.subjects, href: '/alunos', iconName: 'Users' },
            { label: 'Intervenções (C2)', href: '/intervencoes', iconName: 'Layers' },
            { label: 'Configurações', href: '/configuracoes', iconName: 'Settings' },
        ],
        MANAGER: [
            { label: 'Início', href: '/inicio', iconName: 'Home' },
            { label: 'Turmas', href: '/turmas', iconName: 'School' },
            { label: 'Dashboard', href: '/dashboard', iconName: 'LayoutDashboard' },
            { label: 'Gestão de Impacto', href: '/gestao', iconName: 'Trophy' },
            { label: 'Equipe Pedagógica', href: '/gestao/equipe', iconName: 'Users' },
            { label: 'Financeiro', href: '/gestao/financeiro', iconName: 'CreditCard' },
            { label: 'Mapa de Risco', href: '/turma', iconName: 'ClipboardList' },
            { label: labels.subjects, href: '/alunos', iconName: 'GraduationCap' },
            { label: 'Configurações', href: '/configuracoes', iconName: 'Settings' },
        ],
        ADMIN: [
            { label: 'Painel Global', href: '/super-admin', iconName: 'ShieldAlert' },
            { label: labels.organizations, href: '/super-admin/escolas', iconName: 'School' },
            { label: 'Financeiro', href: '/super-admin/financeiro', iconName: 'CreditCard' },
            { label: 'Suporte', href: '/super-admin/suporte', iconName: 'LifeBuoy' },
            { label: 'Configurações SaaS', href: '/super-admin/configuracoes', iconName: 'Settings' },
        ],
    };

    return NAV_BY_ROLE[role] ?? [];
}
