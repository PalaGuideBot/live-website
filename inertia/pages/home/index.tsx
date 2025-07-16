//import Autoplay from 'embla-carousel-autoplay'

import { Head } from '@/components/head'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import Agenda from './components/agenda'
import { InferPageProps } from '@adonisjs/inertia/types'
import type HomeController from '#controllers/home_controller'

export type HomePageProps = InferPageProps<HomeController, 'handle'>

export default function HomePage(props: HomePageProps) {
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
              <div>HomePage</div>
            </section>
          </CarouselItem>
          <CarouselItem>
            <section className="min-h-dvh w-full flex flex-col gap-8 p-8">
              <div>Status Graphique</div>
            </section>
          </CarouselItem>
          <CarouselItem>
            <section className="min-h-dvh w-full flex flex-col gap-8 p-8">
              <div>Leaderboard</div>
            </section>
          </CarouselItem>
          <CarouselItem>
            <section className="min-h-dvh w-full flex flex-col gap-8 p-8">
              <div>Agenda</div>
              <Agenda events={props.events} />
            </section>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </>
  )
}
