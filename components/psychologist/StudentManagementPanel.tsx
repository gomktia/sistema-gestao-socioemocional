
'use client'

import { useState } from 'react'
import { toggleFormAccess, resetAssessment, updateStudentCredentials, generateOnboardingLink } from '@/app/actions/student-management'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KeyIcon, LinkIcon, RefreshCw, Smartphone, ShieldCheck, Mail, Lock, Clock, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

interface StudentManagementPanelProps {
    studentId: string
    initialIsFormEnabled: boolean
    studentName: string
    hasAccount: boolean
}

export function StudentManagementPanel({ studentId, initialIsFormEnabled, studentName, hasAccount }: StudentManagementPanelProps) {
    const [isFormEnabled, setIsFormEnabled] = useState(initialIsFormEnabled)
    const [loading, setLoading] = useState(false)
    const [inviteLink, setInviteLink] = useState('')

    // Reset Credentials State
    const [newEmail, setNewEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [credentialDialogOpen, setCredentialDialogOpen] = useState(false)

    // Toggle Form Access
    const handleToggleAccess = async (checked: boolean, duration?: number) => {
        setIsFormEnabled(checked)
        setLoading(true)
        try {
            await toggleFormAccess(studentId, checked, duration)
            if (checked && duration) {
                toast.success(`Acesso liberado por ${duration}h`)
            } else {
                toast.success(checked ? 'Acesso liberado permanentemente' : 'Acesso bloqueado')
            }
        } catch (error) {
            if (!duration) setIsFormEnabled(!checked) // Revert only if toggle
            toast.error('Erro ao alterar acesso')
        } finally {
            setLoading(false)
        }
    }

    // Reset Assessment
    const handleReset = async (type: 'VIA_STRENGTHS' | 'SRSS_IE') => {
        if (!confirm(`Tem certeza que deseja apagar TODAS as respostas do tipo ${type === 'VIA_STRENGTHS' ? 'VIA' : 'SRSS'} deste aluno? Isso não pode ser desfeito.`)) return

        setLoading(true)
        try {
            await resetAssessment(studentId, type)
            toast.success('Respostas resetadas com sucesso')
        } catch (error) {
            toast.error('Erro ao resetar respostas')
        } finally {
            setLoading(false)
        }
    }

    // Generate Link
    const handleGenerateLink = async () => {
        setLoading(true)
        try {
            // Note: In real implementation, need to fetch the actual URL from action
            // The action I wrote returns { success: true, url: ... }
            // Let's call it.
            // Wait, generateOnboardingLink is not exported yet? Or maybe I used a different function name in previous step?
            // "generateOnboardingLink" was the name.

            // However, the action returns an object. I need to parse it.
            // Oh, since this is a client component, I need to call the server action.
            const result = await generateOnboardingLink(studentId) as any
            if (result.success && result.url) {
                setInviteLink(result.url)
                navigator.clipboard.writeText(result.url)
                toast.success('Link copiado para a área de transferência!')
            } else {
                toast.error('Erro ao gerar link')
            }
        } catch (error) {
            toast.error('Erro ao gerar link')
        } finally {
            setLoading(false)
        }
    }

    // Update Credentials
    const handleUpdateCredentials = async () => {
        setLoading(true)
        try {
            const res = await updateStudentCredentials(studentId, newEmail || undefined, newPassword || undefined) as any
            if (res.success) {
                toast.success('Credenciais atualizadas')
                setCredentialDialogOpen(false)
                setNewEmail('')
                setNewPassword('')
            } else {
                toast.error('Erro: ' + res.error)
            }
        } catch (error) {
            toast.error('Erro ao atualizar credenciais')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full bg-slate-50 border-slate-200 mb-6">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-brand-600" />
                    Painel de Controle do Psicólogo
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="access" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger value="access">Acesso & Formulários</TabsTrigger>
                        <TabsTrigger value="credentials" disabled={!hasAccount}>Credenciais</TabsTrigger>
                        <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
                    </TabsList>

                    {/* ACESSO & FORMULÁRIOS */}
                    <TabsContent value="access" className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
                            <div className="space-y-0.5">
                                <Label className="text-base font-semibold">Liberar Formulários</Label>
                                <p className="text-sm text-muted-foreground">
                                    Permite que o aluno responda aos questionários pendentes.
                                </p>
                            </div>
                            <Switch checked={isFormEnabled} onCheckedChange={(c: boolean) => handleToggleAccess(c)} disabled={loading} />
                        </div>

                        <Button
                            variant="outline"
                            className="w-full justify-between items-center bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 h-12"
                            onClick={() => handleToggleAccess(true, 24)}
                            disabled={loading}
                        >
                            <span className="flex items-center gap-2 font-bold">
                                <Clock className="w-4 h-4" />
                                Liberar Acesso Temporário (24h)
                            </span>
                            <ArrowRight className="w-4 h-4 opacity-50" />
                        </Button>

                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200" onClick={() => handleReset('VIA_STRENGTHS')} disabled={loading}>
                                <RefreshCw className="h-4 w-4" />
                                <span className="text-xs font-bold">Resetar VIA</span>
                            </Button>
                            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200" onClick={() => handleReset('SRSS_IE')} disabled={loading}>
                                <RefreshCw className="h-4 w-4" />
                                <span className="text-xs font-bold">Resetar SRSS-IE</span>
                            </Button>
                        </div>
                    </TabsContent>

                    {/* CREDENCIAIS */}
                    <TabsContent value="credentials" className="space-y-4">
                        <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm space-y-4">
                            <div className="space-y-2">
                                <Label>Alterar E-mail</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="novo-email@exemplo.com"
                                        className="pl-9"
                                        type="email"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Alterar Senha</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Nova senha segura"
                                        className="pl-9"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button className="w-full bg-slate-900 text-white hover:bg-slate-800" onClick={handleUpdateCredentials} disabled={loading || (!newEmail && !newPassword)}>
                                {loading ? 'Atualizando...' : 'Salvar Alterações'}
                            </Button>
                        </div>
                    </TabsContent>

                    {/* ONBOARDING */}
                    <TabsContent value="onboarding" className="space-y-4">
                        <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm text-center space-y-4">
                            <div className="bg-brand-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Smartphone className="h-6 w-6 text-brand-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Convite via WhatsApp</h4>
                                <p className="text-sm text-slate-500 mt-1">
                                    Gere um link único para que o aluno complete seu cadastro e acesse a plataforma.
                                </p>
                            </div>

                            {!inviteLink ? (
                                <Button onClick={handleGenerateLink} disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white">
                                    <LinkIcon className="mr-2 h-4 w-4" /> Gerar Link de Acesso
                                </Button>
                            ) : (
                                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                                    <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Link Gerado</Label>
                                    <div className="flex items-center gap-2">
                                        <Input readOnly value={inviteLink} className="bg-slate-50 font-mono text-xs" />
                                        <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(inviteLink); toast.success('Copiado!'); }}>
                                            <LinkIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="text-xs text-emerald-600 font-medium">Link copiado! Envie para o aluno.</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
