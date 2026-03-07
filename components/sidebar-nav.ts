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
            { label: 'Minha Voz', href: '/minha-voz', iconName: 'MessageCircleHeart' },
            {
                label: 'Avaliações',
                href: '/questionario',
                iconName: 'ClipboardList',
                children: [
                    { label: 'Responder VIA', href: '/questionario', iconName: 'ClipboardList' },
                    { label: 'Big Five', href: '/bigfive', iconName: 'BrainCircuit' },
                    { label: 'IEAA', href: '/ieaa', iconName: 'BookOpen' },
                ]
            },
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
            { label: 'Sugestoes', href: '/sugestoes', iconName: 'Lightbulb' },
            { label: 'Configurações', href: '/configuracoes', iconName: 'Settings' },
        ],
        PSYCHOLOGIST: [
            { label: 'Início', href: '/inicio', iconName: 'Home' },
            { label: 'Dashboard Híbrido', href: '/dashboard-hibrido', iconName: 'Activity' },
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
            {
                label: 'Dashboards',
                href: '/dashboard',
                iconName: 'LayoutDashboard',
                children: [
                    { label: 'Dashboard Geral', href: '/dashboard', iconName: 'LayoutDashboard' },
                    { label: 'Monitoramento', href: '/dashboard/intervencoes', iconName: 'TrendingUp' },
                    { label: 'Análise Híbrida', href: '/dashboard-hibrido', iconName: 'Activity' },
                    { label: 'Comparativo', href: '/turmas/comparativo', iconName: 'BarChart3' },
                ]
            },
            { label: 'Turmas', href: '/turmas', iconName: 'School' },
            { label: 'Mapa de Risco', href: '/turma', iconName: 'HeartPulse' },
            { label: labels.subjects, href: '/alunos', iconName: 'GraduationCap' },
            {
                label: 'Gestão',
                href: '/gestao',
                iconName: 'Trophy',
                children: [
                    { label: 'Gestão de Impacto', href: '/gestao', iconName: 'Trophy' },
                    { label: 'Equipe Pedagógica', href: '/gestao/equipe', iconName: 'Users' },
                    { label: 'Financeiro', href: '/gestao/financeiro', iconName: 'CreditCard' },
                ]
            },
            { label: 'Sugestões', href: '/sugestoes', iconName: 'Lightbulb' },
            { label: 'Suporte', href: '/suporte-escola', iconName: 'LifeBuoy' },
            { label: 'Config. da Escola', href: '/escola/configuracoes', iconName: 'School' },
            { label: 'Calendário', href: '/calendario-triagem', iconName: 'Calendar' },
            { label: 'Configurações', href: '/configuracoes', iconName: 'Settings' },
        ],
        RESPONSIBLE: [
            { label: 'Início', href: '/responsavel', iconName: 'Home' },
            { label: 'Percepção Familiar', href: '/responsavel/percepcao-familiar', iconName: 'Users' },
            { label: 'SDQ', href: '/responsavel/sdq', iconName: 'ClipboardCheck' },
            { label: 'Mensagens', href: '/responsavel/mensagens', iconName: 'MessageSquare' },
            { label: 'Perfil', href: '/responsavel/perfil', iconName: 'User' },
        ],
        ADMIN: [
            { label: 'Painel Global', href: '/super-admin', iconName: 'ShieldAlert' },
            { label: labels.organizations, href: '/super-admin/escolas', iconName: 'School' },
            { label: 'Usuarios', href: '/super-admin/usuarios', iconName: 'Users' },
            { label: 'Financeiro', href: '/super-admin/financeiro', iconName: 'CreditCard' },
            { label: 'Suporte', href: '/super-admin/suporte', iconName: 'LifeBuoy' },
            { label: 'Logs', href: '/super-admin/logs', iconName: 'ScrollText' },
            { label: 'Webhooks', href: '/super-admin/webhooks', iconName: 'Webhook' },
            { label: 'Feedback', href: '/super-admin/feedback', iconName: 'MessageSquareHeart' },
            { label: 'Configuracoes', href: '/super-admin/configuracoes', iconName: 'Settings' },
        ],
    };

    return NAV_BY_ROLE[role] ?? [];
}
