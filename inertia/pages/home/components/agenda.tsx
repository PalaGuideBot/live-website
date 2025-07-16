import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { DateTime } from 'luxon'

import { eventImageUrl } from '@/pages/home/utils/event'
import type { HomePageProps } from '@/pages/home/index'
import { useCurrentDate } from '@/hooks/use_current_date'

interface AgendaProps {
  events: HomePageProps['events']
}

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

function EventCard(event: { id: string; name: string; imageUrl: string; time: string }) {
  return (
    <div
      className="relative h-30 w-full rounded-lg overflow-hidden"
      style={{
        backgroundImage: `url(${event.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      key={event.id}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative h-full flex items-center justify-center ">
        <span className="font-medium text-white drop-shadow-lg">{event.name}</span>
        <span className="text-xl text-white absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded">
          {event.time}
        </span>
      </div>
    </div>
  )
}

export default function Agenda(props: AgendaProps) {
  const now = useCurrentDate()
  const today = now.toFormat('cccc', { locale: 'en' }).toLowerCase()

  const todayEvents = props.events.find((e) => e.day === today)!

  const uniqueEvents = extractUniqueEvents(props.events)

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
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Légende des événements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {uniqueEvents.map((event) => (
              <div
                className="relative h-20 rounded-lg overflow-hidden"
                style={{
                  backgroundImage: `url(${event.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                key={event.id}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{pastEvents.length > 1 ? 'Événements passé' : 'Événement passé'}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {pastEvents.length > 0 ? (
              pastEvents
                .map((event) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    name={event.name}
                    imageUrl={eventImageUrl(event.id)}
                    time={event.time}
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
          <CardContent className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {upcomingEvent ? (
              <>
                <div
                  className="relative h-50 w-full rounded-lg overflow-hidden"
                  style={{
                    backgroundImage: `url(${eventImageUrl(upcomingEvent.id)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  key={upcomingEvent.id}
                />
                <div className="relative h-full flex items-center justify-center mt-4">
                  <span className="text-2xl font-medium">
                    Prochain événement <span className="text-amber-500">{upcomingEvent.name}</span>{' '}
                    à <span className="text-amber-500">{upcomingEvent.time}</span>
                  </span>
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
          <CardContent className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {upcomingEvents.length > 2 ? (
              upcomingEvents
                .map((event) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    name={event.name}
                    imageUrl={eventImageUrl(event.id)}
                    time={event.time}
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
