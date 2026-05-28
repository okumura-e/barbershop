'use server';

import { db } from '@/app/_lib/prisma';
import { revalidatePath } from 'next/cache';

interface SaveBookingParams {
  establishmentId: string;
  serviceId: string;
  userId: string;
  date: Date;
  employeeId: string;
}

export const saveBooking = async (params: SaveBookingParams) => {
  await db.booking.create({
    data: {
      serviceId: params.serviceId,
      userId: params.userId,
      date: params.date,
      establishmentId: params.establishmentId,
      status: 'CONFIRMED',
      employeeId: params.employeeId
    }
  });

  revalidatePath('/');
  revalidatePath('/bookings');
};