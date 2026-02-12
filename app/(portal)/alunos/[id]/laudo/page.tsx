import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { UserRole } from '@/src/core/types';
import { getStudentForReport } from '@/app/actions/reports';
import { getLabels } from '@/src/lib/utils/labels';
import { LaudoForm } from '@/components/reports/LaudoForm';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
    title: 'Gerar Laudo Profissional',
};

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function LaudoPage(props: PageProps) {
    const params = await props.params;
    const user = await getCurrentUser();
    const allowedRoles = [UserRole.PSYCHOLOGIST, UserRole.COUNSELOR, UserRole.MANAGER, UserRole.ADMIN];

    if (!user || !allowedRoles.includes(user.role)) {
        redirect('/');
    }

    const student = await getStudentForReport(params.id);

    if (!student) {
        notFound();
    }

    const labels = getLabels(user.organizationType);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href={`/alunos/${student.id}`}>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ChevronLeft className="h-5 w-5 text-slate-500" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                        Novo Laudo Psicopedagógico
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Gerando documento oficial para {student.name}.
                    </p>
                </div>
            </div>

            <LaudoForm
                student={student}
                labels={labels}
                currentUser={{ name: user.name, role: user.role }}
            />
        </div>
    );
}
