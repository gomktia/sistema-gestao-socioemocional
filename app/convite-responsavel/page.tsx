import { validateGuardianToken, registerGuardian } from '@/app/actions/guardian-invite';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { redirect } from 'next/navigation';
import { Heart } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function GuardianInvitePage(props: Props) {
  const searchParams = await props.searchParams;
  const token = searchParams.token;

  if (!token) {
    return <InvalidInvite message="Link inv\u00e1lido. Nenhum token encontrado." />;
  }

  const validation = await validateGuardianToken(token);

  if (!validation.valid || !validation.data) {
    return <InvalidInvite message={validation.error || 'Convite inv\u00e1lido ou expirado.'} />;
  }

  const { studentName, tenantName, email } = validation.data;

  async function handleRegister(formData: FormData) {
    'use server';
    const result = await registerGuardian(formData);
    if (result.success) {
      redirect('/login?success=guardian_created');
    } else {
      redirect(`/convite-responsavel?token=${token}&error=${encodeURIComponent(result.error || 'Erro')}`);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">{tenantName}</h1>
        <p className="text-slate-500 font-medium">Portal da Fam\u00edlia</p>
      </div>

      <Card className="w-full max-w-md bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500"></div>
        <CardHeader>
          <div className="mx-auto bg-emerald-100 text-emerald-600 rounded-full w-12 h-12 flex items-center justify-center mb-2">
            <Heart size={24} />
          </div>
          <CardTitle className="text-2xl text-center">Bem-vindo(a)!</CardTitle>
          <CardDescription className="text-center">
            Crie sua conta para acompanhar o desenvolvimento de <strong>{studentName}</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleRegister} className="space-y-4">
            <input type="hidden" name="token" value={token} />

            <div className="space-y-2">
              <Label htmlFor="name">Seu Nome Completo</Label>
              <Input id="name" name="name" placeholder="Seu nome" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" defaultValue={email} placeholder="seu@email.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Crie uma Senha</Label>
              <Input id="password" name="password" type="password" placeholder="M\u00ednimo 6 caracteres" minLength={6} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirme a Senha</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Repita a senha" required />
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 rounded-xl mt-4">
              Criar Minha Conta
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-8 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} Triavium Educa\u00e7\u00e3o e Desenvolvimento LTDA
      </p>
    </div>
  );
}

function InvalidInvite({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="text-center">
          <div className="mx-auto bg-red-100 text-red-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            &#10005;
          </div>
          <CardTitle className="text-xl text-red-700">Convite Inv\u00e1lido</CardTitle>
          <CardDescription>{message} Entre em contato com a escola.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
