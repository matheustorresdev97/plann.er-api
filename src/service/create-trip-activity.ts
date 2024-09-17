import { prisma } from '@/lib/prisma'

export const createActivity = async (tripId: string, title: string, occursAt: Date) => {
  return await prisma.activity.create({
    data: {
      trip_id: tripId,
      title,
      occurs_at: occursAt,
    },
  })
}
