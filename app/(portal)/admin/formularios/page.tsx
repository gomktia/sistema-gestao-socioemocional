
import { getQuestions } from '@/app/actions/form-questions'
import { FormQuestionsManager } from '@/components/admin/FormQuestionsManager'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Gestão de Formulários',
    description: 'Gerencie as perguntas dos formulários VIA e SRSS-IE.',
}

export default async function FormQuestionsPage() {
    const questions = await getQuestions()

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col gap-4 mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Gestão de Formulários</h1>
                <p className="text-muted-foreground">
                    Crie, edite e organize as perguntas dos questionários de avaliação socioemocional.
                </p>
            </div>

            <FormQuestionsManager initialQuestions={questions} />
        </div>
    )
}
