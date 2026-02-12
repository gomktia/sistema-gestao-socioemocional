'use client';

import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Registrar fontes se necessário (usando padrão para evitar erros de setup)
// Font.register({ family: 'Inter', src: '...' });

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 12,
        color: '#1e293b',
    },
    header: {
        marginBottom: 30,
        borderBottom: '2pt solid #4f46e5',
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'black',
        color: '#4f46e5',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 10,
        color: '#64748b',
        textTransform: 'uppercase',
    },
    studentInfo: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#334155',
    },
    strengthCard: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#f8fafc',
        borderRadius: 8,
    },
    strengthName: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 2,
    },
    strengthVirtue: {
        fontSize: 8,
        color: '#64748b',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    strengthDesc: {
        fontSize: 9,
        lineHeight: 1.4,
        color: '#475569',
    },
    tipBox: {
        marginTop: 10,
        padding: 8,
        backgroundColor: '#eff6ff',
        borderRadius: 4,
    },
    tipText: {
        fontSize: 8,
        fontStyle: 'italic',
        color: '#1e40af',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 8,
        color: '#94a3b8',
        borderTop: '0.5pt solid #e2e8f0',
        paddingTop: 10,
    }
});

interface Strength {
    label: string;
    virtue: string;
    description: string;
    tip: string;
}

interface TalentReportProps {
    studentName: string;
    grade: string;
    signatureStrengths: Strength[];
}

export function TalentReport({ studentName, grade, signatureStrengths }: TalentReportProps) {
    return (
        <Document title={`Mapa de Talentos - ${studentName}`}>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Mapa de Talentos</Text>
                    <Text style={styles.subtitle}>Sistema de Gestão Socioemocional - Relatório Individual</Text>
                </View>

                <View style={styles.studentInfo}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{studentName}</Text>
                    <Text style={{ fontSize: 10, color: '#64748b' }}>Série: {grade}</Text>
                    <Text style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>
                        Data de Emissão: {new Date().toLocaleDateString('pt-BR')}
                    </Text>
                </View>

                <View>
                    <Text style={styles.sectionTitle}>Suas 5 Forças de Assinatura</Text>
                    <Text style={{ fontSize: 9, marginBottom: 15, color: '#64748b' }}>
                        As forças de assinatura são os traços de caráter que mais te definem. Usá-las traz mais satisfação e sucesso no seu dia a dia.
                    </Text>

                    {signatureStrengths.map((s, i) => (
                        <View key={i} style={styles.strengthCard}>
                            <Text style={styles.strengthName}>{i + 1}. {s.label}</Text>
                            <Text style={styles.strengthVirtue}>Virtude: {s.virtue}</Text>
                            <Text style={styles.strengthDesc}>{s.description}</Text>
                            <View style={styles.tipBox}>
                                <Text style={styles.tipText}>Dica para a Família: {s.tip}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <Text style={styles.footer}>
                    Este documento é uma ferramenta pedagógica baseada no framework VIA Character.
                    © 2026 Sistema de Gestão Socioemocional
                </Text>
            </Page>
        </Document>
    );
}
