import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getClassroomById } from '@/app/actions/classrooms';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/src/core/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus, UserMinus, Users, School } from 'lucide-react';
import Link from 'next/link';
import { getLabels } from '@/src/lib/utils/labels';
import { AddStudentToClassDialog } from '@/components/management/AddStudentToClassDialog';
import { RemoveStudentButton } from '@/components/management/RemoveStudentButton';
import { EnableIEAAButton } from '@/components/management/EnableIEAAButton';

export const metadata = {
    title: 'Gerenciar Turma | Triavium',
};

export default async function ClassroomDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const user = await getCurrentUser();
    const allowedRoles = [UserRole.MANAGER, UserRole.ADMIN];

    if (!user || !allowedRoles.includes(user.role)) {
        redirect('/');
    }

    const classroom = await getClassroomById(params.id);

    if (!classroom) {
        notFound();
    }

    type StudentInClassroom = (typeof classroom.students)[number];

    const labels = getLabels(user.organizationType);

    // Buscar alunos sem turma para poder adicionar
    const availableStudents = await prisma.student.findMany({
        where: {
            tenantId: user.tenantId,
            classroomId: null,
            isActive: true
        },
        select: { id: true, name: true, grade: true },
        orderBy: { name: 'asc' }
    });

    const displayGrade =
        classroom.grade === 'ANO_1_EM' ? (labels.organization === 'Escola' ? '1a Serie EM' : 'Nivel 1') :
            classroom.grade === 'ANO_2_EM' ? (labels.organization === 'Escola' ? '2a Serie EM' : 'Nivel 2') :
                (labels.organization === 'Escola' ? '3a Serie EM' : 'Nivel 3');

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/turmas">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100">
                            <ArrowLeft size={20} />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                <School size={20} />
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{classroom.name}</h1>
                        </div>
                        <p className="text-slate-500 text-sm ml-13">{displayGrade} - {classroom.year}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <EnableIEAAButton
                        classroomId={classroom.id}
                        classroomName={classroom.name}
                        studentCount={classroom.students.length}
                    />
                    <AddStudentToClassDialog
                        classroomId={classroom.id}
                        classroomName={classroom.name}
                        availableStudents={availableStudents}
                    />
                </div>
            </div>

            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Users size={18} className="text-slate-400" />
                        <span className="text-sm font-bold text-slate-600">
                            {classroom.students.length} {labels.subjects} nesta turma
                        </span>
                    </div>
                </div>

                {classroom.students.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                        {classroom.students.map((student: StudentInClassroom) => (
                            <div key={student.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-bold">
                                        {student.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{student.name}</p>
                                        {student.enrollmentId && (
                                            <p className="text-xs text-slate-400">Matricula: {student.enrollmentId}</p>
                                        )}
                                    </div>
                                </div>

                                <RemoveStudentButton studentId={student.id} studentName={student.name} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <CardContent className="py-16 text-center">
                        <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users size={24} className="text-slate-300" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Nenhum {labels.subject.toLowerCase()} nesta turma</h3>
                        <p className="text-sm text-slate-500 max-w-sm mx-auto">
                            Clique no botao "Adicionar {labels.subjects}" para vincular {labels.subjects.toLowerCase()} a esta turma.
                        </p>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
