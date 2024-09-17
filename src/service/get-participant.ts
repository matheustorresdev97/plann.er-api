import { prisma } from '@/lib/prisma'

export const getParticipantById = async (participantId: string) => {
  return await prisma.participant.findUnique({
    select: {
      id: true,
      name: true,
      email: true,
      is_confirmed: true,
    },
    where: {
      id: participantId,
    },
  })
}
