'use client';

import { useState, useCallback, useRef } from 'react';
import { saveSDQTeacherScreening } from '@/app/actions/assessment';
import { SDQ_ITEMS_BY_ID, SDQ_SUBSCALES_INFO } from '@core/content/sdq-items';
import { SDQBand, SDQSubscale } from '@core/types';
import { cn } from '@/lib/utils';
import { Loader2, Check, AlertCircle, Info } from 'lucide-react';
import type { OrganizationLabels } from '@/src/lib/utils/labels';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface Student {
    id: string;
    name: string;
}

interface StudentData {
    answers: Record<number, number>;
    band?: string;
    isSaving?: boolean;
    error?: string;
}

interface SDQGridProps {
    students: Student[];
    existingData: Record<string, StudentData>;
    labels?: OrganizationLabels;
}

const VALUE_STYLES = [
    { cell: 'bg-emerald-50 border-emerald-200 text-emerald-700', dot: 'bg-emerald-400' },
    { cell: 'bg-amber-50 border-amber-200 text-amber-700', dot: 'bg-amber-400' },
    { cell: 'bg-rose-50 border-rose-200 text-rose-700', dot: 'bg-rose-400' },
];

const BAND_STYLES: Record<string, string> = {
    [SDQBand.NORMAL]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    [SDQBand.BORDERLINE]: 'bg-amber-100 text-amber-700 border-amber-200',
    [SDQBand.ABNORMAL]: 'bg-rose-100 text-rose-700 border-rose-200',
};

const BAND_LABELS: Record<string, string> = {
    [SDQBand.NORMAL]: 'Normal',
    [SDQBand.BORDERLINE]: 'Limítrofe',
    [SDQBand.ABNORMAL]: 'Anormal',
};

// Visual separators: group items by subscale boundaries
const SUBSCALE_BORDERS = new Set<number>();
let prevSubscale: SDQSubscale | null = null;
SDQ_ITEMS_BY_ID.forEach((item, idx) => {
    if (prevSubscale && item.subscale !== prevSubscale) {
        SUBSCALE_BORDERS.add(idx);
    }
    prevSubscale = item.subscale;
});

