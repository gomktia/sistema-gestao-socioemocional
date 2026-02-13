'use client';

import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { type OrganizationLabels } from '@/src/lib/utils/labels';

// Register fonts
Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf' },
        { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf', fontWeight: 'bold' },
    ]
});

const styles = StyleSheet.create({
    page: {
        padding: 50,
        fontFamily: 'Helvetica',
        fontSize: 11,
        color: '#334155',
        lineHeight: 1.5,
    },
    header: {
        marginBottom: 30,
        borderBottomWidth: 2,
        borderBottomColor: '#cbd5e1',
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#1e293b',
    },
    subtitle: {
        fontSize: 10,
        color: '#64748b',
        textTransform: 'uppercase',
        marginTop: 4,
    },
    section: {
        marginBottom: 15,
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
        backgroundColor: '#f8fafc',
        padding: 15,
        borderRadius: 4,
    },
    infoItem: {
        width: '50%',
        marginBottom: 8,
    },
    label: {
        fontSize: 9,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#94a3b8',
        marginBottom: 2,
    },
    value: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#334155',
    },
    bodyText: {
        textAlign: 'justify',
        marginBottom: 10,
        whiteSpace: 'pre-line',
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        left: 50,
        right: 50,
        textAlign: 'center',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 10,
    },
    signature: {
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    signatureLine: {
        width: '45%',
        borderTopWidth: 1,
        borderTopColor: '#000',
        paddingTop: 8,
        alignItems: 'center',
    },
    signatureText: {
        fontSize: 9,
        fontWeight: 'bold',
    },
});

interface PdfProps {
    student: any;
    opinion: string;
    labels: OrganizationLabels;
    authorName: string;
    authorRole: string;
}

export const PdfReportDocument = ({ student, opinion, labels, authorName, authorRole }: PdfProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header com Logo */}
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {student.tenant?.logoUrl && (
                        <Image
                            src={student.tenant.logoUrl}
                            style={{ width: 40, height: 40, marginRight: 15, borderRadius: 4 }}
                        />
                    )}
                    <View>
                        <Text style={styles.title}>{student.tenant?.name || 'Relatório Institucional'}</Text>
                        <Text style={styles.subtitle}>Prontuário de Acompanhamento Socioemocional</Text>
                    </View>
                </View>
                <View>
                    <Text style={{ fontSize: 9, color: '#94a3b8' }}>
                        {new Date().toLocaleDateString('pt-BR')}
                    </Text>
                </View>
            </View>

            {/* Student Info - Layout Compacto */}
            <View style={{ ...styles.infoGrid, borderRadius: 8, padding: 20 }}>
                <View style={{ flexDirection: 'row', width: '100%', marginBottom: 15 }}>
                    <View style={{ width: '60%' }}>
                        <Text style={styles.label}>Nome do {labels.subject}</Text>
                        <Text style={{ ...styles.value, fontSize: 13 }}>{student.name}</Text>
                    </View>
                    <View style={{ width: '40%' }}>
                        <Text style={styles.label}>Matrícula / ID</Text>
                        <Text style={styles.value}>{student.enrollmentId || 'N/A'}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '60%' }}>
                        <Text style={styles.label}>Unidade / Turma</Text>
                        <Text style={styles.value}>{student.classroom?.name || 'Não enturmado'}</Text>
                    </View>
                    <View style={{ width: '40%' }}>
                        <Text style={styles.label}>Data de Nascimento</Text>
                        <Text style={styles.value}>{student.birthDate ? new Date(student.birthDate).toLocaleDateString('pt-BR') : 'N/A'}</Text>
                    </View>
                </View>
            </View>

            <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#1e293b', textTransform: 'uppercase', letterSpacing: 1 }}>
                    Parecer Técnico
                </Text>
            </View>

            {/* Main Content - Sem bordas, layout limpo */}
            <View style={styles.section}>
                <Text style={{ ...styles.bodyText, lineHeight: 1.6, color: '#334155' }}>
                    {opinion}
                </Text>
            </View>

            {/* Signatures */}
            <View style={styles.signature}>
                <View style={styles.signatureLine}>
                    <Text style={styles.signatureText}>{authorName}</Text>
                    <Text style={{ fontSize: 8, color: '#64748b' }}>{authorRole}</Text>
                </View>
                <View style={styles.signatureLine}>
                    <Text style={styles.signatureText}>Coordenação / Direção</Text>
                    <Text style={{ fontSize: 8, color: '#64748b' }}>Visto Institucional</Text>
                </View>
            </View>

            {/* Footer Minimalista */}
            <View style={styles.footer}>
                <Text style={{ fontSize: 7, color: '#cbd5e1' }}>
                    Documento gerado eletronicamente em {new Date().toLocaleString('pt-BR')} • {student.tenant?.name || 'SocioEmotional System'}
                </Text>
            </View>
        </Page>
    </Document>
);
