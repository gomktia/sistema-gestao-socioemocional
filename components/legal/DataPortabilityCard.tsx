'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { exportStudentData } from '@/app/actions/lgpd-export'; // You need to implement this
import { toast } from 'sonner';
import { Download, ShieldCheck, Loader2 } from 'lucide-react';

export function DataPortabilityCard({ studentId, studentName }: { studentId: string, studentName: string }) {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        try {
            const data = await exportStudentData(studentId);

            // Create downloadable JSON file
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dados-lgpd-${studentName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success("Dados exportados com sucesso!");
        } catch (error) {
            console.error("Export error:", error);
            toast.error("Erro ao exportar dados.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="rounded-3xl border border-slate-100 shadow-sm overflow-hidden mt-8">
            <div className="bg-slate-50 p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                        <ShieldCheck className="text-emerald-600" size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 tracking-tight">Privacidade (LGPD)</h3>
                        <p className="text-xs text-slate-500">Gerencie a transparência e portabilidade dos dados.</p>
                    </div>
                </div>
            </div>
            <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <p className="text-sm text-slate-600 max-w-lg leading-relaxed">
                        Você tem o direito de solicitar uma cópia de todos os dados processados em nossa plataforma, garantindo total transparência e conformidade com a Lei Geral de Proteção de Dados.
                    </p>
                    <Button
                        onClick={handleExport}
                        disabled={loading}
                        variant="outline"
                        className="w-full sm:w-auto bg-white border-slate-200 text-slate-700 h-10 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processando...
                            </>
                        ) : (
                            <>
                                <Download className="mr-2 h-4 w-4" />
                                Baixar Dados Completos (.json)
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
