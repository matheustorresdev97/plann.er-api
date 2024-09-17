import { prisma } from "@/lib/prisma"

export const getParticipantById = async (participantId: string) => {
  return await prisma.participant.findUnique({
    where: { id: participantId },
  })
}

export const updateParticipant = async (participantId: string, name: string) => {
  return await prisma.participant.update({
    where: { id: participantId },
    data: { is_confirmed: true, name },
  })
}
