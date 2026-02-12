export interface EWSSummary {
    studentId: string;
    hasAttendanceAlert: boolean;
    hasGradeAlert: boolean;
    hasDisciplinaryAlert: boolean;
    alertLevel: 'NONE' | 'WATCH' | 'CRITICAL';
    rationale: string[];
}

export function calculateEWSAlert(
    currentAttendance: number, // 0 a 100
    currentAverage: number,    // 0 a 10
    previousAverage?: number,  // 0 a 10
    disciplinaryLogs: number = 0
): EWSSummary {
    const rationale: string[] = [];
    let alertLevel: 'NONE' | 'WATCH' | 'CRITICAL' = 'NONE';

    // Alerta de Faltas (> 10%)
    const hasAttendanceAlert = currentAttendance < 90;
    if (hasAttendanceAlert) {
        alertLevel = 'CRITICAL';
        rationale.push(`Baixa frequência detectada: ${currentAttendance.toFixed(1)}% (Limite: 90%)`);
    }

    // Alerta de Queda de Média (> 20%)
    let hasGradeAlert = false;
    if (previousAverage && previousAverage > 0) {
        const drop = (previousAverage - currentAverage) / previousAverage;
        if (drop > 0.20) {
            hasGradeAlert = true;
            alertLevel = alertLevel === 'CRITICAL' ? 'CRITICAL' : 'WATCH';
            rationale.push(`Queda brusca no desempenho acadêmico: ${(drop * 100).toFixed(1)}% em relação ao período anterior.`);
        }
    }

    // Alerta de Ocorrências Disciplinares
    const hasDisciplinaryAlert = disciplinaryLogs >= 3;
    if (hasDisciplinaryAlert) {
        alertLevel = 'CRITICAL';
        rationale.push(`Comportamento: ${disciplinaryLogs} ocorrências disciplinares registradas.`);
    }

    return {
        studentId: '',
        hasAttendanceAlert,
        hasGradeAlert,
        hasDisciplinaryAlert,
        alertLevel,
        rationale
    };
}
