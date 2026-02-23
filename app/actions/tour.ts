'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function completeTour() {
  const user = await getCurrentUser();
  if (!user) return { error: 'Não autorizado.' };

  await prisma.user.update({
    where: { id: user.id },
    data: { tourCompletedAt: new Date() },
  });

  revalidatePath('/');
  return { success: true };
}

export async function resetTour() {
  const user = await getCurrentUser();
  if (!user) return { error: 'Não autorizado.' };

  await prisma.user.update({
    where: { id: user.id },
    data: { tourCompletedAt: null },
  });

  revalidatePath('/');
  return { success: true };
}
