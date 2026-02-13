'use client';

import { useState, useCallback, useRef } from 'react';
import { TierBadge } from '@/components/domain/TierBadge';
import { saveSRSSScreening } from '@/app/actions/assessment';
import { SRSS_ITEMS } from '@/src/core/logic/scoring';
import { cn } from '@/lib/utils';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import type { OrganizationLabels } from '@/src/lib/utils/labels';

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
    labels?: OrganizationLabels;
}

const VALUE_STYLES = [
    { cell: 'bg-emerald-50 border-emerald-200 text-emerald-700', dot: 'bg-emerald-400' },
    { cell: 'bg-amber-50 border-amber-200 text-amber-700', dot: 'bg-amber-400' },
    { cell: 'bg-orange-50 border-orange-200 text-orange-700', dot: 'bg-orange-400' },
    { cell: 'bg-rose-50 border-rose-200 text-rose-700', dot: 'bg-rose-400' },
];

export function SRSSGrid({ students, existingData, labels }: SRSSGridProps) {
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
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80">
                            <th className="text-left p-5 sticky left-0 bg-slate-50/95 backdrop-blur-sm z-10 min-w-[200px] font-extrabold text-slate-600 text-xs uppercase tracking-widest border-b border-slate-100">
                                Nome do {labels?.subject ?? 'Aluno'}
                            </th>
                            {ALL_ITEMS.map((item, idx) => (
                                <th key={item.item} className={cn(
                                    "p-2 text-center w-12 group relative border-b border-slate-100",
                                    idx === 6 && "border-l-2 border-l-slate-200"
                                )}>
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Q{item.item}</span>
                                        <div className="h-7 w-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">
                                            {item.item}
                                        </div>
                                    </div>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 w-52 p-3 bg-slate-900 text-white text-[10px] rounded-2xl shadow-2xl leading-relaxed font-medium">
                                        {item.label}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-slate-900 rotate-45" />
                                    </div>
                                </th>
                            ))}
                            <th className="p-5 text-center min-w-[120px] font-extrabold text-slate-600 text-xs uppercase tracking-widest border-b border-slate-100">Rastreio RTI</th>
                            <th className="p-5 text-center w-12 border-b border-slate-100">
                                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Status</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, rowIdx) => {
                            const studentData = data[student.id] ?? { answers: {} };
                            return (
                                <tr key={student.id} className={cn(
                                    "hover:bg-indigo-50/30 transition-colors group/row",
                                    rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                                )}>
                                    <td className="p-4 sticky left-0 bg-white/95 backdrop-blur-sm font-semibold text-slate-700 z-10 border-b border-slate-50 group-hover/row:bg-indigo-50/30">
                                        <div className="truncate max-w-[180px] text-sm">{student.name}</div>
                                    </td>
                                    {ALL_ITEMS.map((item, idx) => {
                                        const val = studentData.answers[item.item];
                                        const style = val !== undefined ? VALUE_STYLES[val] : null;
                                        return (
                                            <td key={item.item} className={cn(
                                                "p-1 text-center border-b border-slate-50",
                                                idx === 6 && "border-l-2 border-l-slate-100"
                                            )}>
                                                <button
                                                    onClick={() => handleCellClick(student.id, item.item)}
                                                    className={cn(
                                                        'w-9 h-9 rounded-xl text-sm font-black transition-all active:scale-90 border cursor-pointer',
                                                        style
                                                            ? `${style.cell} hover:shadow-md`
                                                            : 'bg-slate-50 border-slate-100 text-slate-300 hover:bg-slate-100 hover:border-slate-200',
                                                    )}
                                                >
                                                    {val ?? '-'}
                                                </button>
                                            </td>
                                        );
                                    })}
                                    <td className="p-4 text-center border-b border-slate-50">
                                        {studentData.tier ? (
                                            <TierBadge tier={studentData.tier} showLabel={false} className="px-3" />
                                        ) : (
                                            <span className="text-[10px] text-slate-300 font-extrabold uppercase tracking-widest">Incompleto</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center border-b border-slate-50">
                                        {studentData.isSaving ? (
                                            <Loader2 size={16} className="animate-spin text-indigo-500 mx-auto" />
                                        ) : studentData.error ? (
                                            <div className="flex items-center justify-center" title={studentData.error}>
                                                <AlertCircle size={16} className="text-rose-500" strokeWidth={1.5} />
                                            </div>
                                        ) : (
                                            <Check size={16} className="text-emerald-400 mx-auto opacity-40" strokeWidth={2} />
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="bg-slate-50/50 p-5 border-t border-slate-100">
                <div className="flex flex-wrap gap-5 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                    {[
                        { label: '0: Nunca', style: VALUE_STYLES[0] },
                        { label: '1: Ocasionalmente', style: VALUE_STYLES[1] },
                        { label: '2: Frequentemente', style: VALUE_STYLES[2] },
                        { label: '3: Muito Frequentemente', style: VALUE_STYLES[3] },
                    ].map(({ label, style }) => (
                        <div key={label} className="flex items-center gap-2">
                            <div className={cn("w-4 h-4 rounded-lg border", style.cell)} />
                            {label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
