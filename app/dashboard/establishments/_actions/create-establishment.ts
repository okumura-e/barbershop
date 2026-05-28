'use server';

import { authOptions } from '@/app/_lib/auth';
import { db } from '@/app/_lib/prisma';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

export interface ServiceInput {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export interface EmployeeInput {
  id?: string;
  name: string;
  imageUrl?: string;
}

export interface EstablishmentInput {
  name: string;
  address: string;
  imageUrl: string;
  employees: EmployeeInput[];
  services: ServiceInput[];
}

export const createEstablishment = async (data: EstablishmentInput) => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error('Não autorizado');
  }

  const employees = data.employees
    .filter(employee => employee.name.trim().length > 0)
    .map(employee => ({
      name: employee.name.trim(),
      imageUrl: employee.imageUrl?.trim() || null
    }));

  const services = data.services
    .filter(service => service.name.trim().length > 0)
    .map(service => ({
      name: service.name.trim(),
      description: service.description.trim(),
      price: service.price,
      imageUrl: service.imageUrl?.trim() || ''
    }));

  const establishment = await db.establishment.create({
    data: {
      name: data.name,
      address: data.address,
      imageUrl: data.imageUrl,
      ownerId: (session.user as { id: string }).id,
      employees: {
        create: employees
      },
      services: {
        create: services
      }
    }
  });

  revalidatePath('/dashboard/establishments');
  revalidatePath('/');
  revalidatePath('/establishments');

  return establishment;
};
