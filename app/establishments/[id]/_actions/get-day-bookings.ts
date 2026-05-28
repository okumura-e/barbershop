'use server';

import { db } from '@/app/_lib/prisma';
import { endOfDay, startOfDay } from 'date-fns';

export const getDayBookings = async (establishmentId: string, date: Date) => {
  const bookings = await db.booking.findMany({
    where: {
      establishmentId,
      date: {
        lte: endOfDay(date),
        gte: startOfDay(date)
      }
    }
  });
  return bookings;
};