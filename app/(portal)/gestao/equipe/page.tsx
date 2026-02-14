import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { prisma } from '@/lib/prisma';
import { UserPlus, UserX, Mail, Search, ShieldCheck, Crown } from 'lucide-react';
import { getLabels } from '@/src/lib/utils/labels';

export const metadata = {
    title: 'Equipe | Gestão',
};

export default async function EquipePage() {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'MANAGER' && currentUser.role !== 'ADMIN')) {
        redirect('/');
    }

    const labels = getLabels(currentUser.organizationType);

    const teamMembers = await prisma.user.findMany({
        where: {
            tenantId: currentUser.tenantId,
            // SECURITY: SuperAdmins (ADMIN) are hidden from Tenant panels to prevent accidental deletion 
            // and maintain clear hierarchy, unless the user viewing is also a SuperAdmin.
            role: {
                in: currentUser.role === 'ADMIN'
                    ? ['MANAGER', 'ADMIN', 'PSYCHOLOGIST', 'COUNSELOR', 'TEACHER']
                    : ['MANAGER', 'PSYCHOLOGIST', 'COUNSELOR', 'TEACHER']
            }
        },
        orderBy: { createdAt: 'desc' },
    });

    const roleColors: Record<string, string> = {
        'ADMIN': 'bg-rose-50 text-rose-700',
        'MANAGER': 'bg-indigo-50 text-indigo-700',
        'PSYCHOLOGIST': 'bg-violet-50 text-violet-700',
        'COUNSELOR': 'bg-amber-50 text-amber-700',
        'TEACHER': 'bg-emerald-50 text-emerald-700',
    };

    const roleNames: Record<string, string> = {
        'ADMIN': 'Administrador',
        'MANAGER': 'Gestor',
        'PSYCHOLOGIST': 'Psicólogo',
        'COUNSELOR': 'Orientador',
        'TEACHER': labels.actor,
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Equipe Pedagógica</h1>
                    <p className="text-slate-500 mt-1.5 text-sm">Gerencie os acessos e permissões dos colaboradores.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200 active:scale-95 transition-all rounded-2xl">
                    <UserPlus size={18} strokeWidth={1.5} className="mr-2" /> Convidar Membro
                </Button>
            </div>

            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/30 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} strokeWidth={1.5} />
                        <Input
                            placeholder="Buscar por nome ou email..."
                            className="pl-11 h-11 bg-white border-slate-200 rounded-2xl focus:ring-indigo-500/20"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/20">
                                <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pl-6">Nome</th>
                                <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Email</th>
                                <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Função</th>
                                <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right pr-6">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {teamMembers.map((member) => (
                                <tr key={member.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-extrabold border-2 border-white shadow-sm">
                                                {member.name ? member.name.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <div>
                                                <p className="font-extrabold text-slate-900 tracking-tight">{member.name || 'Sem nome'}</p>
                                                {member.id === currentUser.id && (
                                                    <span className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full font-bold">Você</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                                            <Mail size={14} className="text-slate-400" strokeWidth={1.5} />
                                            {member.email}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest inline-flex items-center gap-1.5 ${roleColors[member.role] || 'bg-slate-50 text-slate-600'}`}>
                                            {member.role === 'ADMIN' && <Crown size={10} strokeWidth={1.5} />}
                                            {member.role === 'MANAGER' && <ShieldCheck size={10} strokeWidth={1.5} />}
                                            {roleNames[member.role] || member.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right pr-6">
                                        {member.id !== currentUser.id && (
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors active:scale-95" title="Remover acesso">
                                                <UserX size={16} strokeWidth={1.5} />
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
