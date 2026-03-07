import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/src/core/types';
import { FamilySocioemotionalWizardLazy } from '@/components/family-socioemotional/FamilySocioemotionalWizardLazy';

export const metadata = {
    title: 'Percepção Familiar | Portal do Responsável',
};

interface PageProps {
    searchParams: Promise<{ filho?: string }>;
}

export default async function PercepcaoFamiliarPage({ searchParams }: PageProps) {
    const user = await getCurrentUser();

    if (!user || user.role !== UserRole.RESPONSIBLE) {
        redirect('/');
    }

    const params = await searchParams;

    // Fetch linked children and resolve selected child
    const guardianLinks = await prisma.studentGuardian.findMany({
        where: { guardianId: user.id, tenantId: user.tenantId },
        include: {
            student: {
                select: { id: true, name: true },
            },
        },
    });

    if (guardianLinks.length === 0) {
        redirect('/responsavel');
    }

    const selectedLink = params.filho
        ? guardianLinks.find(l => l.student.id === params.filho) ?? guardianLinks[0]
        : guardianLinks[0];
    const student = selectedLink.student;

    // Check for existing assessment (partial or complete)
    const existing = await prisma.assessment.findFirst({
        where: {
            studentId: student.id,
            type: 'FAMILY_SOCIOEMOTIONAL',
            screeningTeacherId: null,
        },
        orderBy: { appliedAt: 'desc' },
        select: { rawAnswers: true, processedScores: true },
    });

    // If already complete, redirect to results
    if (existing?.processedScores) {
        redirect(`/responsavel`);
    }

    const initialAnswers = (existing?.rawAnswers as Record<number, number>) || {};

    return (
        <FamilySocioemotionalWizardLazy
            initialAnswers={initialAnswers}
            studentId={student.id}
            studentName={student.name}
        />
    );
}
