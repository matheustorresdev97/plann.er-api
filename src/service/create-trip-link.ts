import { prisma } from '@/lib/prisma'

interface CreateLinkInput {
  tripId: string
  title: string
  url: string
}

export const createTripLink = async ({ tripId, title, url }: CreateLinkInput) => {
  const link = await prisma.link.create({
    data: {
      trip_id: tripId,
      title,
      url,
    },
  })

  return link
}
