
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, MessageCircleHeart, Mic, Send, ShieldCheck } from 'lucide-react';
import { sendStudentMessage } from '@/app/actions/minha-voz';

export function MinhaVozWidget({ studentName }: { studentName: string }) {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            toast.error('Seu navegador não suporta reconhecimento de voz.');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'pt-BR';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
            toast.info('Escutando... Pode falar.');
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setMessage((prev) => prev ? `${prev} ${transcript}` : transcript);
        };

        recognition.onerror = (event: any) => {
            console.error(event.error);
            toast.error('Erro no reconhecimento de voz.');
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsSending(true);
        try {
            // @ts-ignore
            const result = await sendStudentMessage(message);

            if (result.success) {
                toast.success('Sua mensagem foi enviada para a equipe de psicologia.');
                setMessage('');
            } else {
                toast.error(result.error || 'Erro ao enviar.');
            }
        } catch (error) {
            toast.error('Erro de conexão.');
        }
        setIsSending(false);
    };

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1120] to-[#1e293b] p-6 sm:p-8 text-white shadow-[0_20px_60px_rgba(15,23,42,0.3)] border border-slate-800">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 order-1 lg:order-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-900/20">
                            <MessageCircleHeart className="text-white" size={20} />
                        </div>
                        <span className="text-rose-400 font-black uppercase tracking-widest text-xs">Canal Seguro</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
                        Olá, {studentName.split(' ')[0]}. <br />
                        <span className="text-slate-400">Como você está se sentindo hoje?</span>
                    </h2>

                    <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm">
                        O Canal <strong className="text-white">Minha Voz</strong> é seu espaço de escuta.
                        Compartilhe suas angústias, medos ou conquistas diretamente com a psicologia escolar.
                    </p>

                    <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-emerald-400 bg-emerald-950/30 px-3 py-1.5 rounded-full w-fit border border-emerald-900/50">
                        <ShieldCheck size={12} />
                        <span className="uppercase tracking-wide">Sigilo Ético & Proteção LGPD Garantidos</span>
                    </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl p-1 border border-white/10 shadow-inner order-2 lg:order-2">
                    <form onSubmit={handleSubmit} className="relative">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Digite sua mensagem aqui (ou use o microfone)..."
                            className="w-full h-40 sm:h-32 bg-transparent text-white placeholder:text-slate-500 p-4 text-sm font-medium resize-none focus:outline-none focus:bg-slate-900/50 transition-colors rounded-t-xl"
                        />

                        <div className="flex items-center justify-between px-3 pb-3 pt-2 border-t border-white/5 bg-slate-900/30 rounded-b-xl gap-3">
                            <button
                                type="button"
                                onClick={startListening}
                                className={`p-3 rounded-xl transition-all active:scale-95 flex items-center justify-center ${isListening
                                        ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/50 shadow-lg'
                                        : 'text-slate-400 hover:text-white hover:bg-white/10'
                                    }`}
                                title="Gravar Áudio (Speech-to-Text)"
                            >
                                <Mic size={22} strokeWidth={isListening ? 2.5 : 2} />
                            </button>

                            <button
                                type="submit"
                                disabled={!message.trim() || isSending}
                                className="flex-1 bg-white hover:bg-slate-200 text-slate-900 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                            >
                                {isSending ? <Loader2 className="animate-spin" size={16} /> : (
                                    <>
                                        Enviar Mensagem
                                        <Send size={16} strokeWidth={2.5} className="ml-1" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
