import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2 } from 'lucide-react';
import Link from 'next/link';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function SchoolAccessPage({ params }: { params: { slug: string } }) {
    const slug = params.slug;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Link href="/super-admin">
                <Button variant="ghost" className="pl-0 text-slate-500 hover:text-slate-900">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar ao Painel Global
                </Button>
            </Link>

            <Card className="border-indigo-100 bg-indigo-50/30">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black text-slate-900">
                                Acesso Administrativo: {slug.toUpperCase()}
                            </CardTitle>
                            <p className="text-sm text-slate-500">
                                Visualização de dados específicos do tenant
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="p-4 border border-dashed border-slate-300 rounded-lg bg-slate-50 text-center">
                        <p className="text-sm font-medium text-slate-500">
                            O módulo de "Impersonation" (acesso como gestor da escola) está em desenvolvimento.
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                            Em breve você poderá visualizar o dashboard desta escola como se fosse o diretor local.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
