import { getClassrooms } from '@/app/actions/classrooms';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, School, ArrowRight, Calendar, Layers } from 'lucide-react';
import Link from 'next/link';
import { getLabels } from '@/src/lib/utils/labels';

export default async function TurmasPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    const classrooms = await getClassrooms();
    const labels = getLabels(user.organizationType);

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestão de Turmas</h1>
                    <p className="text-slate-500 mt-1">Gerencie as unidades de ensino e organize seus {labels.subjects.toLowerCase()}.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 px-6 font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-all">
                    <Plus className="mr-2 h-5 w-5" />
                    Nova Turma
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classrooms.length > 0 ? (
                    classrooms.map((cls) => (
                        <Card key={cls.id} className="group overflow-hidden rounded-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:ring-1 hover:ring-indigo-500/10 transition-all duration-500 bg-white">
                            <CardContent className="p-0">
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                                            <School size={24} strokeWidth={1.5} />
                                        </div>
                                        <span className="text-[10px] font-black bg-slate-50 text-slate-400 px-3 py-1.5 rounded-full uppercase tracking-widest group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                            {cls.year}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-black text-slate-900 mb-2 truncate group-hover:text-indigo-600 transition-colors">
                                        {cls.name}
                                    </h3>

                                    <div className="space-y-3 mt-6">
                                        <div className="flex items-center gap-3 text-slate-500">
                                            <Users size={16} className="text-slate-400" />
                                            <span className="text-sm font-bold">{cls._count.students} {labels.subjects}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-500">
                                            <Layers size={16} className="text-slate-400" />
                                            <span className="text-sm font-bold">{cls.grade.replace('_', ' ')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-50 p-4 bg-slate-50/50 flex items-center justify-between">
                                    <Link
                                        href={`/turmas/${cls.id}`}
                                        className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 flex items-center gap-2 group/link"
                                    >
                                        Gerenciar Alunos
                                        <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link
                                        href={`/turma?classroomId=${cls.id}`}
                                        className="text-[10px] font-black bg-white text-slate-900 px-3 py-2 rounded-xl shadow-sm border border-slate-100 hover:bg-slate-900 hover:text-white transition-all"
                                    >
                                        VER MAPA DE RISCO
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="col-span-full py-20 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 flex flex-col items-center justify-center text-center px-6">
                        <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-sm mb-6">
                            <School size={40} strokeWidth={1} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 mb-2">Nenhuma turma criada</h2>
                        <p className="text-slate-500 max-w-sm">
                            Comece organizando seus {labels.subjects.toLowerCase()} em turmas para facilitar o acompanhamento e triagem.
                        </p>
                        <Button className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 px-8 font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-all">
                            Criar primeira turma agora
                        </Button>
                    </Card>
                )}
            </div>
        </div>
    );
}
