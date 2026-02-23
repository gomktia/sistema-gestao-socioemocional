'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { sendGuardianInvite } from '@/app/actions/guardian-invite';
import { toast } from 'sonner';
import { UserPlus, Copy, Check, Loader2 } from 'lucide-react';

interface InviteGuardianDialogProps {
    studentId: string;
    studentName: string;
    guardianEmail?: string;
}

const RELATIONSHIP_OPTIONS = [
    { value: 'MAE', label: 'Mãe' },
    { value: 'PAI', label: 'Pai' },
    { value: 'AVO_A', label: 'Avô/Avó' },
    { value: 'TIO_A', label: 'Tio/Tia' },
    { value: 'OUTRO', label: 'Outro' },
];

export function InviteGuardianDialog({
    studentId,
    studentName,
    guardianEmail,
}: InviteGuardianDialogProps) {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState(guardianEmail || '');
    const [relationship, setRelationship] = useState('');
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [isPending, startTransition] = useTransition();

    const resetState = () => {
        setEmail(guardianEmail || '');
        setRelationship('');
        setInviteLink(null);
        setCopied(false);
    };

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (!nextOpen) {
            resetState();
        }
    };

    const handleSubmit = () => {
        if (!email.trim() || !relationship) return;

        startTransition(async () => {
            try {
                const result = await sendGuardianInvite({
                    email: email.trim(),
                    relationship,
                    studentId,
                });

                if (!result.success) {
                    toast.error(result.error || 'Erro ao enviar convite.');
                    return;
                }

                if (result.alreadyHadAccount) {
                    toast.success('Responsável vinculado com sucesso! A conta já existia.');
                    setOpen(false);
                    resetState();
                    return;
                }

                if (result.inviteLink) {
                    setInviteLink(result.inviteLink);
                    if (result.emailSent) {
                        toast.success('Convite enviado por e-mail com sucesso!');
                    } else {
                        toast.info('Convite criado. Compartilhe o link abaixo com o responsável.');
                    }
                }
            } catch {
                toast.error('Erro inesperado ao enviar convite.');
            }
        });
    };

    const handleCopyLink = async () => {
        if (!inviteLink) return;
        try {
            await navigator.clipboard.writeText(inviteLink);
            setCopied(true);
            toast.success('Link copiado!');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('Erro ao copiar link.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
                >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Convidar Responsável
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Convidar Responsável</DialogTitle>
                    <DialogDescription>
                        Envie um convite para o responsável de {studentName} acessar o Portal da Família.
                    </DialogDescription>
                </DialogHeader>

                {!inviteLink ? (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="guardian-email">E-mail do responsável</Label>
                            <Input
                                id="guardian-email"
                                type="email"
                                placeholder="responsavel@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isPending}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="guardian-relationship">Parentesco</Label>
                            <Select
                                value={relationship}
                                onValueChange={setRelationship}
                                disabled={isPending}
                            >
                                <SelectTrigger id="guardian-relationship">
                                    <SelectValue placeholder="Selecione o parentesco" />
                                </SelectTrigger>
                                <SelectContent>
                                    {RELATIONSHIP_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            onClick={handleSubmit}
                            disabled={isPending || !email.trim() || !relationship}
                            className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <UserPlus className="h-4 w-4 mr-2" />
                            )}
                            {isPending ? 'Enviando...' : 'Enviar Convite'}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
                            <p className="text-sm text-emerald-800 font-medium mb-2">
                                Link do convite:
                            </p>
                            <div className="flex items-center gap-2">
                                <Input
                                    value={inviteLink}
                                    readOnly
                                    className="text-xs bg-white"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleCopyLink}
                                    className="shrink-0 border-emerald-200 hover:bg-emerald-50"
                                >
                                    {copied ? (
                                        <Check className="h-4 w-4 text-emerald-600" />
                                    ) : (
                                        <Copy className="h-4 w-4 text-emerald-600" />
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs text-emerald-600 mt-2">
                                Este link é válido por 7 dias.
                            </p>
                        </div>

                        <Button
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            className="w-full"
                        >
                            Fechar
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
