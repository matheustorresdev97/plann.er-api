import { prisma } from "@/lib/prisma"

export const createInvite  = async (tripId: string, email: string) => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
  })

  if (!trip) {
    throw new Error("Trip not found.")
  }

  return await prisma.participant.create({
    data: {
      trip_id: tripId,
      email,
    },
  })
}

export const getTripById = async (tripId: string) => {
    return await prisma.trip.findUnique({
      where: { id: tripId },
    })
  }