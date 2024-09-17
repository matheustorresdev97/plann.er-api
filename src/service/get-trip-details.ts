import { prisma } from '@/lib/prisma'

export const getTripDetails = async (tripId: string) => {
  const trip = await prisma.trip.findUnique({
    select: {
      id: true,
      destination: true,
      starts_at: true,
      ends_at: true,
      is_confirmed: true,
    },
    where: { id: tripId },
  })

  if (!trip) {
    throw new Error('Trip not found.')
  }

  return trip
}
