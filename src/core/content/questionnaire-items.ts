export interface QuestionnaireItem {
    number: number;
    text: string;
}

/**
 * Agrupamento de itens por virtude para exibição em passos (wizard).
 */
export const VIA_ITEMS_BY_VIRTUE = {
    SABEDORIA: {
        label: 'Sabedoria e Conhecimento',
        description: 'Estas perguntas são sobre como você aprende, pensa e resolve problemas.',
        items: [3, 4, 5, 6, 7, 9, 17, 23, 25, 30, 45, 48, 63, 69, 71],
    },
    CORAGEM: {
        label: 'Coragem',
        description: 'Estas perguntas são sobre como você enfrenta desafios e dificuldades.',
        items: [10, 13, 18, 33, 35, 40, 41, 47, 52, 53, 57, 67],
    },
    HUMANIDADE: {
        label: 'Humanidade',
        description: 'Estas perguntas são sobre como você se relaciona com as outras pessoas.',
        items: [1, 16, 20, 21, 37, 50, 59, 66, 70],
    },
    JUSTICA: {
        label: 'Justiça',
        description: 'Estas perguntas são sobre como você age em grupo e na comunidade.',
        items: [2, 19, 31, 34, 55, 58, 61, 62, 68],
    },
    MODERACAO: {
        label: 'Moderação',
        description: 'Estas perguntas são sobre como você controla seus impulsos e emoções.',
        items: [11, 12, 26, 29, 32, 36, 38, 46, 54, 56, 60, 65],
    },
    TRANSCENDENCIA: {
        label: 'Transcendência',
        description: 'Estas perguntas são sobre o que dá sentido e alegria à sua vida.',
        items: [8, 14, 15, 22, 24, 27, 28, 39, 42, 43, 44, 49, 51, 64],
    },
} as const;

/**
 * Textos integrais dos 71 itens do questionário VIA.
 * Mapeamento: número do item -> texto em português.
 */
export const VIA_ITEM_TEXTS: Record<number, string> = {
    1: 'Sei o que fazer para que as pessoas se sintam bem',
    2: 'Trato todas as pessoas com igualdade',
    3: 'Faço as coisas de jeitos diferentes',
    4: 'Sou competente em dar conselhos',
    5: 'Ter que aprender coisas novas me motiva',
    6: 'Faço bons julgamentos, mesmo em situações difíceis',
    7: 'Penso em diferentes possibilidades quando tomo uma decisão',
    8: 'Sinto que a minha vida tem um sentido maior',
    9: 'Sou competente para analisar problemas por diferentes "Ângulos"',
    10: 'Não minto para agradar pessoas',
    11: 'Reconheço meus defeitos',
    12: 'Sou paciente',
    13: 'Viver é empolgante',
    14: 'Levo a vida com bom humor',
    15: 'Coisas boas me aguardam no futuro',
    16: 'Eu me sinto amado(a)',
    17: 'Não vejo o tempo passar quando estou aprendendo algo novo',
    18: 'Sempre tenho muita energia',
    19: 'As pessoas confiam na minha capacidade de liderança',
    20: 'Expresso meus afetos com clareza',
    21: 'Gosto de fazer gentilezas para os outros',
    22: 'Tenho que agradecer pelas pessoas que fazem parte da minha vida',
    23: 'Sinto uma forte atração por novidades',
    24: 'Consigo encontrar em minha vida motivos para ser grato(a)',
    25: 'Gosto de descobrir coisas novas',
    26: 'Não guardo mágoa se alguém me maltrata',
    27: 'Creio que amanhã será melhor que hoje',
    28: 'Acredito em uma força sagrada que nos liga um ao outro',
    29: 'Penso muito antes de tomar uma decisão',
    30: 'Crio coisas úteis',
    31: 'Penso que todo mundo deve dedicar parte de seu tempo para melhorar o local onde habita',
    32: 'Perdoo as pessoas facilmente',
    33: 'Sou uma pessoa verdadeira',
    34: 'Consigo criar um bom ambiente nos grupos que trabalho',
    35: 'Enfrento perigos para fazer o bem',
    36: 'Analiso o que as pessoas dizem antes de dar minha opinião',
    37: 'Sou uma pessoa amorosa',
    38: 'Mantenho a calma em situações difíceis',
    39: 'Sei admirar a beleza que existe no mundo',
    40: 'Não desisto antes de atingir as minhas metas',
    41: 'Ajo de acordo com meus sentimentos',
    42: 'Consigo fazer as pessoas sorrirem com facilidade',
    43: 'Sinto um encantamento por pessoas talentosas',
    44: 'Agradeço a cada dia pela vida',
    45: 'Não perco as oportunidades que tenho para aprender coisas novas',
    46: 'Sou uma pessoa que tem humildade',
    47: 'Eu me esforço em tudo que faço',
    48: 'Tenho ideias originais',
    49: 'Sei que as coisas darão certo',
    50: 'Acho que é importante ajudar os outros',
    51: 'Acreditar em um ser superior dá sentido à minha vida',
    52: 'Persisto para conquistar o que desejo',
    53: 'Eu me sinto cheio(a) de vida',
    54: 'Penso que a vingança não vale a pena',
    55: 'Sou uma pessoa bastante disciplinada',
    56: 'Não ajo como se eu fosse melhor do que os outros',
    57: 'Corro risco para fazer o que tem que ser feito',
    58: 'As regras devem ser cumpridas por todos',
    59: 'Tenho muita facilidade para perceber os sentimentos das pessoas mesmo sem elas me dizerem',
    60: 'Sou uma pessoa cuidadosa',
    61: 'Faço coisas concretas para tornar o mundo um lugar melhor para se viver',
    62: 'Tenho facilidade para organizar trabalhos em grupo',
    63: 'Consigo ajudar pessoas a se entenderem quando há uma discussão',
    64: 'Tenho facilidade para fazer uma situação chata se tornar divertida',
    65: 'Costumo tomar decisões quando estou ciente das consequências dos meus atos',
    66: 'Dar é mais importante que receber',
    67: 'Eu me sinto bem ao fazer a coisa certa mesmo que isso possa me prejudicar',
    68: 'Sou uma pessoa justa',
    69: 'Sempre quero descobrir como as coisas funcionam',
    70: 'Tenho muitos amores',
    71: 'Mantenho minha mente aberta',
};
