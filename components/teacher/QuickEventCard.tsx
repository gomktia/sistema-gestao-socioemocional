'use client';

import { useState } from 'react';
import { createBehaviorLog } from '@/app/actions/behavior';
import { BehaviorCategory } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Send, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface QuickEventCardProps {
    studentId: string;
    onSuccess?: () => void;
}

export function QuickEventCard({ studentId, onSuccess }: QuickEventCardProps) {
    const [category, setCategory] = useState<BehaviorCategory | null>(null);
    const [severity, setSeverity] = useState([1]); // 1=Baixo, 2=Médio, 3=Alto
    const [description, setDescription] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const startListening = () => {
        if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            // @ts-ignore - SpeechRecognition types are not standard yet
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = 'pt-BR';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setDescription((prev) => (prev ? prev + ' ' + transcript : transcript));
            };

            recognition.onerror = (event: any) => {
                console.error(event.error);
                setIsListening(false);
                toast.error('Erro no reconhecimento: Não foi possível capturar o áudio.');
            }

            recognition.start();
        } else {
            toast.error('Recurso indisponível: Seu navegador não suporta reconhecimento de voz.');
        }
    };

    const handleSubmit = async () => {
        if (!category) return;
        setIsSubmitting(true);
        try {
            await createBehaviorLog({
                studentId,
                category,
                severity: severity[0],
                description,
            });

            toast.success('Registro Salvo: O log comportamental foi registrado com sucesso.');

            // Reset form
            setCategory(null);
            setSeverity([1]);
            setDescription('');
            if (onSuccess) onSuccess();

        } catch (error) {
            toast.error('Erro ao salvar: Ocorreu um erro ao registrar o evento.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const categories: { key: BehaviorCategory; label: string; color: string }[] = [
        { key: 'CONFLITO', label: 'Conflito', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200' },
        { key: 'ISOLAMENTO', label: 'Isolamento', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200' },
        { key: 'TRISTEZA', label: 'Tristeza', color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200' },
        { key: 'AGRESSIVIDADE', label: 'Agressividade', color: 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200' },
        { key: 'POSITIVO', label: 'Positivo', color: 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200' },
        { key: 'OUTROS', label: 'Outros', color: 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200' },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Registro Rápido (Inteligência Nativa)
                </h3>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                {categories.map((cat) => (
                    <button
                        key={cat.key}
                        onClick={() => setCategory(cat.key)}
                        className={cn(
                            "px-3 py-2 rounded-lg text-sm font-medium transition-all border",
                            category === cat.key
                                ? "ring-2 ring-offset-1 ring-slate-400 scale-[1.02] shadow-sm"
                                : "opacity-80 hover:opacity-100",
                            cat.color
                        )}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Severity Slider */}
            <div className="mb-6 space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-600">Nível de Severidade</label>
                    <span className={cn(
                        "px-2 py-0.5 rounded textxs font-bold",
                        severity[0] === 1 ? "bg-green-100 text-green-700" :
                            severity[0] === 2 ? "bg-yellow-100 text-yellow-700" :
                                "bg-red-100 text-red-700"
                    )}>
                        {severity[0] === 1 ? 'Baixo (1)' : severity[0] === 2 ? 'Médio (2)' : 'Alto/Crise (3)'}
                    </span>
                </div>
                <Slider
                    value={severity}
                    onValueChange={setSeverity}
                    min={1}
                    max={3}
                    step={1}
                    className="cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1">
                    <span>Leve</span>
                    <span>Moderado</span>
                    <span>Crítico</span>
                </div>
            </div>

            {/* Description & Voice Input */}
            <div className="relative mb-6">
                <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva o comportamento observado (opcional)..."
                    className="min-h-[80px] pr-10 resize-none text-sm"
                />
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={startListening}
                    className={cn(
                        "absolute right-2 top-2 h-8 w-8 transition-colors",
                        isListening ? "text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600 animate-pulse" : "text-slate-400 hover:text-slate-600"
                    )}
                    title="Usar microfone"
                >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
            </div>

            <Button
                onClick={handleSubmit}
                disabled={!category || isSubmitting}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white"
            >
                {isSubmitting ? (
                    <span className="flex items-center gap-2">Salvando...</span>
                ) : (
                    <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" /> Registrar Ocorrência
                    </span>
                )}
            </Button>
        </div>
    );
}
