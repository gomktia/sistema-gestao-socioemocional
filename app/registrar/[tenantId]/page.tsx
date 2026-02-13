import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { SelfRegistrationForm } from '@/components/auth/SelfRegistrationForm';
import { BrainCircuit } from 'lucide-react';

export default async function SelfRegistrationPage({ params }: { params: { tenantId: string } }) {
    const tenant = await prisma.tenant.findUnique({
        where: { id: params.tenantId },
        select: { name: true, logoUrl: true }
    });

    if (!tenant) {
        notFound();
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/40 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-200/40 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
                    <div className="p-8 sm:p-10">
                        {/* Header */}
                        <div className="mb-8 text-center">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-100 mb-6">
                                {tenant.logoUrl ? (
                                    <img src={tenant.logoUrl} alt={tenant.name} className="h-10 w-10 object-contain brightness-0 invert" />
                                ) : (
                                    <BrainCircuit size={32} />
                                )}
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Crie sua Conta</h1>
                            <p className="text-sm text-slate-500 mt-2 font-medium">
                                Cadastro de Aluno - {tenant.name}
                            </p>
                        </div>

                        <SelfRegistrationForm tenantId={params.tenantId} />

                    </div>
                    <div className="bg-slate-50/50 p-6 text-center border-t border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            © 2026 GomkTia Intelligence Systems
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
