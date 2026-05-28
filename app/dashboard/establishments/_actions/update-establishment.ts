'use server';

import { authOptions } from '@/app/_lib/auth';
import { db } from '@/app/_lib/prisma';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { EstablishmentInput } from './create-establishment';

const normalizeEmployees = (employees: EstablishmentInput['employees']) =>
  employees
    .filter(employee => employee.name.trim().length > 0)
    .map(employee => ({
      id: employee.id,
      name: employee.name.trim(),
      imageUrl: employee.imageUrl?.trim() || null
    }));

const normalizeServices = (services: EstablishmentInput['services']) =>
  services
    .filter(service => service.name.trim().length > 0)
    .map(service => ({
      id: service.id,
      name: service.name.trim(),
      description: service.description.trim(),
      price: service.price,
      imageUrl: service.imageUrl?.trim() || ''
    }));

export const updateEstablishment = async (
  id: string,
  data: EstablishmentInput
) => {
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

  const employees = normalizeEmployees(data.employees);
  const services = normalizeServices(data.services);
  const submittedEmployeeIds = employees
    .map(employee => employee.id)
    .filter((employeeId): employeeId is string => Boolean(employeeId));
  const submittedServiceIds = services
    .map(service => service.id)
    .filter((serviceId): serviceId is string => Boolean(serviceId));

  await db.$transaction(async tx => {
    await tx.establishment.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        imageUrl: data.imageUrl
      }
    });

    const removedEmployeesFilter =
      submittedEmployeeIds.length > 0
        ? {
            establishmentID: id,
            id: { notIn: submittedEmployeeIds },
            bookings: { none: {} }
          }
        : { establishmentID: id, bookings: { none: {} } };

    await tx.employee.deleteMany({ where: removedEmployeesFilter });

    for (const employee of employees) {
      if (employee.id) {
        await tx.employee.updateMany({
          where: { id: employee.id, establishmentID: id },
          data: {
            name: employee.name,
            imageUrl: employee.imageUrl
          }
        });
      } else {
        await tx.employee.create({
          data: {
            name: employee.name,
            imageUrl: employee.imageUrl,
            establishmentID: id
          }
        });
      }
    }

    const removedServicesFilter =
      submittedServiceIds.length > 0
        ? {
            establishmentID: id,
            id: { notIn: submittedServiceIds },
            bookings: { none: {} }
          }
        : { establishmentID: id, bookings: { none: {} } };

    await tx.service.deleteMany({ where: removedServicesFilter });

    for (const service of services) {
      if (service.id) {
        await tx.service.updateMany({
          where: { id: service.id, establishmentID: id },
          data: {
            name: service.name,
            description: service.description,
            price: service.price,
            imageUrl: service.imageUrl
          }
        });
      } else {
        await tx.service.create({
          data: {
            name: service.name,
            description: service.description,
            price: service.price,
            imageUrl: service.imageUrl,
            establishmentID: id
          }
        });
      }
    }
  });

  revalidatePath('/dashboard/establishments');
  revalidatePath('/');
  revalidatePath(`/establishments/${id}`);
};
