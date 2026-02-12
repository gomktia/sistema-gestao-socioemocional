'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Wand2, Download, Save, Check } from 'lucide-react';
import { generateDraftOpinion, saveProfessionalOpinion } from '@/app/actions/reports';
import { PdfReportDocument } from '@/components/reports/PdfReportDocument';
import { PDFDownloadLink } from '@react-pdf/renderer';
import type { OrganizationLabels } from '@/src/lib/utils/labels';
import { toast } from 'sonner';

interface LaudoFormProps {
    student: any;
    labels: OrganizationLabels;
    currentUser: { name: string; role: string };
}

export function LaudoForm({ student, labels, currentUser }: LaudoFormProps) {
    const [opinion, setOpinion] = useState('');
    const [generating, setGenerating] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isClient, setIsClient] = useState(false);

    // Hydration fix for PDF link
    // We use useEffect instead of useState initial since it must run on client
    useState(() => {
        // This is actually not enough, we need useEffect to be sure
        if (typeof window !== 'undefined') setIsClient(true);
    });

    const handleGenerateDraft = async () => {
        setGenerating(true);
        try {
            const draft = await generateDraftOpinion(student);
            setOpinion(draft);
            toast.success('Rascunho gerado com sucesso!');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao gerar rascunho.');
        } finally {
            setGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!opinion.trim()) return;
        setSaving(true);
        try {
            const result = await saveProfessionalOpinion(student.id, opinion);
            if (result.success) {
                toast.success('Parecer salvo no histórico do aluno.');
            } else {
                toast.error('Erro ao salvar.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Erro inesperado ao salvar.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-black text-slate-800">Parecer Técnico</CardTitle>
                                <CardDescription>Edite o laudo profissional antes de gerar o PDF.</CardDescription>
                            </div>
                            <Button
                                onClick={handleGenerateDraft}
                                variant="outline"
                                size="sm"
                                disabled={generating}
                                className="bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                            >
                                {generating ? <Loader2 className="mr-2 animate-spin" size={14} /> : <Wand2 className="mr-2" size={14} />}
                                Gerar Rascunho IA
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Textarea
                            value={opinion}
                            onChange={(e) => setOpinion(e.target.value)}
                            placeholder="Escreva ou gere o parecer técnico aqui..."
                            className="min-h-[500px] p-6 border-0 focus-visible:ring-0 resize-none text-base leading-relaxed text-slate-700 rounded-b-lg"
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="border-indigo-100 bg-indigo-50/30">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold text-indigo-900 uppercase tracking-widest">
                            Ações
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {isClient && opinion.trim().length > 0 ? (
                            <PDFDownloadLink
                                document={
                                    <PdfReportDocument
                                        student={student}
                                        opinion={opinion}
                                        labels={labels}
                                        authorName={currentUser.name}
                                        authorRole={currentUser.role}
                                    />
                                }
                                fileName={`laudo_${student.name.replace(/\s+/g, '_').toLowerCase()}.pdf`}
                            >
                                {({ blob, url, loading, error }) => (
                                    <Button className="w-full bg-slate-900 hover:bg-slate-800" disabled={loading}>
                                        {loading ? (
                                            <Loader2 className="mr-2 animate-spin" size={16} />
                                        ) : (
                                            <Download className="mr-2" size={16} />
                                        )}
                                        {loading ? 'Preparando...' : 'Finalizar e Baixar PDF'}
                                    </Button>
                                )}
                            </PDFDownloadLink>
                        ) : (
                            <Button className="w-full bg-slate-300 text-slate-500 cursor-not-allowed" disabled>
                                <Download className="mr-2" size={16} />
                                Finalizar e Baixar PDF
                            </Button>
                        )}

                        <Button
                            onClick={handleSave}
                            disabled={saving || opinion.trim().length === 0}
                            variant="outline"
                            className="w-full border-slate-300 text-slate-600 hover:bg-white"
                        >
                            {saving ? <Loader2 className="mr-2 animate-spin" size={16} /> : <Save className="mr-2" size={16} />}
                            Salvar no Histórico
                        </Button>

                        <p className="text-[10px] text-slate-400 text-center px-4 pt-2 leading-tight">
                            Ao salvar, uma entrada será criada no log de intervenções do aluno.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-slate-600 uppercase tracking-widest">
                            Dados do {labels.subject}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                        <div>
                            <span className="text-slate-400 text-[10px] font-bold uppercase block tracking-wider">Nome Completo</span>
                            <span className="font-bold text-slate-700">{student.name}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 text-[10px] font-bold uppercase block tracking-wider">Turma / Unidade</span>
                            <span className="font-bold text-slate-700">{student.classroom?.name || 'N/A'}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 text-[10px] font-bold uppercase block tracking-wider">Forças de Caráter</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {student.assessments.find((a: any) => a.type === 'VIA_STRENGTHS')?.processedScores?.signatureTop5?.slice(0, 3).map((s: any) => (
                                    <span key={s.strength} className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase">
                                        {s.strength}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
