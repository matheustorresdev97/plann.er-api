import { prisma } from "@/lib/prisma"

export const getTripById = async (tripId: string) => {
  return await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      participants: {
        where: {
          is_owner: false,
        },
      },
    },
  })
}

export const updateTripConfirmation = async (tripId: string) => {
  return await prisma.trip.update({
    where: { id: tripId },
    data: { is_confirmed: true },
  })
}
