
import { validateInviteToken, registerStudentAction } from '@/app/actions/student-onboarding'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

interface OnboardingProps {
    params: { token: string }
}

export default async function OnboardingPage({ params }: OnboardingProps) {
    const { token } = params
    const validation = await validateInviteToken(token)

    if (!validation.valid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <Card className="w-full max-w-md bg-white">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-red-100 text-red-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                            ✕
                        </div>
                        <CardTitle className="text-xl text-red-700">Convite Inválido ou Expirado</CardTitle>
                        <CardDescription>
                            O link que você está tentando acessar não é válido. Entre em contato com sua escola.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    const studentName = validation.data.name
    const tenantName = validation.data.tenant.name

    async function handleRegister(formData: FormData) {
        'use server'

        const res = await registerStudentAction(formData)

        if (res.success) {
            redirect('/login?success=account_created')
        } else {
            console.error(res.error)
            // Redirect with error param (simple error handling)
            redirect(`/convite/${token}?error=${encodeURIComponent(res.error || 'Erro desconhecido')}`)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">SocioEmotional</h1>
                <p className="text-slate-500 font-medium">Plataforma de Desenvolvimento Humano</p>
            </div>

            <Card className="w-full max-w-md bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Olá, {studentName}!</CardTitle>
                    <CardDescription className="text-center">
                        Complete seu cadastro para acessar a plataforma da <strong>{tenantName}</strong>.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleRegister} className="space-y-4">
                        <input type="hidden" name="token" value={token} />

                        {!studentName && (
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input id="name" name="name" placeholder="Seu nome" required />
                            </div>
                        )}

                        {studentName && <input type="hidden" name="name" value={studentName} />}

                        <div className="space-y-2">
                            <Label htmlFor="birthDate">Data de Nascimento</Label>
                            <Input id="birthDate" name="birthDate" type="date" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Crie uma Senha</Label>
                            <Input id="password" name="password" type="password" placeholder="Mínimo 6 caracteres" minLength={6} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirme a Senha</Label>
                            <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Repita a senha" required />
                        </div>

                        <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-6 rounded-xl mt-4 border-b-4 border-slate-950 active:border-b-0 active:translate-y-1 transition-all">
                            Finalizar Cadastro
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <p className="mt-8 text-center text-xs text-slate-400">
                &copy; {new Date().getFullYear()} SocioEmotional. Todos os direitos reservados.
            </p>
        </div>
    )
}
