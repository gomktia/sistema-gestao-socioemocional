'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { BookOpen, Search } from 'lucide-react';
import { GLOSSARY_TERMS } from './glossary-data';

interface GlossaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  rti: 'Modelo RTI',
  instrument: 'Instrumento',
  domain: 'Domínio',
  system: 'Sistema',
};

const CATEGORY_COLORS: Record<string, string> = {
  rti: 'bg-violet-50 text-violet-700',
  instrument: 'bg-blue-50 text-blue-700',
  domain: 'bg-amber-50 text-amber-700',
  system: 'bg-emerald-50 text-emerald-700',
};

export function GlossaryDialog({ open, onOpenChange }: GlossaryDialogProps) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = GLOSSARY_TERMS.filter(t =>
    t.term.toLowerCase().includes(search.toLowerCase()) ||
    t.shortDef.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2 text-lg font-black">
            <BookOpen size={20} className="text-indigo-600" />
            Glossário Pedagógico
          </SheetTitle>
          <SheetDescription>
            Termos técnicos do sistema explicados de forma acessível.
          </SheetDescription>
        </SheetHeader>

        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder='Buscar: ex. "Tier 2", "Internalizante"'
            className="pl-9"
          />
        </div>

        <div className="space-y-2">
          {filtered.map(term => (
            <button
              key={term.term}
              onClick={() => setExpanded(expanded === term.term ? null : term.term)}
              className="w-full text-left p-4 rounded-2xl bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-sm text-slate-900">{term.term}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{term.shortDef}</p>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${CATEGORY_COLORS[term.category]}`}>
                  {CATEGORY_LABELS[term.category]}
                </span>
              </div>
              {expanded === term.term && (
                <p className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                  {term.longDef}
                </p>
              )}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-slate-400 py-8">Nenhum termo encontrado.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
