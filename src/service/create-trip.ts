import { prisma } from '@/lib/prisma'

export const createTrip = async (tripData: {
  destination: string,
  starts_at: Date,
  ends_at: Date,
  owner_name: string,
  owner_email: string,
  emails_to_invite: string[],
}) => {
  const {
    starts_at,
    ends_at,
    destination,
    emails_to_invite,
    owner_name,
    owner_email,
  } = tripData

  return await prisma.trip.create({
    data: {
      destination,
      starts_at,
      ends_at,
      participants: {
        createMany: {
          data: [
            {
              name: owner_name,
              email: owner_email,
              is_owner: true,
              is_confirmed: true,
            },
            ...emails_to_invite.map((email) => {
              return { email }
            }),
          ],
        },
      },
    },
  })
}