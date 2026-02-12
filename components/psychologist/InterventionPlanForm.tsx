'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Save, X, Lightbulb } from 'lucide-react';
import { saveInterventionPlan } from '@/app/actions/ews';
import { toast } from 'sonner';

interface InterventionPlanFormProps {
    studentId: string;
    signatureStrengths: any[];
    gradeAlerts: any[];
    onSuccess: () => void;
    onCancel: () => void;
}

export function InterventionPlanForm({
    studentId,
    signatureStrengths,
    gradeAlerts,
    onSuccess,
    onCancel
}: InterventionPlanFormProps) {
    const [loading, setLoading] = useState(false);
    const [strategicActions, setStrategicActions] = useState('');
    const [expectedOutcome, setExpectedOutcome] = useState('');

    // Sugestão automática baseada em forças e riscos
    const generateSuggestion = () => {
        const topStrength = signatureStrengths[0]?.label || 'suas forças';
        const majorRisk = gradeAlerts[0]?.itemLabel || 'as dificuldades detectadas';

        const suggestion = `Aproveitar a força de ${topStrength} do aluno para que ele possa liderar pequenas tarefas em grupo, ajudando a mitigar o comportamento de ${majorRisk}. Estabelecer feedback diário focado no uso desta força.`;
        setStrategicActions(suggestion);
    };

    const handleSave = async () => {
        if (!strategicActions) return;
        setLoading(true);

        const result = await saveInterventionPlan({
            studentId,
            targetRisks: gradeAlerts.map(a => a.itemLabel),
            leverageStrengths: signatureStrengths.slice(0, 2).map(s => s.label),
            strategicActions,
            expectedOutcome,
            reviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
        });

        setLoading(false);
        if (result.success) {
            toast.success('PEI salvo com sucesso!');
            onSuccess();
        } else {
            toast.error('Erro ao salvar PEI');
        }
    };

    return (
        <Card className="border-indigo-100 bg-indigo-50/10 animate-in zoom-in-95 duration-200">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-black text-indigo-700 uppercase tracking-widest flex items-center justify-between">
                    <span>Novo Plano de Intervenção (PEI)</span>
                    <Button variant="ghost" size="icon" onClick={onCancel} className="h-6 w-6">
                        <X size={14} />
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <Lightbulb size={12} />
                            Sugestão Baseada em Forças
                        </h4>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-[9px] font-black uppercase tracking-tighter text-indigo-600 border-indigo-200"
                            onClick={generateSuggestion}
                        >
                            Gerar Sugestão
                        </Button>
                    </div>
                    <p className="text-[11px] text-slate-500 italic leading-relaxed">
                        Clique em "Gerar Sugestão" para criar um esboço baseado na força "{signatureStrengths[0]?.label}" do aluno.
                    </p>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ações Estratégicas</label>
                    <Textarea
                        placeholder="Descreva o que será feito..."
                        className="text-sm min-h-[100px] border-slate-200"
                        value={strategicActions}
                        onChange={(e) => setStrategicActions(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resultado Esperado</label>
                    <Textarea
                        placeholder="O que esperamos alcançar em 30 dias?"
                        className="text-sm border-slate-200"
                        value={expectedOutcome}
                        onChange={(e) => setExpectedOutcome(e.target.value)}
                    />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" size="sm" onClick={onCancel} className="text-xs uppercase font-bold text-slate-400">
                        Cancelar
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-xs uppercase font-black">
                        <Save size={14} className="mr-2" />
                        Salvar Plano
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
