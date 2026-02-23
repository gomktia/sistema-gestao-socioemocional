import type { DriveStep } from 'driver.js';

const COMMON_INTRO: DriveStep = {
  popover: {
    title: 'Bem-vindo ao Sistema Triavium!',
    description: 'Este tour vai guiá-lo pelas funcionalidades principais. Você pode sair a qualquer momento e reiniciar depois em Configurações.',
  },
};

const SIDEBAR_STEP: DriveStep = {
  element: '[data-tour="sidebar-nav"]',
  popover: {
    title: 'Menu de Navegação',
    description: 'Aqui você encontra todas as áreas do sistema. O menu se adapta ao seu perfil de acesso.',
    side: 'right' as const,
  },
};

const NOTIFICATION_STEP: DriveStep = {
  element: '[data-tour="notification-bell"]',
  popover: {
    title: 'Notificações em Tempo Real',
    description: 'Alertas de risco crítico e lembretes de intervenção aparecem aqui. Fique atento ao indicador vermelho!',
    side: 'bottom' as const,
  },
};

const STUDENT_STEPS: DriveStep[] = [
  {
    popover: {
      title: 'Bem-vindo(a) ao Triavium!',
      description: 'Este é o seu espaço pessoal de autoconhecimento. Vamos conhecer as funcionalidades juntos.',
    },
  },
  SIDEBAR_STEP,
  {
    element: '[data-tour="minha-voz"]',
    popover: {
      title: 'Minha Voz',
      description: 'Aqui você pode escrever como está se sentindo. Suas mensagens são confidenciais e ajudam a equipe pedagógica a entender como apoiar você.',
      side: 'bottom' as const,
    },
  },
  {
    element: '[data-tour="stats-grid"]',
    popover: {
      title: 'Seu Perfil Socioemocional',
      description: 'Veja sua jornada: última avaliação, sua Força Principal (VIA), seu Plano Individual e quem acompanha seu desenvolvimento.',
      side: 'bottom' as const,
    },
  },
  {
    element: '[data-tour="quick-nav"]',
    popover: {
      title: 'Seus Instrumentos',
      description: '<strong>Responder VIA</strong>: questionário de 71 perguntas sobre suas forças de caráter. <strong>Meus Relatórios</strong>: veja o detalhamento do seu perfil.',
      side: 'top' as const,
    },
  },
  {
    popover: {
      title: 'Pronto!',
      description: 'Seus dados estão protegidos pela LGPD. Se tiver dúvidas, use o botão de Suporte no final da página.',
    },
  },
];

const TEACHER_STEPS: DriveStep[] = [
  COMMON_INTRO,
  SIDEBAR_STEP,
  {
    element: '[data-tour="quick-screening"]',
    popover: {
      title: 'Lançar Triagem (SRSS-IE)',
      description: 'Clique aqui para aplicar a triagem socioemocional na sua turma. São 12 itens por aluno, preenchidos em ~2 minutos cada.',
      side: 'bottom' as const,
    },
  },
  {
    element: '[data-tour="stats-grid"]',
    popover: {
      title: 'Resumo da Sua Escola',
      description: 'Veja o total de alunos ativos, triagens realizadas e quantos alunos estão na <strong>Camada 3</strong> (risco alto, necessitam acompanhamento intensivo).',
      side: 'bottom' as const,
    },
  },
  {
    element: '[data-tour="quick-nav"]',
    popover: {
      title: 'Navegação Rápida',
      description: 'Atalhos para o <strong>Mapa de Risco</strong> (pirâmide RTI) e a área de <strong>Sugestões de Intervenção</strong>.',
      side: 'top' as const,
    },
  },
  {
    popover: {
      title: 'Pronto para começar!',
      description: 'Você pode reiniciar este tour a qualquer momento em <strong>Configurações</strong>. Consulte o <strong>Glossário</strong> (botão "?" no canto) para termos técnicos.',
    },
  },
];

const PSYCHOLOGIST_STEPS: DriveStep[] = [
  COMMON_INTRO,
  SIDEBAR_STEP,
  NOTIFICATION_STEP,
  {
    element: '[data-tour="stats-grid"]',
    popover: {
      title: 'Indicadores Chave',
      description: 'Veja o panorama geral: alunos ativos, triagens e casos em <strong>Camada 3</strong> (risco intensivo). Cada cartão é um link direto.',
      side: 'bottom' as const,
    },
  },
  {
    element: '[data-tour="quick-nav"]',
    popover: {
      title: 'Suas Ferramentas Principais',
      description: 'Acesso rápido ao <strong>Mapa de Risco</strong> (visão da pirâmide RTI por turma) e à gestão de <strong>Intervenções C2</strong> (planos individuais e grupos).',
      side: 'top' as const,
    },
  },
  {
    popover: {
      title: 'Glossário Pedagógico',
      description: 'Use o botão <strong>"?"</strong> no canto inferior para consultar termos como Tier, Internalização, Externalizante, VIA, SRSS-IE e outros a qualquer momento.',
    },
  },
];

const MANAGER_STEPS: DriveStep[] = [
  COMMON_INTRO,
  SIDEBAR_STEP,
  NOTIFICATION_STEP,
  {
    element: '[data-tour="stats-grid"]',
    popover: {
      title: 'KPIs da Sua Escola',
      description: 'Monitore em tempo real: total de alunos, triagens realizadas e casos críticos (<strong>Camada 3</strong>). Esse painel atualiza a cada triagem.',
      side: 'bottom' as const,
    },
  },
  {
    element: '[data-tour="quick-nav"]',
    popover: {
      title: 'Mapa de Risco e Intervenções',
      description: '<strong>Mapa de Risco</strong>: pirâmide RTI com distribuição de alunos por camada. <strong>Intervenções</strong>: gestão dos planos individuais e grupos de apoio.',
      side: 'top' as const,
    },
  },
  {
    element: '[data-tour="impact-panel"]',
    popover: {
      title: 'Relatório Executivo',
      description: 'Acompanhe a eficácia das intervenções: migração de risco entre janelas de triagem. Dados para prestar contas ao conselho escolar.',
      side: 'top' as const,
    },
  },
  {
    popover: {
      title: 'Tudo pronto!',
      description: 'Você pode reiniciar este tour em <strong>Configurações</strong>. Para termos técnicos, use o <strong>Glossário</strong> (botão "?").',
    },
  },
];

export function getStepsForRole(role: string): DriveStep[] {
  const map: Record<string, DriveStep[]> = {
    STUDENT: STUDENT_STEPS,
    TEACHER: TEACHER_STEPS,
    PSYCHOLOGIST: PSYCHOLOGIST_STEPS,
    COUNSELOR: PSYCHOLOGIST_STEPS,
    MANAGER: MANAGER_STEPS,
    ADMIN: MANAGER_STEPS,
    RESPONSIBLE: [],
  };
  return map[role] ?? [];
}
