'use client';

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 50,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#000',
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
        borderBottom: '1pt solid #000',
        paddingBottom: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    urgentBadge: {
        backgroundColor: '#000',
        color: '#fff',
        padding: '4pt 8pt',
        alignSelf: 'center',
        fontSize: 12,
        fontWeight: 'black',
        marginBottom: 20,
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        backgroundColor: '#eee',
        padding: '2pt 5pt',
        marginBottom: 5,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    label: {
        width: 120,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    riskBox: {
        border: '1pt solid #000',
        padding: 10,
        marginTop: 10,
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        left: 50,
        right: 50,
        textAlign: 'center',
        fontSize: 8,
        borderTop: '1pt solid #ccc',
        paddingTop: 10,
    },
    signatureLine: {
        marginTop: 50,
        borderTop: '0.5pt solid #000',
        width: 200,
        textAlign: 'center',
        alignSelf: 'center',
    }
});

interface CrisisProtocolReportProps {
    studentName: string;
    grade: string;
    riskTier: string;
    externalizingScore: number;
    internalizingScore: number;
    criticalAlerts: any[];
}

export function CrisisProtocolReport({
    studentName,
    grade,
    riskTier,
    externalizingScore,
    internalizingScore,
    criticalAlerts
}: CrisisProtocolReportProps) {
    return (
        <Document title={`Protocolo de Crise - ${studentName}`}>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Encaminhamento Assistido de Alta Complexidade</Text>
                    <Text>Rede de Atenção Psicossocial (RAPS) / CAPS / SAMU</Text>
                </View>

                <Text style={styles.urgentBadge}>URGÊNCIA SOCIOEMOCIONAL - TIER 3</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Identificação do Aluno</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Nome Completo:</Text>
                        <Text style={styles.content}>{studentName}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Série/Turma:</Text>
                        <Text style={styles.content}>{grade}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Data da Triagem:</Text>
                        <Text style={styles.content}>{new Date().toLocaleDateString('pt-BR')}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Indicadores de Risco (RTI Framework)</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Camada de Risco:</Text>
                        <Text style={styles.content}>TIER 3 - ALTO RISCO (Rastro Vermelho)</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Score Externalizante:</Text>
                        <Text style={styles.content}>{externalizingScore} / 21</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Score Internalizante:</Text>
                        <Text style={styles.content}>{internalizingScore} / 15</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sinais de Alerta Críticos Detectados</Text>
                    {criticalAlerts.map((alert, i) => (
                        <View key={i} style={{ marginBottom: 5 }}>
                            <Text style={{ fontWeight: 'bold' }}>• {alert.itemLabel}</Text>
                            <Text style={{ marginLeft: 10, fontSize: 9 }}>Severidade: {alert.severity} | Rationale: {alert.rationale}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.riskBox}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>RECOMENDAÇÃO TÉCNICA:</Text>
                    <Text style={{ lineHeight: 1.4 }}>
                        O aluno apresenta indicadores de comportamento ou estado emocional que extrapolam a capacidade de intervenção pedagógica escolar exclusiva.
                        Recomenda-se avaliação especializada imediata por equipe multidisciplinar de saúde mental para diagnóstico e suporte clínico.
                        A escola manterá o acompanhamento pedagógico adaptado conforme o Plano de Apoio Individual (PAI).
                    </Text>
                </View>

                <View style={styles.signatureLine}>
                    <Text style={{ fontSize: 8 }}>Responsável Técnico / Psicólogo Escolar</Text>
                    <Text style={{ fontSize: 7, marginTop: 2 }}>Sistema de Gestão Socioemocional</Text>
                </View>

                <Text style={styles.footer}>
                    Este documento é confidencial e deve ser tratado conforme a LGPD e o Código de Ética Profissional.
                    Gerado em: {new Date().toLocaleString('pt-BR')}
                </Text>
            </Page>
        </Document>
    );
}
