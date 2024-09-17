import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'

export const getTripActivities = async (tripId: string) => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      activities: {
        select: {
          id: true,
          title: true,
          occurs_at: true,
        },
      },
    },
  })

  if (!trip) {
    throw new Error('Trip not found.')
  }

  const differenceInDaysBetweenTripStartAndEnd = dayjs(trip.ends_at).diff(
    trip.starts_at,
    'days',
  )

  const activities = Array.from({
    length: differenceInDaysBetweenTripStartAndEnd + 1,
  }).map((_, daysToAdd) => {
    const dateToCompare = dayjs(trip.starts_at).add(daysToAdd, 'days')

    return {
      date: dateToCompare.toDate(),
      activities: trip.activities.filter((activity) => {
        return dayjs(activity.occurs_at).isSame(dateToCompare, 'day')
      }),
    }
  })

  return activities
}
