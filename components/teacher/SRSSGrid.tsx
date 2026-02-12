'use client';

import { useState, useCallback, useRef } from 'react';
import { TierBadge } from '@/components/domain/TierBadge';
import { saveSRSSScreening } from '@/app/actions/assessment';
import { SRSS_ITEMS } from '@/src/core/logic/scoring';
import { cn } from '@/lib/utils';
import { Loader2, Check, AlertCircle } from 'lucide-react';

const ALL_ITEMS = [...SRSS_ITEMS.externalizing, ...SRSS_ITEMS.internalizing];

interface Student {
    id: string;
    name: string;
}

interface StudentData {
    answers: Record<number, number>;
    tier?: string;
    isSaving?: boolean;
    error?: string;
}

interface SRSSGridProps {
    students: Student[];
    existingData: Record<string, StudentData>;
}

export function SRSSGrid({ students, existingData }: SRSSGridProps) {
    const [data, setData] = useState<Record<string, StudentData>>(existingData);
    const saveTimeout = useRef<Record<string, NodeJS.Timeout>>({});

    const handleCellClick = useCallback((studentId: string, itemNum: number) => {
        setData((prev) => {
            const studentData = prev[studentId] ?? { answers: {} };
            const current = studentData.answers[itemNum];
            const next = current === undefined ? 0 : (current + 1) % 4;
            const newAnswers = { ...studentData.answers, [itemNum]: next };

            const newData = {
                ...prev,
                [studentId]: { ...studentData, answers: newAnswers, error: undefined },
            };

            // Auto-save quando mudar
            if (saveTimeout.current[studentId]) clearTimeout(saveTimeout.current[studentId]);

            saveTimeout.current[studentId] = setTimeout(async () => {
                setData(d => ({ ...d, [studentId]: { ...d[studentId], isSaving: true } }));

                try {
                    const result = await saveSRSSScreening(studentId, newAnswers as any);
                    if (result.success && result.risk) {
                        setData(d => ({
                            ...d,
                            [studentId]: {
                                ...d[studentId],
                                tier: result.risk.externalizing.tier, // Exemplo: usando tier do externalizante
                                isSaving: false
                            }
                        }));
                    } else {
                        setData(d => ({ ...d, [studentId]: { ...d[studentId], isSaving: false, error: 'Erro ao salvar' } }));
                    }
                } catch (e) {
                    setData(d => ({ ...d, [studentId]: { ...d[studentId], isSaving: false, error: 'Erro de rede' } }));
                }
            }, 1000); // 1s de debounce

            return newData;
        });
    }, []);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left p-4 sticky left-0 bg-slate-50 z-10 min-w-[200px] font-bold text-slate-600">
                                Nome do Aluno
                            </th>
                            {ALL_ITEMS.map((item) => (
                                <th key={item.item} className="p-2 text-center w-12 group relative">
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] text-slate-400 font-bold mb-1">Q{item.item}</span>
                                        <div className="h-6 w-6 rounded bg-white border border-slate-200 flex items-center justify-center text-[10px] text-slate-400">
                                            {item.item}
                                        </div>
                                    </div>
                                    {/* Tooltip simplificado */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg shadow-xl">
                                        {item.label}
                                    </div>
                                </th>
                            ))}
                            <th className="p-4 text-center min-w-[120px] font-bold text-slate-600">Rastreio RTI</th>
                            <th className="p-4 text-center w-12">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {students.map((student) => {
                            const studentData = data[student.id] ?? { answers: {} };
                            return (
                                <tr key={student.id} className="hover:bg-indigo-50/30 transition-colors">
                                    <td className="p-4 sticky left-0 bg-white/95 backdrop-blur-sm font-semibold text-slate-700 z-10">
                                        <div className="truncate max-w-[180px]">{student.name}</div>
                                    </td>
                                    {ALL_ITEMS.map((item) => {
                                        const val = studentData.answers[item.item];
                                        return (
                                            <td key={item.item} className="p-1 text-center">
                                                <button
                                                    onClick={() => handleCellClick(student.id, item.item)}
                                                    className={cn(
                                                        'w-9 h-9 rounded-lg text-sm font-black transition-all transform active:scale-95 border-2',
                                                        val === undefined && 'bg-slate-50 border-slate-100 text-slate-300',
                                                        val === 0 && 'bg-emerald-50 border-emerald-100 text-emerald-600',
                                                        val === 1 && 'bg-amber-50 border-amber-100 text-amber-600',
                                                        val === 2 && 'bg-orange-50 border-orange-100 text-orange-600',
                                                        val === 3 && 'bg-rose-50 border-rose-100 text-rose-600',
                                                    )}
                                                >
                                                    {val ?? '·'}
                                                </button>
                                            </td>
                                        );
                                    })}
                                    <td className="p-4 text-center">
                                        {studentData.tier ? (
                                            <TierBadge tier={studentData.tier} showLabel={false} className="px-3" />
                                        ) : (
                                            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Incompleto</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        {studentData.isSaving ? (
                                            <Loader2 size={16} className="animate-spin text-indigo-500 mx-auto" />
                                        ) : studentData.error ? (
                                            <AlertCircle size={16} className="text-rose-500 mx-auto" />
                                        ) : (
                                            <Check size={16} className="text-emerald-500 mx-auto opacity-30" />
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200">
                <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-50 border border-emerald-100" /> 0: Nunca</div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-amber-50 border border-amber-100" /> 1: Ocasionalmente</div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-orange-50 border border-orange-100" /> 2: Frequentemente</div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-rose-50 border border-rose-100" /> 3: Muito Frequentemente</div>
                </div>
            </div>
        </div>
    );
}
