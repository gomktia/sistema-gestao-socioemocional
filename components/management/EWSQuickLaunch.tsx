'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Save, Loader2 } from 'lucide-react';
import { saveSchoolIndicators } from '@/app/actions/ews';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface StudentEWS {
    id: string;
    name: string;
    grade: string;
}

interface EWSQuickLaunchProps {
    students: StudentEWS[];
}

export function EWSQuickLaunch({ students }: EWSQuickLaunchProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
    const [values, setValues] = useState<Record<string, { attendance: string; average: string; logs: string }>>({});

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (studentId: string, field: 'attendance' | 'average' | 'logs', value: string) => {
        setValues(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId] || { attendance: '', average: '', logs: '0' },
                [field]: value
            }
        }));
    };

    const handleSave = async (student: StudentEWS) => {
        const studentValues = values[student.id];
        if (!studentValues) return;

        setLoadingMap(prev => ({ ...prev, [student.id]: true }));

        const result = await saveSchoolIndicators({
            studentId: student.id,
            academicYear: new Date().getFullYear(),
            quarter: 1, // Exemplo: 1º Bimestre
            attendanceRate: parseFloat(studentValues.attendance) || 100,
            academicAverage: parseFloat(studentValues.average) || 0,
            disciplinaryLogs: parseInt(studentValues.logs) || 0,
        });

        setLoadingMap(prev => ({ ...prev, [student.id]: false }));

        if (result.success) {
            toast.success(`Indicadores de ${student.name} salvos!`);
        } else {
            toast.error('Erro ao salvar indicadores.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input
                    placeholder="Buscar aluno por nome..."
                    className="pl-10 h-11 border-slate-200 shadow-sm"
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid gap-4">
                {filteredStudents.map((student) => {
                    const sValues = values[student.id] || { attendance: '', average: '', logs: '0' };
                    const isAttendanceRisk = parseFloat(sValues.attendance) > 0 && parseFloat(sValues.attendance) < 90;

                    return (
                        <Card key={student.id} className="border-slate-200 hover:border-indigo-100 transition-colors">
                            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="min-w-[200px]">
                                    <h4 className="font-bold text-slate-800">{student.name}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {student.grade === 'ANO_1_EM' ? '1ª Série' : student.grade === 'ANO_2_EM' ? '2ª Série' : '3ª Série'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-3 flex-1 max-w-lg">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Frequência (%)</label>
                                        <Input
                                            type="number"
                                            placeholder="95"
                                            className={cn(
                                                "h-8 text-xs font-bold",
                                                isAttendanceRisk ? "border-rose-300 bg-rose-50 text-rose-700 font-black" : "border-slate-100"
                                            )}
                                            value={sValues.attendance}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(student.id, 'attendance', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Média (0-10)</label>
                                        <Input
                                            type="number"
                                            placeholder="7.5"
                                            className="h-8 text-xs font-bold border-slate-100"
                                            value={sValues.average}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(student.id, 'average', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Ocorrências</label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            className="h-8 text-xs font-bold border-slate-100"
                                            value={sValues.logs}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(student.id, 'logs', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <Button
                                    size="sm"
                                    onClick={() => handleSave(student)}
                                    disabled={loadingMap[student.id] || !sValues.attendance}
                                    className="bg-slate-900 hover:bg-indigo-600 text-[10px] font-black uppercase tracking-widest min-w-[100px]"
                                >
                                    {loadingMap[student.id] ? (
                                        <Loader2 className="animate-spin h-3 w-3" />
                                    ) : (
                                        <>
                                            <Save className="h-3 w-3 mr-2" />
                                            Lançar
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}

                {filteredStudents.length === 0 && (
                    <div className="py-20 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <Search className="mx-auto text-slate-200 mb-2" size={32} />
                        <p className="text-slate-400 text-sm font-medium">Nenhum aluno encontrado.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
