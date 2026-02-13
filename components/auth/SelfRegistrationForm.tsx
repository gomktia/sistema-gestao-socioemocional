'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { selfRegisterStudent } from '@/app/actions/self-registration';
import { toast } from 'sonner';
import { Loader2, ArrowRight } from 'lucide-react';

const GRADES = [
    { value: 'ANO_1_EM', label: '1º Ano do Ensino Médio' },
    { value: 'ANO_2_EM', label: '2º Ano do Ensino Médio' },
    { value: 'ANO_3_EM', label: '3º Ano do Ensino Médio' },
];

export function SelfRegistrationForm({ tenantId }: { tenantId: string }) {
    const [loading, setLoading] = useState(false);
    const [cpfValue, setCpfValue] = useState('');
    const router = useRouter();

    const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        // Simple mask logic for 000.000.000-00
        if (value.length > 9) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
        } else if (value.length > 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
        } else if (value.length > 3) {
            value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
        }

        setCpfValue(value);
    };

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        formData.append('tenantId', tenantId);

        // The FormData will capture the formatted value from the input.
        // The server action already cleans the CPF, so it's safe to send formatted.

        try {
            const result = await selfRegisterStudent(formData);
            if (result.success) {
                toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
                router.push('/login');
            } else {
                toast.error(result.error || 'Erro ao realizar cadastro.');
                setLoading(false);
            }
        } catch (error) {
            toast.error('Ocorreu um erro inesperado.');
            setLoading(false);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" name="name" required placeholder="Seu nome completo" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="cpf">CPF (Somente números)</Label>
                    <Input
                        id="cpf"
                        name="cpf"
                        required
                        placeholder="000.000.000-00"
                        value={cpfValue}
                        onChange={handleCPFChange}
                        maxLength={14}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Input id="birthDate" name="birthDate" type="date" required />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="grade">Série / Ano</Label>
                <select
                    id="grade"
                    name="grade"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="" disabled selected>Selecione sua série</option>
                    {GRADES.map(g => (
                        <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="seu@email.com" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input id="password" name="password" type="password" required minLength={6} placeholder="******" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={6} placeholder="******" />
                </div>
            </div>

            <Button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 h-12 text-sm font-bold uppercase tracking-widest" disabled={loading}>
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando conta...
                    </>
                ) : (
                    <>
                        Criar Conta <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                )}
            </Button>

            <div className="text-center mt-4">
                <a href="/login" className="text-xs text-indigo-600 font-bold hover:underline">
                    Já tenho uma conta
                </a>
            </div>
        </form>
    );
}
