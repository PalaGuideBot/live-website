import { DateTime } from 'luxon'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Details, DetailsContent, DetailsTitle } from '@/components/ui/details'
import { useCurrentDate } from '@/hooks/use_current_date'
import { cn } from '@/lib/utils'
import type { HomePageProps } from '@/pages/home/index'
import { eventImageUrl } from '@/pages/home/utils/event'

function extractUniqueEvents(events: HomePageProps['events']) {
  return events
    .flatMap((dailyEvents) => {
      return dailyEvents.events.map((event) => {
        return {
          id: event.id,
          name: event.name,
          imageUrl: eventImageUrl(event.id),
          time: event.time,
        }
      })
    })
    .reduce(
      (acc, event) => {
        if (!acc.some((e) => e.id === event.id)) {
          acc.push(event)
        }
        return acc
      },
      [] as { id: string; name: string; imageUrl: string }[]
    )
}

function translateWeekday(weekday: string) {
  weekday = weekday.charAt(0).toUpperCase() + weekday.slice(1).toLowerCase()
  const translated = DateTime.fromFormat(weekday, 'cccc', { locale: 'en' }).toFormat('cccc', {
    locale: 'fr',
  })
  return translated.charAt(0).toUpperCase() + translated.slice(1)
}

interface EventCardProps extends React.ComponentProps<'div'> {
  event: {
    id: string
    name: string
    imageUrl: string
    time: string
  }
}

function EventCard({ event, className, style, ...props }: EventCardProps) {
  return (
    <div
      key={event.id}
      className={cn('relative min-h-30 w-full rounded-lg overflow-hidden', className)}
      style={{
        backgroundImage: `url(${event.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...style,
      }}
      {...props}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative h-full flex items-center justify-center ">
        <span className="text-2xl font-medium text-white drop-shadow-lg">{event.name}</span>
        <span className="text-xl text-white absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded">
          {event.time}
        </span>
      </div>
    </div>
  )
}

interface AgendaProps {
  events: HomePageProps['events']
}

export function Agenda({ events }: AgendaProps) {
  const now = useCurrentDate()
  const today = now.toFormat('cccc', { locale: 'en' }).toLowerCase()

  const todayEvents = events.find((e) => e.day === today)!

  const uniqueEvents = extractUniqueEvents(events)

  const pastEvents = todayEvents.events.filter((event) => {
    const eventTime = DateTime.fromFormat(event.time, "HH'h'mm", { zone: 'Europe/Paris' })
    return eventTime < now.setZone('Europe/Paris')
  })

  const upcomingEvents = todayEvents.events.filter((event) => {
    const eventTime = DateTime.fromFormat(event.time, "HH'h'mm", { zone: 'Europe/Paris' })
    return eventTime > now.setZone('Europe/Paris')
  })

  const upcomingEvent = upcomingEvents.at(0)

  return (
    <div className="flex-1 flex flex-col gap-4 [&_[data-slot=card-title]]:text-xl">
      <Card>
        <CardHeader>
          <CardTitle>Légende des événements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {uniqueEvents.map((event) => (
              <div
                key={event.id}
                className="relative h-32 rounded-lg overflow-hidden"
                style={{
                  backgroundImage: `url(${event.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative h-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white drop-shadow-lg">
                    {event.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{pastEvents.length > 1 ? 'Événements passés' : 'Événement passé'}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 grid gap-4">
            {pastEvents.length > 0 ? (
              pastEvents
                .map((event) => (
                  <EventCard
                    key={event.id + event.time}
                    className="h-full rounded-md"
                    event={{ ...event, imageUrl: eventImageUrl(event.id) }}
                  />
                ))
                .slice(0, 3)
            ) : (
              <div className="text-center">Aucun événement passé</div>
            )}
            {}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Prochain événement</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 grid grid-rows-3 gap-4">
            {upcomingEvent ? (
              <>
                <div
                  className="relative min-h-50 h-full w-full rounded-lg overflow-hidden outline-4 outline-amber-500"
                  style={{
                    backgroundImage: `url(${eventImageUrl(upcomingEvent.id)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  key={upcomingEvent.id}
                />
                <div className="row-span-2 flex flex-col justify-evenly gap-6">
                  <Details>
                    <DetailsTitle className="text-lg">Nom de l'évènement</DetailsTitle>
                    <DetailsContent className="text-amber-500 text-2xl font-medium">
                      {upcomingEvent.name}
                    </DetailsContent>
                  </Details>
                  <Details>
                    <DetailsTitle className="text-lg">Jour</DetailsTitle>
                    <DetailsContent className="text-amber-500 text-2xl font-medium">
                      {translateWeekday(today)}
                    </DetailsContent>
                  </Details>
                  <Details>
                    <DetailsTitle className="text-lg">Heure de début</DetailsTitle>
                    <DetailsContent className="text-amber-500 text-2xl font-medium">
                      {upcomingEvent.time}
                    </DetailsContent>
                  </Details>
                </div>
              </>
            ) : (
              <div className="text-center">Aucun événement à venir</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              {upcomingEvents.length > 1 ? 'Événements suivant' : 'Événement suivant'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 grid gap-4">
            {upcomingEvents.length > 2 ? (
              upcomingEvents
                .map((event) => (
                  <EventCard
                    key={event.id + event.time}
                    className="h-full rounded-md"
                    event={{ ...event, imageUrl: eventImageUrl(event.id) }}
                  />
                ))
                .splice(1)
                .slice(0, 3)
            ) : (
              <div className="text-center">Aucun événement suivant</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
