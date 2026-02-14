import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/src/core/types';
import { SRSSGrid } from '@/components/teacher/SRSSGrid';
import { getLabels } from '@/src/lib/utils/labels';
import { ClipboardCheck, Lightbulb, HelpCircle, Info } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

export const metadata = {
    title: 'Lançar Triagem | Inteligência Socioemocional',
};

export default async function TriagemPage() {
    const user = await getCurrentUser();

    const allowedRoles = [UserRole.TEACHER, UserRole.PSYCHOLOGIST, UserRole.COUNSELOR, UserRole.MANAGER, UserRole.ADMIN];
    if (!user || !allowedRoles.includes(user.role)) {
        redirect('/');
    }

    const students = await prisma.student.findMany({
        where: { tenantId: user.tenantId, isActive: true },
        select: { id: true, name: true, grade: true },
        orderBy: { name: 'asc' },
    });

    const assessments = await prisma.assessment.findMany({
        where: {
            tenantId: user.tenantId,
            type: 'SRSS_IE',
            academicYear: new Date().getFullYear(),
        },
        select: { studentId: true, rawAnswers: true, overallTier: true },
    });

    const existingData: Record<string, any> = {};
    assessments.forEach(a => {
        existingData[a.studentId] = {
            answers: a.rawAnswers,
            tier: a.overallTier
        };
    });

    const labels = getLabels(user.organizationType);

    // SECURITY: Segmented Assessment Logic
    // We determine the level based on the students being listed. 
    // In a future update, this will be filtered by Class selection.
    const hasMedio = students.some(s => s.grade.includes('EM'))

    // Buscar perguntas para Tooltips e Modal de acordo com o nível
    const srssQuestions = await prisma.formQuestion.findMany({
        where: {
            type: 'SRSS_IE',
            isActive: true,
            educationalLevel: hasMedio ? 'HIGH_SCHOOL' : 'ELEMENTARY', // Fallback logic
            OR: [{ tenantId: user.tenantId }, { tenantId: null }]
        },
        orderBy: [{ order: 'asc' }, { number: 'asc' }]
    });

    return (
        <div className="space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                        <ClipboardCheck size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lançar Triagem</h1>

                            <Sheet>
                                <SheetTrigger asChild>
                                    <button className="p-1 rounded-full text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 transition-all active:scale-90" title="Consultar Protocolo">
                                        <HelpCircle size={22} strokeWidth={2.5} />
                                    </button>
                                </SheetTrigger>
                                <SheetContent className="w-[400px] sm:w-[540px] rounded-l-3xl p-8 border-l-0 shadow-2xl">
                                    <SheetHeader className="mb-8">
                                        <SheetTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                                            <Info className="text-indigo-500" />
                                            Instrumento SRSS-IE
                                        </SheetTitle>
                                        <SheetDescription className="font-medium text-slate-500">
                                            Referência completa das perguntas para consulta pedagógica.
                                        </SheetDescription>
                                    </SheetHeader>

                                    <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                                        <div className="space-y-6">
                                            {srssQuestions.map((q) => (
                                                <div key={q.id} className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 group hover:bg-white hover:shadow-md transition-all duration-300">
                                                    <div className="flex items-start gap-4">
                                                        <div className="h-8 w-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-indigo-600 shrink-0 shadow-sm group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-colors">
                                                            {q.number}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-800 leading-tight group-hover:text-indigo-950">{q.text}</p>
                                                            {q.category && (
                                                                <span className="inline-block mt-2 px-2 py-0.5 rounded-lg bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-100">
                                                                    {q.category}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </SheetContent>
                            </Sheet>
                        </div>
                        <p className="text-slate-500 mt-0.5 text-sm">Identificação preventiva de riscos comportamentais e socioemocionais.</p>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-50/30 rounded-3xl p-6 flex items-start gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="h-10 w-10 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                    <Lightbulb size={20} className="text-amber-600" strokeWidth={1.5} />
                </div>
                <div>
                    <h4 className="font-extrabold text-amber-900 text-sm tracking-tight">Como funciona</h4>
                    <p className="text-amber-700 text-xs mt-1 leading-relaxed">
                        Clique nas células para atribuir valores (0-3) a cada item do instrumento SRSS.
                        O cálculo do Risco (Tier) é atualizado automaticamente assim que o instrumento é concluído para cada {labels?.subjects?.toLowerCase() ?? 'aluno'}.
                    </p>
                </div>
            </div>

            <SRSSGrid
                students={students}
                existingData={existingData}
                labels={labels}
                questions={srssQuestions}
            />
        </div>
    );
}
