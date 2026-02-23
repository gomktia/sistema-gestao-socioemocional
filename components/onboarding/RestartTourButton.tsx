'use client';

import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { resetTour } from '@/app/actions/tour';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function RestartTourButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleReset = async () => {
    setPending(true);
    await resetTour();
    toast.success('Tour reiniciado! Redirecionando...');
    router.push('/inicio');
  };

  return (
    <Button
      variant="outline"
      onClick={handleReset}
      disabled={pending}
      className="rounded-2xl font-bold text-slate-600 gap-2"
    >
      <RotateCcw size={14} />
      {pending ? 'Reiniciando...' : 'Reiniciar Tour Guiado'}
    </Button>
  );
}
