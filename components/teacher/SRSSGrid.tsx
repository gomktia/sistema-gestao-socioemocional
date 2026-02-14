'use client';

import { useState, useCallback, useRef } from 'react';
import { TierBadge } from '@/components/domain/TierBadge';
import { saveSRSSScreening } from '@/app/actions/assessment';
import { SRSS_ITEMS } from '@core/logic/scoring';
import { cn } from '@/lib/utils';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import type { OrganizationLabels } from '@/src/lib/utils/labels';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from 'lucide-react';

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

interface FormQuestion {
    number: number;
    text: string;
    category?: string | null;
}

interface SRSSGridProps {
    students: Student[];
    existingData: Record<string, StudentData>;
    labels?: OrganizationLabels;
    questions?: FormQuestion[];
}

const VALUE_STYLES = [
    { cell: 'bg-emerald-50 border-emerald-200 text-emerald-700', dot: 'bg-emerald-400' },
    { cell: 'bg-amber-50 border-amber-200 text-amber-700', dot: 'bg-amber-400' },
    { cell: 'bg-orange-50 border-orange-200 text-orange-700', dot: 'bg-orange-400' },
    { cell: 'bg-rose-50 border-rose-200 text-rose-700', dot: 'bg-rose-400' },
];

export function SRSSGrid({ students, existingData, labels, questions }: SRSSGridProps) {
    const [data, setData] = useState<Record<string, StudentData>>(existingData);
    const saveTimeout = useRef<Record<string, NodeJS.Timeout>>({});

    const getQuestionText = (num: number) => {
        return questions?.find(q => q.number === num)?.text ||
            ALL_ITEMS.find(i => i.item === num)?.label ||
            `Questão ${num}`;
    };

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
                                tier: result.risk.externalizing.tier,
                                isSaving: false
                            }
                        }));
                    } else {
                        setData(d => ({ ...d, [studentId]: { ...d[studentId], isSaving: false, error: 'Erro ao salvar' } }));
                    }
                } catch (e) {
                    setData(d => ({ ...d, [studentId]: { ...d[studentId], isSaving: false, error: 'Erro de rede' } }));
                }
            }, 1000);

            return newData;
        });
    }, []);

    return (
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between p-6 border-b border-slate-50">
                <div className="flex items-center gap-3">
                    <Info size={20} className="text-indigo-500" />
                    <h3 className="font-black text-slate-800 tracking-tight">Instrumento de Rastreio</h3>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="text-left p-6 sticky left-0 bg-white/95 backdrop-blur-sm z-10 min-w-[240px] font-extrabold text-slate-500 text-[11px] uppercase tracking-[0.1em] border-b border-slate-100">
                                Nome do {labels?.subject ?? 'Aluno'}
                            </th>
                            {ALL_ITEMS.map((item, idx) => (
                                <th key={item.item} className={cn(
                                    "p-2 text-center w-14 border-b border-slate-100",
                                    idx === 6 && "border-r-2 border-r-slate-100"
                                )}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="flex flex-col items-center gap-1.5 cursor-help group">
                                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest transition-colors group-hover:text-indigo-500">Q{item.item}</span>
                                                <div className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[12px] font-black text-slate-600 shadow-sm transition-all group-hover:shadow-md group-hover:border-indigo-200 group-hover:text-indigo-600 group-active:scale-90">
                                                    {item.item}
                                                </div>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-[220px] p-4 rounded-2xl bg-slate-900 border-slate-800 shadow-2xl">
                                            <p className="text-[11px] font-bold text-white leading-relaxed">
                                                <span className="text-indigo-400">Questão {item.item}:</span><br />
                                                {getQuestionText(item.item)}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </th>
                            ))}
                            <th className="p-6 text-center min-w-[140px] font-extrabold text-slate-500 text-[11px] uppercase tracking-[0.1em] border-b border-slate-100">Rastreio RTI</th>
                            <th className="p-6 text-center w-16 border-b border-slate-100 font-extrabold text-slate-500 text-[11px] uppercase tracking-[0.1em]">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, rowIdx) => {
                            const studentData = data[student.id] ?? { answers: {} };
                            return (
                                <tr key={student.id} className={cn(
                                    "hover:bg-indigo-50/20 transition-colors group/row",
                                    rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'
                                )}>
                                    <td className="p-5 sticky left-0 bg-white/95 backdrop-blur-sm font-bold text-slate-700 z-10 border-b border-slate-50 group-hover/row:bg-indigo-50/20">
                                        <div className="truncate max-w-[200px] text-sm tracking-tight">{student.name}</div>
                                    </td>
                                    {ALL_ITEMS.map((item, idx) => {
                                        const val = studentData.answers[item.item];
                                        const style = val !== undefined ? VALUE_STYLES[val] : null;
                                        return (
                                            <td key={item.item} className={cn(
                                                "p-1 text-center border-b border-slate-50",
                                                idx === 6 && "border-r-2 border-r-slate-50"
                                            )}>
                                                <button
                                                    onClick={() => handleCellClick(student.id, item.item)}
                                                    className={cn(
                                                        'w-10 h-10 rounded-xl text-[13px] font-black transition-all active:scale-90 border cursor-pointer',
                                                        style
                                                            ? `${style.cell} shadow-sm hover:shadow-md`
                                                            : 'bg-slate-50/50 border-slate-100 text-slate-300 hover:bg-slate-100 hover:border-slate-200',
                                                    )}
                                                >
                                                    {val ?? '-'}
                                                </button>
                                            </td>
                                        );
                                    })}
                                    <td className="p-5 text-center border-b border-slate-50">
                                        {studentData.tier ? (
                                            <TierBadge tier={studentData.tier} showLabel={false} className="px-4 py-1.5 rounded-xl text-[10px] font-black" />
                                        ) : (
                                            <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl border border-dotted border-slate-200">Em Aberto</span>
                                        )}
                                    </td>
                                    <td className="p-5 text-center border-b border-slate-50">
                                        {studentData.isSaving ? (
                                            <Loader2 size={16} className="animate-spin text-indigo-500 mx-auto" strokeWidth={3} />
                                        ) : studentData.error ? (
                                            <div className="flex items-center justify-center" title={studentData.error}>
                                                <AlertCircle size={18} className="text-rose-500" strokeWidth={2} />
                                            </div>
                                        ) : (
                                            <Check size={18} className="text-emerald-500 mx-auto opacity-40 group-hover/row:opacity-100 transition-opacity" strokeWidth={2.5} />
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="bg-slate-50/50 p-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-wrap gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
                    {[
                        { label: '0: Nunca', style: VALUE_STYLES[0] },
                        { label: '1: Ocasionalmente', style: VALUE_STYLES[1] },
                        { label: '2: Frequentemente', style: VALUE_STYLES[2] },
                        { label: '3: Muito Frequentemente', style: VALUE_STYLES[3] },
                    ].map(({ label, style }) => (
                        <div key={label} className="flex items-center gap-3">
                            <div className={cn("w-5 h-5 rounded-lg border shadow-sm", style.cell)} />
                            {label}
                        </div>
                    ))}
                </div>
                <div className="text-[10px] font-medium text-slate-400 italic">
                    Referência: Protocolo SRSS (Student Risk Screening Scale)
                </div>
            </div>
        </div>
    );
}
