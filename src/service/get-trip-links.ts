import { prisma } from '@/lib/prisma'

export const getTripLinks = async (tripId: string) => {
  return await prisma.link.findMany({
    select: {
      id: true,
      title: true,
      url: true,
    },
    where: { trip_id: tripId },
  })
}
