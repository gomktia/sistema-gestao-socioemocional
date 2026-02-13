'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { acceptConsent } from '@/app/actions/legal';
import { toast } from 'sonner';
import { ShieldCheck, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ConsentModal({ defaultOpen = true, tenantName }: { defaultOpen?: boolean, tenantName?: string }) {
    const [open, setOpen] = useState(defaultOpen);
    const [accepted, setAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAccept = async () => {
        if (!accepted) return;
        setLoading(true);
        const res = await acceptConsent();
        if (res.success) {
            toast.success("Termos aceitos com sucesso!");
            setOpen(false);
            router.refresh();
        } else {
            toast.error("Erro ao registrar aceite.");
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-[600px] gap-0 p-0 overflow-hidden">
                <div className="bg-indigo-600 p-6 flex flex-col items-center text-center text-white">
                    <div className="bg-white/20 p-3 rounded-full mb-4">
                        <ShieldCheck size={32} />
                    </div>
                    <DialogTitle className="text-xl font-bold">Privacidade e Proteção de Dados</DialogTitle>
                    <DialogDescription className="text-indigo-100 mt-2">
                        Precisamos do seu consentimento para prosseguir, conforme a LGPD.
                    </DialogDescription>
                </div>

                <div className="p-6">
                    <div className="h-[300px] overflow-y-auto pr-4 text-sm text-slate-600 leading-relaxed border rounded-md p-4 bg-slate-50 mb-4">
                        <p className="font-bold text-slate-900 mb-2">TERMO DE CONSENTIMENTO PARA TRATAMENTO DE DADOS PESSOAIS</p>
                        <p className="mb-3">
                            Este documento visa registrar a manifestação livre, informada e inequívoca pela qual o Titular concorda com o tratamento de seus dados pessoais para finalidade específica, em conformidade com a Lei nº 13.709 – Lei Geral de Proteção de Dados Pessoais (LGPD).
                        </p>
                        <p className="mb-3">
                            Ao aceitar este termo, você consente e concorda que a instituição de ensino e esta plataforma de gestão socioemocional tomem decisões referentes ao tratamento de seus dados pessoais, bem como realizem o tratamento de tais dados, envolvendo operações como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração.
                        </p>
                        <p className="font-bold text-slate-900 mb-2">Finalidade do Tratamento</p>
                        <p className="mb-3">
                            O tratamento dos dados pessoais listados neste termo tem as seguintes finalidades:
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                                <li>Realizar avaliações socioemocionais para mapeamento de competências e identificação de riscos.</li>
                                <li>Gerar relatórios para acompanhamento pedagógico e psicológico.</li>
                                <li>Possibilitar intervenções adequadas para o desenvolvimento do aluno.</li>
                            </ul>
                        </p>
                        <p className="font-bold text-slate-900 mb-2">Segurança dos Dados</p>
                        <p className="mb-3">
                            Os controladores responsabilizam-se pela manutenção de medidas de segurança, técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados.
                        </p>
                    </div>

                    <div className="flex items-start space-x-3 mb-6 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={accepted}
                            onChange={(e) => setAccepted(e.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                        />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-relaxed text-indigo-900 cursor-pointer"
                            >
                                Entendo que meus dados serão usados para apoiar meu crescimento emocional e concordo com a política de privacidade da <span className="font-bold">{tenantName || 'minha escola'}</span>.
                            </label>
                            <p className="text-xs text-indigo-600/80 mt-1">
                                Você precisa concordar para realizar o mapeamento.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="sm:justify-between items-center">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Lock size={12} /> Seus dados estão seguros
                        </div>
                        <Button
                            onClick={handleAccept}
                            disabled={!accepted || loading}
                            className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto"
                        >
                            {loading ? "Registrando..." : "Aceitar e Continuar"}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
