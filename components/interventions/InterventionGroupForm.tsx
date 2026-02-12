'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Search, Users2, Loader2 } from 'lucide-react';
import {
    createInterventionGroup,
    updateInterventionGroup,
} from '@/app/actions/interventions';
import type { OrganizationLabels } from '@/src/lib/utils/labels';

const INTERVENTION_TYPES = [
    { value: 'SOCIAL_SKILLS_GROUP', label: 'Habilidades Sociais' },
    { value: 'EMOTION_REGULATION', label: 'Regulação Emocional' },
    { value: 'CAREER_GUIDANCE', label: 'Orientação Vocacional' },
    { value: 'PEER_MENTORING', label: 'Mentoria entre Pares' },
    { value: 'STUDY_SKILLS', label: 'Habilidades de Estudo' },
    { value: 'CHECK_IN_CHECK_OUT', label: 'Check-in / Check-out' },
    { value: 'FAMILY_MEETING', label: 'Reunião Familiar' },
] as const;

interface StudentOption {
    id: string;
    name: string;
    classroom: { name: string } | null;
}

interface InterventionGroupFormProps {
    students: StudentOption[];
    labels: OrganizationLabels;
    editingGroup?: {
        id: string;
        name: string;
        type: string;
        description: string | null;
        students: { id: string; name: string }[];
    };
    onClose: () => void;
}

export function InterventionGroupForm({ students, labels, editingGroup, onClose }: InterventionGroupFormProps) {
    const [name, setName] = useState(editingGroup?.name || '');
    const [type, setType] = useState(editingGroup?.type || 'SOCIAL_SKILLS_GROUP');
    const [description, setDescription] = useState(editingGroup?.description || '');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(
        new Set(editingGroup?.students.map(s => s.id) || [])
    );
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const filteredStudents = useMemo(() => {
        if (!search.trim()) return students;
        const q = search.toLowerCase();
        return students.filter(
            s => s.name.toLowerCase().includes(q) ||
                s.classroom?.name.toLowerCase().includes(q)
        );
    }, [students, search]);

    const toggleStudent = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) { setError('Nome do grupo é obrigatório.'); return; }
        if (selectedIds.size === 0) { setError(`Selecione pelo menos um ${labels.subject.toLowerCase()}.`); return; }

        setLoading(true);
        try {
            const ids = Array.from(selectedIds);
            let result;
            if (editingGroup) {
                result = await updateInterventionGroup(editingGroup.id, {
                    name: name.trim(),
                    type,
                    description: description.trim(),
                    studentIds: ids,
                });
            } else {
                result = await createInterventionGroup(name.trim(), type, ids, description.trim());
            }

            if (result && 'error' in result) {
                setError(result.error as string);
            } else {
                onClose();
            }
        } catch {
            setError('Erro inesperado. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const selectedStudents = students.filter(s => selectedIds.has(s.id));

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Nome do Grupo *
                </label>
                <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={`Ex: Oficina de Regulação Emocional - T1`}
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Tipo de Intervenção *
                </label>
                <select
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                >
                    {INTERVENTION_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Descrição
                </label>
                <Textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Objetivos e atividades planejadas..."
                    rows={2}
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                    <Users2 size={14} />
                    {labels.subjects} no Grupo * ({selectedIds.size} selecionados)
                </label>

                {selectedStudents.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {selectedStudents.map(s => (
                            <Badge
                                key={s.id}
                                variant="secondary"
                                className="gap-1 cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors"
                                onClick={() => toggleStudent(s.id)}
                            >
                                {s.name}
                                <X size={12} />
                            </Badge>
                        ))}
                    </div>
                )}

                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder={`Buscar ${labels.subject.toLowerCase()} por nome ou turma...`}
                        className="pl-8"
                    />
                </div>

                <div className="max-h-48 overflow-y-auto border rounded-lg divide-y">
                    {filteredStudents.length === 0 && (
                        <p className="text-sm text-slate-400 text-center py-4">
                            Nenhum {labels.subject.toLowerCase()} encontrado.
                        </p>
                    )}
                    {filteredStudents.map(s => (
                        <label
                            key={s.id}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm"
                        >
                            <input
                                type="checkbox"
                                checked={selectedIds.has(s.id)}
                                onChange={() => toggleStudent(s.id)}
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="font-medium text-slate-700 truncate">{s.name}</span>
                            {s.classroom && (
                                <span className="text-[10px] text-slate-400 font-bold uppercase ml-auto shrink-0">
                                    {s.classroom.name}
                                </span>
                            )}
                        </label>
                    ))}
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                    disabled={loading}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    disabled={loading}
                >
                    {loading && <Loader2 size={16} className="mr-2 animate-spin" />}
                    {editingGroup ? 'Salvar Alterações' : 'Criar Grupo'}
                </Button>
            </div>
        </form>
    );
}
