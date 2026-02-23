export interface GlossaryTerm {
  term: string;
  shortDef: string;
  longDef: string;
  category: 'rti' | 'instrument' | 'domain' | 'system';
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Camada 1 / Tier 1',
    shortDef: 'Nível universal (baixo risco)',
    longDef: 'Camada Universal do modelo RTI. Inclui alunos com pontuação baixa no SRSS-IE (0-1 ponto por subescala). Esses alunos se beneficiam das intervenções universais aplicadas a toda a turma, sem necessidade de acompanhamento individual.',
    category: 'rti',
  },
  {
    term: 'Camada 2 / Tier 2',
    shortDef: 'Nível focalizado (risco moderado)',
    longDef: 'Camada Focalizada. Alunos com pontuação moderada no SRSS-IE (2-8 pontos Externalizante, 1-5 Internalizante). Precisam de intervenções em pequenos grupos: habilidades sociais, regulação emocional, mentoria entre pares.',
    category: 'rti',
  },
  {
    term: 'Camada 3 / Tier 3',
    shortDef: 'Nível intensivo (alto risco)',
    longDef: 'Camada Intensiva. Alunos com pontuação alta no SRSS-IE (9+ Externalizante, 6+ Internalizante). Necessitam de Plano de Desenvolvimento Individual (PDI), possível encaminhamento para psicólogo externo, protocolo de crise.',
    category: 'rti',
  },
  {
    term: 'RTI (Response to Intervention)',
    shortDef: 'Modelo de resposta a intervenção em 3 camadas',
    longDef: 'Estrutura de suporte baseada em evidências que organiza os alunos em 3 camadas de intensidade: Universal (80% dos alunos), Focalizada (15%), e Intensiva (5%). Cada camada recebe intervenções proporcionais ao nível de risco.',
    category: 'rti',
  },
  {
    term: 'SRSS-IE',
    shortDef: 'Escala de triagem de risco socioemocional',
    longDef: 'Student Risk Screening Scale - Internalizing/Externalizing. Instrumento de 12 itens preenchido pelo professor para cada aluno, com escala de 0-3 por item. Mede dois domínios: Externalizante e Internalizante. Tempo: ~2 min por aluno.',
    category: 'instrument',
  },
  {
    term: 'VIA (Forças de Caráter)',
    shortDef: 'Questionário de 24 forças de caráter',
    longDef: 'Values in Action Inventory. Questionário de 71 itens respondido pelo próprio aluno, que identifica 24 forças de caráter organizadas em 6 virtudes (Sabedoria, Coragem, Humanidade, Justiça, Moderação, Transcendência). As 5 forças mais altas são as "Forças Assinatura".',
    category: 'instrument',
  },
  {
    term: 'Big Five',
    shortDef: 'Modelo de 5 fatores de personalidade',
    longDef: 'Avaliação dos 5 grandes domínios de personalidade: Abertura, Conscienciosidade, Estabilidade Emocional, Extroversão e Amabilidade. Complementa o VIA com uma visão mais ampla do perfil psicológico do aluno.',
    category: 'instrument',
  },
  {
    term: 'IEAA',
    shortDef: 'Inventário de estratégias de aprendizagem',
    longDef: 'Inventário de Estratégias de Aprendizagem e Autorregulação. Mede 4 dimensões: Cognitiva, Metacognitiva, Gestão de Recursos e Motivacional. Classifica o aluno em perfis (Executivo, Cientista, Engajado, Vulnerável) e níveis de autorregulação.',
    category: 'instrument',
  },
  {
    term: 'Externalizante',
    shortDef: 'Comportamentos direcionados para fora',
    longDef: 'Domínio do SRSS-IE que mede comportamentos observáveis direcionados ao ambiente externo: agressividade, desafio a regras, conflitos com colegas, impulsividade. Itens 1-7 da escala. Pontos de corte: 0-1 (Tier 1), 2-8 (Tier 2), 9+ (Tier 3).',
    category: 'domain',
  },
  {
    term: 'Internalizante',
    shortDef: 'Sofrimento emocional interno',
    longDef: 'Domínio do SRSS-IE que mede sofrimento interno não visível: tristeza persistente, isolamento social, ansiedade, retraimento. Itens 8-12 da escala. Pontos de corte: 0 (Tier 1), 1-5 (Tier 2), 6+ (Tier 3). Mais difícil de detectar que o Externalizante.',
    category: 'domain',
  },
  {
    term: 'Janela de Triagem',
    shortDef: 'Período de aplicação da triagem SRSS-IE',
    longDef: 'O sistema utiliza 3 janelas anuais: Diagnóstica (março), Monitoramento (junho/julho) e Final (outubro). Comparar os resultados entre janelas permite medir a evolução dos alunos e a eficácia das intervenções.',
    category: 'system',
  },
  {
    term: 'Mapa de Risco',
    shortDef: 'Visualização da pirâmide RTI por turma',
    longDef: 'Tela que exibe a distribuição dos alunos nas 3 camadas de risco (formato pirâmide) para cada turma. Verde (Camada 1) na base, amarelo (Camada 2) no meio, vermelho (Camada 3) no topo.',
    category: 'system',
  },
  {
    term: 'PDI (Plano de Desenvolvimento Individual)',
    shortDef: 'Plano de intervenção personalizado',
    longDef: 'Documento que registra os objetivos, estratégias e metas para um aluno em Camada 2 ou 3. Cruza as forças de caráter (VIA) com os riscos identificados (SRSS-IE) para sugerir intervenções que usem os pontos fortes do aluno.',
    category: 'system',
  },
  {
    term: 'Forças Assinatura',
    shortDef: 'As 5 forças de caráter mais fortes do aluno',
    longDef: 'Segundo a Psicologia Positiva (Martin Seligman / VIA Institute), cada pessoa tem 5 forças de caráter que são mais naturais e energizantes. Identificá-las permite direcionar intervenções que aproveitem os pontos fortes do aluno.',
    category: 'system',
  },
];
