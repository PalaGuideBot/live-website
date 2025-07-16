import Autoplay from 'embla-carousel-autoplay'

import { Head } from '@/components/head'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'

type HomePageProps = {}

export default function HomePage(props: HomePageProps) {
  return (
    <>
      <Head title="Accueil" />
      <Carousel opts={{ loop: true }} plugins={[Autoplay({ delay: 3000 })]}>
        <CarouselContent className="items-center">
          <CarouselItem>
            <section className="min-h-dvh w-full flex flex-col gap-8 p-8">
              <div>Hello world</div>
              <Button className="w-fit">Commencer</Button>
            </section>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </>
  )
}
