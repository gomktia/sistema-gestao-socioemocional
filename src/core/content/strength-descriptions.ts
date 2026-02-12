import { CharacterStrength } from '../types';

export interface StrengthDescription {
    name: string;
    description: string;
    tip: string;
}

export const STRENGTH_DESCRIPTIONS: Record<string, StrengthDescription> = {
    [CharacterStrength.CRIATIVIDADE]: {
        name: 'Criatividade',
        description: 'Você encontra formas originais de resolver problemas e se expressar. Gosta de pensar "fora da caixa".',
        tip: 'Experimente atividades artísticas, escreva histórias ou invente soluções diferentes para problemas do dia a dia.',
    },
    [CharacterStrength.CURIOSIDADE]: {
        name: 'Curiosidade',
        description: 'Você tem interesse genuíno pelo mundo. Gosta de explorar, perguntar e descobrir coisas novas.',
        tip: 'Explore um tema novo por semana. Assista documentários, leia sobre assuntos que nunca estudou.',
    },
    [CharacterStrength.PENSAMENTO_CRITICO]: {
        name: 'Pensamento Crítico',
        description: 'Você analisa as situações com cuidado antes de formar uma opinião. Não aceita as coisas sem questionar.',
        tip: 'Pratique ver os dois lados de uma questão. Quando ouvir uma notícia, pergunte: "Será que é só isso?"',
    },
    [CharacterStrength.AMOR_APRENDIZADO]: {
        name: 'Amor ao Aprendizado',
        description: 'Você sente prazer em aprender coisas novas, seja na escola ou fora dela.',
        tip: 'Comece um projeto de aprendizado pessoal: um idioma, um instrumento, uma habilidade nova.',
    },
    [CharacterStrength.SENSATEZ]: {
        name: 'Sensatez',
        description: 'Você consegue dar bons conselhos e ver as situações com maturidade.',
        tip: 'Quando um amigo pedir conselho, pare e pense antes de responder. Sua reflexão é valiosa.',
    },
    [CharacterStrength.BRAVURA]: {
        name: 'Bravura',
        description: 'Você defende o que acredita, mesmo quando é difícil. Enfrenta desafios de frente.',
        tip: 'Na próxima vez que sentir medo de falar algo importante, lembre-se: sua voz importa.',
    },
    [CharacterStrength.PERSEVERANCA]: {
        name: 'Perseverança',
        description: 'Você não desiste facilmente. Quando começa algo, vai até o fim apesar das dificuldades.',
        tip: 'Divida metas grandes em passos pequenos. Celebre cada passo completado.',
    },
    [CharacterStrength.AUTENTICIDADE]: {
        name: 'Autenticidade',
        description: 'Você é verdadeiro e honesto. Age de acordo com seus valores, sem fingir ser outra pessoa.',
        tip: 'Pratique dizer o que realmente pensa, com respeito. Ser autêntico fortalece seus relacionamentos.',
    },
    [CharacterStrength.VITALIDADE]: {
        name: 'Vitalidade',
        description: 'Você tem energia e entusiasmo pela vida. Aborda o dia a dia com empolgação.',
        tip: 'Mantenha uma rotina de exercícios e sono. Sua energia contagia quem está ao seu redor.',
    },
    [CharacterStrength.AMOR]: {
        name: 'Amor',
        description: 'Você valoriza relacionamentos profundos. Sabe dar e receber carinho.',
        tip: 'Demonstre afeto pelas pessoas importantes na sua vida. Um abraço, uma mensagem, um gesto.',
    },
    [CharacterStrength.BONDADE]: {
        name: 'Bondade',
        description: 'Você se preocupa com o bem-estar dos outros e faz coisas boas sem esperar nada em troca.',
        tip: 'Faça um ato de bondade por dia, por menor que seja. Ajudar os outros também te faz bem.',
    },
    [CharacterStrength.INTELIGENCIA_SOCIAL]: {
        name: 'Inteligência Social',
        description: 'Você entende as emoções das pessoas e sabe como agir em diferentes situações sociais.',
        tip: 'Observe a linguagem corporal das pessoas. Pergunte como elas estão se sentindo de verdade.',
    },
    [CharacterStrength.CIDADANIA]: {
        name: 'Cidadania',
        description: 'Você trabalha bem em equipe e se importa com o bem do grupo, não só o seu.',
        tip: 'Participe de projetos coletivos na escola ou comunidade. Sua contribuição faz diferença.',
    },
    [CharacterStrength.IMPARCIALIDADE]: {
        name: 'Imparcialidade',
        description: 'Você trata todos com justiça, sem favoritismo. Acredita que todos merecem oportunidades iguais.',
        tip: 'Quando presenciar uma injustiça, posicione-se. Sua voz pela justiça inspira outros.',
    },
    [CharacterStrength.LIDERANCA]: {
        name: 'Liderança',
        description: 'Você sabe organizar pessoas e motivar o grupo para atingir objetivos juntos.',
        tip: 'Liderar não é mandar. Pratique ouvir sua equipe e valorizar as ideias de todos.',
    },
    [CharacterStrength.PERDAO]: {
        name: 'Perdão',
        description: 'Você consegue deixar mágoas para trás e dar segundas chances.',
        tip: 'Perdoar não é esquecer. É escolher não carregar o peso da raiva. Libere-se.',
    },
    [CharacterStrength.MODESTIA]: {
        name: 'Modéstia',
        description: 'Você não precisa se gabar. Deixa suas conquistas falarem por si.',
        tip: 'Continue sendo humilde, mas não tenha medo de reconhecer seus méritos quando perguntado.',
    },
    [CharacterStrength.PRUDENCIA]: {
        name: 'Prudência',
        description: 'Você pensa antes de agir. Considera as consequências antes de tomar decisões.',
        tip: 'Antes de decisões importantes, use a regra dos 10 minutos: espere, respire, depois decida.',
    },
    [CharacterStrength.AUTORREGULACAO]: {
        name: 'Autorregulação',
        description: 'Você consegue controlar suas emoções e impulsos. Não age por impulso.',
        tip: 'Quando sentir raiva ou ansiedade, conte até 10 e respire fundo. Você tem o controle.',
    },
    [CharacterStrength.APRECIACAO_BELO]: {
        name: 'Apreciação ao Belo',
        description: 'Você percebe e valoriza a beleza na arte, na natureza e nas pequenas coisas.',
        tip: 'Reserve um momento do dia para observar algo bonito: um pôr do sol, uma música, uma obra de arte.',
    },
    [CharacterStrength.GRATIDAO]: {
        name: 'Gratidão',
        description: 'Você reconhece as coisas boas da vida e agradece por elas.',
        tip: 'Antes de dormir, pense em 3 coisas boas que aconteceram hoje. Isso muda sua perspectiva.',
    },
    [CharacterStrength.HUMOR]: {
        name: 'Humor',
        description: 'Você vê o lado leve da vida e sabe fazer as pessoas rirem.',
        tip: 'O humor é um superpoder social. Use-o para aproximar pessoas, nunca para machucar.',
    },
    [CharacterStrength.ESPERANCA]: {
        name: 'Esperança',
        description: 'Você acredita que o futuro pode ser bom e trabalha para isso.',
        tip: 'Quando as coisas ficarem difíceis, lembre-se de momentos em que você superou desafios.',
    },
    [CharacterStrength.ESPIRITUALIDADE]: {
        name: 'Espiritualidade',
        description: 'Você sente que há um propósito maior na vida. Busca significado além do material.',
        tip: 'Reserve momentos de reflexão ou meditação. Conecte-se com o que dá sentido à sua vida.',
    },
};
