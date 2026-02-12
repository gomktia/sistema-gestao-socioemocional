// ============================================================
// EXEMPLO DE USO: Motor de Inteligência Socioemocional
// Execute: npx ts-node src/example.ts
// ============================================================

import { calculateStudentProfile } from './core/logic/scoring';
import { filterProfileByRole } from './core/rbac/permissions';
import { GradeLevel, UserRole, VIARawAnswers, SRSSRawAnswers } from './core/types';

// --- Cenário: Aluno de 3ª série com ansiedade alta e forças em Criatividade ---

// Respostas do questionário VIA (71 itens, escala 0-4)
const viaAnswers: VIARawAnswers = {
  // Criatividade (3, 30, 48) - ALTA
  3: 4, 30: 4, 48: 3,
  // Curiosidade (23, 25, 69) - ALTA
  23: 4, 25: 3, 69: 4,
  // Pensamento Crítico (7, 9, 71)
  7: 3, 9: 3, 71: 3,
  // Amor ao Aprendizado (5, 17, 45)
  5: 3, 17: 2, 45: 3,
  // Sensatez (4, 63, 6)
  4: 2, 63: 2, 6: 3,
  // Bravura (35, 57, 67)
  35: 1, 57: 1, 67: 2,
  // Perseverança (40, 47, 52) - BAIXA
  40: 1, 47: 1, 52: 1,
  // Autenticidade (10, 33, 41)
  10: 3, 33: 3, 41: 2,
  // Vitalidade (13, 18, 53) - BAIXA
  13: 1, 18: 0, 53: 1,
  // Amor (16, 37, 70)
  16: 3, 37: 3, 70: 2,
  // Bondade (21, 50, 66)
  21: 3, 50: 3, 66: 2,
  // Inteligência Social (1, 20, 59)
  1: 2, 20: 2, 59: 3,
  // Cidadania (31, 34, 61)
  31: 2, 34: 2, 61: 2,
  // Imparcialidade (2, 58, 68)
  2: 3, 58: 3, 68: 3,
  // Liderança (19, 62, 55)
  19: 1, 62: 1, 55: 1,
  // Perdão (26, 32, 54)
  26: 2, 32: 2, 54: 2,
  // Modéstia (11, 46, 56)
  11: 3, 46: 3, 56: 3,
  // Prudência (29, 36, 65)
  29: 3, 36: 3, 65: 3,
  // Autorregulação (12, 38, 60)
  12: 2, 38: 2, 60: 2,
  // Apreciação ao Belo (39, 43) - ALTA
  39: 4, 43: 4,
  // Gratidão (22, 24, 44) - ALTA
  22: 4, 24: 4, 44: 4,
  // Humor (14, 42, 64) - ALTA
  14: 4, 42: 4, 64: 3,
  // Esperança (15, 27, 49)
  15: 2, 27: 2, 49: 2,
  // Espiritualidade (8, 28, 51)
  8: 2, 28: 2, 51: 2,
};

// Respostas SRSS-IE preenchidas pelo professor (12 itens, escala 0-3)
const srssAnswers: SRSSRawAnswers = {
  1: 0,  // Furto
  2: 0,  // Mentira
  3: 0,  // Indisciplina
  4: 0,  // Rejeição
  5: 2,  // Baixo desempenho - FREQUENTEMENTE (alerta 3ª série!)
  6: 0,  // Atitude negativa
  7: 0,  // Agressividade
  8: 1,  // Apatia
  9: 1,  // Timidez
  10: 2, // Tristeza - FREQUENTEMENTE
  11: 3, // Ansiedade - MUITO FREQUENTEMENTE (alerta 3ª série!)
  12: 1, // Solitário
};

// --- Calcular perfil completo ---
const profile = calculateStudentProfile(viaAnswers, srssAnswers, GradeLevel.TERCEIRO_ANO);

console.log('='.repeat(70));
console.log('PERFIL SOCIOEMOCIONAL DO ALUNO');
console.log('='.repeat(70));

console.log('\n--- RISCO (SRSS-IE) ---');
console.log(`Externalizante: ${profile.externalizing.score}/${profile.externalizing.maxPossible} → ${profile.externalizing.color} (${profile.externalizing.label})`);
console.log(`Internalizante: ${profile.internalizing.score}/${profile.internalizing.maxPossible} → ${profile.internalizing.color} (${profile.internalizing.label})`);
console.log(`\nTIER GERAL: ${profile.overallTier} (${profile.overallColor})`);

console.log('\n--- TOP 5 FORÇAS DE ASSINATURA ---');
profile.signatureStrengths.forEach((s, i) => {
  console.log(`  ${i + 1}. ${s.label} (${s.virtue}): ${s.rawSum}/${s.maxPossible} = ${s.normalizedScore}%`);
});

console.log('\n--- ÁREAS DE DESENVOLVIMENTO (Bottom 5) ---');
profile.developmentAreas.forEach((s, i) => {
  console.log(`  ${i + 1}. ${s.label} (${s.virtue}): ${s.rawSum}/${s.maxPossible} = ${s.normalizedScore}%`);
});

if (profile.gradeAlerts.length > 0) {
  console.log('\n--- ALERTAS ESPECÍFICOS DA 3ª SÉRIE ---');
  profile.gradeAlerts.forEach(a => {
    console.log(`  [${a.severity}] Item ${a.itemNumber} (${a.itemLabel}): score ${a.score}/3`);
    console.log(`    → ${a.rationale}`);
  });
}

if (profile.interventionSuggestions.length > 0) {
  console.log('\n--- SUGESTÕES DE INTERVENÇÃO (Cruzamento Risco × Forças) ---');
  profile.interventionSuggestions.forEach(s => {
    console.log(`\n  Risco: ${s.targetRisk}`);
    console.log(`  Alavanca: ${s.strengthLabel}`);
    console.log(`  Estratégia: ${s.strategy}`);
    console.log(`  Racional: ${s.rationale}`);
  });
}

// --- Demonstração do RBAC ---
console.log('\n' + '='.repeat(70));
console.log('DEMONSTRAÇÃO RBAC: Mesmo perfil visto por diferentes papéis');
console.log('='.repeat(70));

console.log('\n[ALUNO vê]:');
const studentView = filterProfileByRole(profile, UserRole.STUDENT);
console.log('  Campos visíveis:', Object.keys(studentView).join(', '));

console.log('\n[PROFESSOR vê]:');
const teacherView = filterProfileByRole(profile, UserRole.TEACHER);
console.log('  Campos visíveis:', Object.keys(teacherView).join(', '));

console.log('\n[PSICÓLOGO vê]:');
const psychView = filterProfileByRole(profile, UserRole.PSYCHOLOGIST);
console.log('  Campos visíveis:', Object.keys(psychView).join(', '));
