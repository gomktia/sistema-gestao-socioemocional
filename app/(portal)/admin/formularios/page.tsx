import { getQuestions } from '@/app/actions/form-questions'
import { FormQuestionsManager } from '@/components/admin/FormQuestionsManager'
import { Metadata } from 'next'
import { getCurrentUser } from '@/lib/auth'

export const metadata: Metadata = {
    title: 'Gestão de Formulários',
    description: 'Gerencie as perguntas dos formulários VIA e SRSS-IE.',
}

export default async function FormQuestionsPage() {
    const questions = await getQuestions()
    const user = await getCurrentUser()
    const canEdit = user?.role === 'ADMIN'

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col gap-4 mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Gestão de Formulários</h1>
                <p className="text-muted-foreground">
                    Visualize e organize as perguntas dos questionários de avaliação socioemocional.
                    {!canEdit && " (Modo Somente Leitura)"}
                </p>
            </div>

            <FormQuestionsManager initialQuestions={questions} canEdit={canEdit} />
        </div>
    )
}
