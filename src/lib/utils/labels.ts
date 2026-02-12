import { OrganizationType } from '@/src/core/types';

export interface OrganizationLabels {
    subject: string;       // "Aluno" / "Militar" / "Colaborador" / "Atleta"
    subjects: string;      // "Alunos" / "Militares" / "Colaboradores" / "Atletas"
    actor: string;         // "Professor" / "Comandante" / "Gestor" / "Treinador"
    actors: string;        // "Professores" / "Comandantes" / "Gestores" / "Treinadores"
    organization: string;  // "Escola" / "Unidade" / "Empresa" / "Clube"
    organizations: string; // "Escolas" / "Unidades" / "Empresas" / "Clubes"
}

const LABELS_MAP: Record<OrganizationType, OrganizationLabels> = {
    [OrganizationType.EDUCATIONAL]: {
        subject: 'Aluno',
        subjects: 'Alunos',
        actor: 'Professor',
        actors: 'Professores',
        organization: 'Escola',
        organizations: 'Escolas',
    },
    [OrganizationType.MILITARY]: {
        subject: 'Militar',
        subjects: 'Militares',
        actor: 'Comandante',
        actors: 'Comandantes',
        organization: 'Unidade',
        organizations: 'Unidades',
    },
    [OrganizationType.CORPORATE]: {
        subject: 'Colaborador',
        subjects: 'Colaboradores',
        actor: 'Gestor',
        actors: 'Gestores',
        organization: 'Empresa',
        organizations: 'Empresas',
    },
    [OrganizationType.SPORTS]: {
        subject: 'Atleta',
        subjects: 'Atletas',
        actor: 'Treinador',
        actors: 'Treinadores',
        organization: 'Clube',
        organizations: 'Clubes',
    },
};

export function getLabels(type?: OrganizationType | string | null): OrganizationLabels {
    if (type && type in LABELS_MAP) {
        return LABELS_MAP[type as OrganizationType];
    }
    return LABELS_MAP[OrganizationType.EDUCATIONAL];
}
