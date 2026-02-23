'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { GlossaryDialog } from './GlossaryDialog';

export function GlossaryButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir Glossário Pedagógico"
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 flex items-center justify-center transition-all active:scale-95"
      >
        <HelpCircle size={22} strokeWidth={2} />
      </button>
      <GlossaryDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
