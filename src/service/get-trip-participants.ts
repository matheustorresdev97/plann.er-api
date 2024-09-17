import { prisma } from '@/lib/prisma'

export const getTripParticipants = async (tripId: string) => {
  return await prisma.participant.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      is_confirmed: true,
    },
    where: { trip_id: tripId },
  })
}
