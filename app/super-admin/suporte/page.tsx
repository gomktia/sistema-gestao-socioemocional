import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';
import { LifeBuoy, HeartHandshake } from 'lucide-react';

export default async function SupportPage() {
    const user = await getCurrentUser();
    // Hardcoded for demo stability
    const adminEmail = 'geisonhoehr@gmail.com';

    if (!user || user.email !== adminEmail) {
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-6 w-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                                <HeartHandshake size={14} />
                            </div>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Atendimento</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Suporte e Chamados</h1>
                    </div>
                </div>

                <Card className="border-slate-200 shadow-xl shadow-slate-200/50 p-12 text-center">
                    <CardContent className="flex flex-col items-center justify-center space-y-4">
                        <div className="h-16 w-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-200">
                            <LifeBuoy size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">Central de Suporte em Desenvolvimento</h3>
                        <p className="text-slate-400 max-w-md">
                            Gerencie tickets, perguntas frequentes e atendimento direto aos gestores das escolas cadastradas.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