export function SDQGrid({ students, existingData, labels }: SDQGridProps) {
    const [data, setData] = useState<Record<string, StudentData>>(existingData);
    const saveTimeout = useRef<Record<string, NodeJS.Timeout>>({});

    const handleCellClick = useCallback((studentId: string, itemNum: number) => {
        setData((prev) => {
            const studentData = prev[studentId] ?? { answers: {} };
            const current = studentData.answers[itemNum] ?? 0;
            const next = (current + 1) % 3;
            const newAnswers = { ...studentData.answers, [itemNum]: next };

            const newData = {
                ...prev,
                [studentId]: { ...studentData, answers: newAnswers, error: undefined },
            };

            if (saveTimeout.current[studentId]) clearTimeout(saveTimeout.current[studentId]);

            saveTimeout.current[studentId] = setTimeout(async () => {
                setData(d => ({ ...d, [studentId]: { ...d[studentId], isSaving: true } }));

                try {
                    const result = await saveSDQTeacherScreening(studentId, newAnswers as any);
                    if (result.success && result.scores) {
                        setData(d => ({
                            ...d,
                            [studentId]: {
                                ...d[studentId],
                                band: result.scores!.totalDifficultiesBand,
                                isSaving: false,
                            }
                        }));
                    } else if (result.success) {
                        setData(d => ({ ...d, [studentId]: { ...d[studentId], isSaving: false } }));
                    } else {
                        setData(d => ({ ...d, [studentId]: { ...d[studentId], isSaving: false, error: 'Erro ao salvar' } }));
                    }
                } catch {
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
                    <Info size={20} className="text-teal-500" />
                    <h3 className="font-black text-slate-800 tracking-tight">SDQ — Questionário de Capacidades e Dificuldades</h3>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="text-left p-6 sticky left-0 bg-white/95 backdrop-blur-sm z-10 min-w-[240px] font-extrabold text-slate-500 text-[11px] uppercase tracking-[0.1em] border-b border-slate-100">
                                Nome do {labels?.subject ?? 'Aluno'}
                            </th>
                            {SDQ_ITEMS_BY_ID.map((item, idx) => (
                                <th key={item.id} className={cn(
                                    "p-2 text-center w-14 border-b border-slate-100",
                                    SUBSCALE_BORDERS.has(idx) && "border-l-2 border-l-slate-200"
                                )}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="flex flex-col items-center gap-1.5 cursor-help group">
                                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest transition-colors group-hover:text-teal-500">Q{item.id}</span>
                                                <div className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[12px] font-black text-slate-600 shadow-sm transition-all group-hover:shadow-md group-hover:border-teal-200 group-hover:text-teal-600 group-active:scale-90">
                                                    {item.id}
                                                </div>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-[220px] p-4 rounded-2xl bg-slate-900 border-slate-800 shadow-2xl">
                                            <p className="text-[11px] font-bold text-white leading-relaxed">
                                                <span className="text-teal-400">Questão {item.id}:</span><br />
                                                {item.text}
                                            </p>
                                            <span className="block mt-2 text-[9px] text-slate-400 font-bold uppercase">
                                                {SDQ_SUBSCALES_INFO[item.subscale].label}
                                                {item.reversed && ' (invertida)'}
                                            </span>
                                        </TooltipContent>
                                    </Tooltip>
                                </th>
                            ))}
                            <th className="p-6 text-center min-w-[140px] font-extrabold text-slate-500 text-[11px] uppercase tracking-[0.1em] border-b border-slate-100">Classificação</th>
                            <th className="p-6 text-center w-16 border-b border-slate-100 font-extrabold text-slate-500 text-[11px] uppercase tracking-[0.1em]">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, rowIdx) => {
                            const studentData = data[student.id] ?? { answers: {} };
                            return (
                                <tr key={student.id} className={cn(
                                    "hover:bg-teal-50/20 transition-colors group/row",
                                    rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'
                                )}>
                                    <td className="p-5 sticky left-0 bg-white/95 backdrop-blur-sm font-bold text-slate-700 z-10 border-b border-slate-50 group-hover/row:bg-teal-50/20">
                                        <div className="truncate max-w-[200px] text-sm tracking-tight">{student.name}</div>
                                    </td>
                                    {SDQ_ITEMS_BY_ID.map((item, idx) => {
                                        const val = studentData.answers[item.id] ?? 0;
                                        const style = VALUE_STYLES[val];
                                        return (
                                            <td key={item.id} className={cn(
                                                "p-1 text-center border-b border-slate-50",
                                                SUBSCALE_BORDERS.has(idx) && "border-l-2 border-l-slate-50"
                                            )}>
                                                <button
                                                    onClick={() => handleCellClick(student.id, item.id)}
                                                    className={cn(
                                                        'w-10 h-10 rounded-xl text-[13px] font-black transition-all active:scale-90 border cursor-pointer',
                                                        style
                                                            ? `${style.cell} shadow-sm hover:shadow-md`
                                                            : 'bg-slate-50/50 border-slate-100 text-slate-300 hover:bg-slate-100 hover:border-slate-200',
                                                    )}
                                                >
                                                    {val}
                                                </button>
                                            </td>
                                        );
                                    })}
                                    <td className="p-5 text-center border-b border-slate-50">
                                        {studentData.band ? (
                                            <span className={cn(
                                                "inline-block px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide border",
                                                BAND_STYLES[studentData.band] || 'bg-slate-100 text-slate-500'
                                            )}>
                                                {BAND_LABELS[studentData.band] || studentData.band}
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl border border-dotted border-slate-200">Em Aberto</span>
                                        )}
                                    </td>
                                    <td className="p-5 text-center border-b border-slate-50">
                                        {studentData.isSaving ? (
                                            <Loader2 size={16} className="animate-spin text-teal-500 mx-auto" strokeWidth={3} />
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
                        { label: '0: Falso', style: VALUE_STYLES[0] },
                        { label: '1: Mais ou menos', style: VALUE_STYLES[1] },
                        { label: '2: Verdadeiro', style: VALUE_STYLES[2] },
                    ].map(({ label, style }) => (
                        <div key={label} className="flex items-center gap-3">
                            <div className={cn("w-5 h-5 rounded-lg border shadow-sm", style.cell)} />
                            {label}
                        </div>
                    ))}
                </div>
                <div className="text-[10px] font-medium text-slate-400 italic">
                    Referência: SDQ (Strengths and Difficulties Questionnaire)
                </div>
            </div>
        </div>
    );
}
