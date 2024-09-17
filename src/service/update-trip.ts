import { prisma } from '@/lib/prisma'

export const updateTrip = async (tripId: string, data: {
  destination: string
  starts_at: Date
  ends_at: Date
}) => {
  // Verifica se a viagem existe
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
  })

  if (!trip) {
    throw new Error('Trip not found.')
  }

  // Atualiza a viagem
  return await prisma.trip.update({
    where: { id: tripId },
    data,
  })
}
