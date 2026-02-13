"use server"

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function exportStudentData(studentId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Não autorizado");

    // Verificar permissão
    // Estudante só pode exportar seus próprios dados
    if (user.role === UserRole.STUDENT && user.studentId !== studentId) {
        throw new Error("Acesso negado. Você só pode exportar seus próprios dados.");
    }
    // ADMIN, MANAGER, PSYCHOLOGIST, COUNSELOR podem exportar de alunos do mesmo tenant
    if (['ADMIN', 'MANAGER', 'PSYCHOLOGIST', 'COUNSELOR'].includes(user.role)) {
        // Verificar tenant
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            select: { tenantId: true }
        });
        if (!student || student.tenantId !== user.tenantId) {
            throw new Error("Aluno não encontrado ou sem permissão.");
        }
    }

    // Busca completa dos dados vinculados ao CPF/ID do aluno
    const data = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
            assessments: {
                select: {
                    type: true,
                    overallTier: true,
                    appliedAt: true,
                    createdAt: true,
                    processedScores: true
                }
            },
            userAccount: {
                select: {
                    email: true,
                    cpf: true,
                    createdAt: true
                }
            },
            tenant: {
                select: {
                    name: true
                }
            }
        }
    });

    if (!data) throw new Error("Dados não encontrados");

    // Formata o pacote de dados conforme exigido pela portabilidade da LGPD
    const exportPackage = {
        metadata: {
            generatedAt: new Date().toISOString(),
            version: "1.0",
            platform: "Sistema de Gestão Socioemocional - Everest",
            organization: data.tenant?.name
        },
        profile: {
            name: data.name,
            cpf: data.userAccount?.cpf || data.cpf,
            email: data.userAccount?.email,
            birthDate: data.birthDate,
            organizationId: data.tenantId,
            grade: data.grade
        },
        consent: {
            acceptedAt: data.consentAcceptedAt,
            status: data.consentAcceptedAt ? "ACCEPTED" : "PENDING"
        },
        history: data.assessments.map(a => ({
            date: a.appliedAt,
            type: a.type,
            tier: a.overallTier,
            summary: JSON.stringify(a.processedScores) // Serialize basic score summary
        }))
    };

    return exportPackage;
}
