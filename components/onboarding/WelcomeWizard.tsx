'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
    Building2, Users, UserPlus, ChevronRight, ChevronLeft,
    Check, Loader2, Sparkles, X,
} from 'lucide-react';
import {
    updateTenantInfo,
    createFirstClassroom,
    inviteTeamMember,
    completeOnboarding,
} from '@/app/actions/onboarding';
import type { OrganizationLabels } from '@/src/lib/utils/labels';

interface WelcomeWizardProps {
    tenantName: string;
    labels: OrganizationLabels;
    onComplete: () => void;
}

const STEPS = [
    { icon: Building2, title: 'Dados da Organização', subtitle: 'Configure o perfil' },
    { icon: Users, title: 'Primeira Turma', subtitle: 'Crie sua equipe' },
    { icon: UserPlus, title: 'Convide sua Equipe', subtitle: 'Adicione um profissional' },
];

const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
};

export function WelcomeWizard({ tenantName, labels, onComplete }: WelcomeWizardProps) {
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Step 1 state
    const [orgName, setOrgName] = useState(tenantName);
    const [orgPhone, setOrgPhone] = useState('');
    const [orgEmail, setOrgEmail] = useState('');
    const [orgCity, setOrgCity] = useState('');
    const [orgState, setOrgState] = useState('');

    // Step 2 state
    const [className, setClassName] = useState('');
    const [classGrade, setClassGrade] = useState('ANO_1_EM');
    const [classShift, setClassShift] = useState('Manhã');

    // Step 3 state
    const [memberName, setMemberName] = useState('');
    const [memberEmail, setMemberEmail] = useState('');
    const [memberRole, setMemberRole] = useState('PSYCHOLOGIST');

    const goNext = () => { setDirection(1); setStep(s => Math.min(s + 1, 2)); setError(''); };
    const goBack = () => { setDirection(-1); setStep(s => Math.max(s - 1, 0)); setError(''); };

    const handleStep1 = async () => {
        if (!orgName.trim()) { setError(`Nome da ${labels.organization.toLowerCase()} é obrigatório.`); return; }
        setLoading(true);
        const result = await updateTenantInfo({
            name: orgName.trim(), phone: orgPhone, email: orgEmail, city: orgCity, state: orgState,
        });
        setLoading(false);
        if (result.error) { setError(result.error); return; }
        goNext();
    };

    const handleStep2 = async () => {
        if (!className.trim()) { setError('Nome da turma é obrigatório.'); return; }
        setLoading(true);
        const result = await createFirstClassroom({ name: className.trim(), grade: classGrade, shift: classShift });
        setLoading(false);
        if (result.error) { setError(result.error); return; }
        goNext();
    };

    const handleStep3 = async () => {
        if (!memberName.trim() || !memberEmail.trim()) { setError('Nome e email são obrigatórios.'); return; }
        setLoading(true);
        const result = await inviteTeamMember({ name: memberName.trim(), email: memberEmail.trim(), role: memberRole });
        setLoading(false);
        if (result.error) { setError(result.error); return; }
        await handleFinish();
    };

    const handleSkipAndFinish = async () => {
        setLoading(true);
        await handleFinish();
    };

    const handleFinish = async () => {
        setLoading(true);
        await completeOnboarding();
        setLoading(false);
        onComplete();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full max-w-lg"
            >
                <Card className="border-0 shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white relative">
                        <button
                            onClick={handleSkipAndFinish}
                            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles size={24} className="text-amber-300" />
                            <h2 className="text-xl font-black tracking-tight">Bem-vindo ao Sistema!</h2>
                        </div>
                        <p className="text-sm text-indigo-100">
                            Configure sua {labels.organization.toLowerCase()} em 3 passos rápidos.
                        </p>

                        {/* Step indicators */}
                        <div className="flex gap-2 mt-5">
                            {STEPS.map((s, i) => {
                                const Icon = s.icon;
                                return (
                                    <div key={i} className="flex items-center gap-2 flex-1">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                            i < step ? 'bg-emerald-400 text-emerald-900' :
                                            i === step ? 'bg-white text-indigo-700' :
                                            'bg-white/20 text-white/60'
                                        }`}>
                                            {i < step ? <Check size={14} /> : <Icon size={14} />}
                                        </div>
                                        {i < 2 && <div className={`h-0.5 flex-1 rounded ${i < step ? 'bg-emerald-400' : 'bg-white/20'}`} />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-6 min-h-[300px] relative overflow-hidden">
                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
                                {error}
                            </div>
                        )}

                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={step}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                            >
                                {step === 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                                            Dados da {labels.organization}
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">Nome *</label>
                                                <Input value={orgName} onChange={e => setOrgName(e.target.value)} placeholder={`Nome da ${labels.organization.toLowerCase()}`} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Telefone</label>
                                                    <Input value={orgPhone} onChange={e => setOrgPhone(e.target.value)} placeholder="(00) 00000-0000" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                                                    <Input value={orgEmail} onChange={e => setOrgEmail(e.target.value)} placeholder="contato@..." />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Cidade</label>
                                                    <Input value={orgCity} onChange={e => setOrgCity(e.target.value)} />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Estado</label>
                                                    <Input value={orgState} onChange={e => setOrgState(e.target.value)} maxLength={2} placeholder="SP" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 1 && (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                                            Criar Primeira Turma
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">Nome da Turma *</label>
                                                <Input value={className} onChange={e => setClassName(e.target.value)} placeholder="Ex: 1EM-A, Turma Alpha" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Série/Nível</label>
                                                    <select value={classGrade} onChange={e => setClassGrade(e.target.value)} className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm">
                                                        <option value="ANO_1_EM">1ª Série / Nível 1</option>
                                                        <option value="ANO_2_EM">2ª Série / Nível 2</option>
                                                        <option value="ANO_3_EM">3ª Série / Nível 3</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Turno</label>
                                                    <select value={classShift} onChange={e => setClassShift(e.target.value)} className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm">
                                                        <option>Manhã</option>
                                                        <option>Tarde</option>
                                                        <option>Integral</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                                            Convidar {labels.actor}
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            Adicione o primeiro profissional da equipe. Ele receberá acesso ao sistema.
                                        </p>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">Nome *</label>
                                                <Input value={memberName} onChange={e => setMemberName(e.target.value)} placeholder="Nome completo" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">Email *</label>
                                                <Input value={memberEmail} onChange={e => setMemberEmail(e.target.value)} placeholder="email@..." type="email" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase">Função</label>
                                                <select value={memberRole} onChange={e => setMemberRole(e.target.value)} className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm">
                                                    <option value="PSYCHOLOGIST">Psicólogo(a)</option>
                                                    <option value="COUNSELOR">Orientador(a)</option>
                                                    <option value="TEACHER">{labels.actor}</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </CardContent>

                    {/* Footer */}
                    <div className="px-6 pb-6 flex justify-between items-center">
                        <Button
                            variant="ghost"
                            onClick={step === 0 ? handleSkipAndFinish : goBack}
                            disabled={loading}
                            className="text-xs font-bold text-slate-400"
                        >
                            {step === 0 ? (
                                'Pular configuração'
                            ) : (
                                <><ChevronLeft size={14} className="mr-1" /> Voltar</>
                            )}
                        </Button>

                        <Button
                            onClick={step === 0 ? handleStep1 : step === 1 ? handleStep2 : handleStep3}
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 font-bold"
                        >
                            {loading && <Loader2 size={14} className="mr-2 animate-spin" />}
                            {step < 2 ? (
                                <>Próximo <ChevronRight size={14} className="ml-1" /></>
                            ) : (
                                <>Concluir <Check size={14} className="ml-1" /></>
                            )}
                        </Button>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
