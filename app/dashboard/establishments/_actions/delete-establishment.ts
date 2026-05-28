'use server';

import { authOptions } from '@/app/_lib/auth';
import { db } from '@/app/_lib/prisma';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

export const deleteEstablishment = async (id: string) => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error('Não autorizado');
  }

  const ownerId = (session.user as { id: string }).id;

  const establishment = await db.establishment.findFirst({
    where: { id, ownerId }
  });

  if (!establishment) {
    throw new Error('Estabelecimento não encontrado');
  }

  await db.$transaction([
    db.booking.deleteMany({ where: { establishmentId: id } }),
    db.employee.deleteMany({ where: { establishmentID: id } }),
    db.service.deleteMany({ where: { establishmentID: id } }),
    db.establishment.delete({ where: { id } })
  ]);

  revalidatePath('/dashboard/establishments');
  revalidatePath('/');
};
