//import Autoplay from 'embla-carousel-autoplay'
import { InferPageProps } from '@adonisjs/inertia/types'

import type HomeController from '#controllers/home_controller'
import { Head } from '@/components/head'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { AgendaSlide } from './components/agenda_slide'
import { StatusSlide } from './components/status_slide'

export type HomePageProps = InferPageProps<HomeController, 'handle'>

export default function HomePage(props: HomePageProps) {
  const {
    events,
    status,
    // factionQuest,
    // factionOnYourMarks,
    // factionLeaderboard,
    // moneyLeaderboard,
    // allianceLeaderboard,
  } = props

  return (
    <>
      <Head title="Accueil" />
      <Carousel
        opts={{ loop: true }}
        plugins={
          [
            /*Autoplay({ delay: 3000 })*/
          ]
        }
      >
        <CarouselContent className="items-center">
          <CarouselItem>
            <section className="min-h-dvh w-full flex flex-col gap-8 p-8">
              <div>Etat des serveurs</div>
              <StatusSlide status={status} />
            </section>
          </CarouselItem>
          <CarouselItem>
            <section className="min-h-dvh w-full flex flex-col gap-8 p-8">
              <div>Agenda</div>
              <AgendaSlide events={events} />
            </section>
          </CarouselItem>
          <CarouselItem>
            <section className="min-h-dvh w-full flex flex-col gap-8 p-8">
              <div>HomePage</div>
            </section>
          </CarouselItem>
          <CarouselItem>
            <section className="min-h-dvh w-full flex flex-col gap-8 p-8">
              <div>Leaderboard</div>
            </section>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </>
  )
}
