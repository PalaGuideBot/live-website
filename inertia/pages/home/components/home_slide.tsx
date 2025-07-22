import { HeartHandshake } from 'lucide-react'
import React, { useEffect, useRef } from 'react'

import { TwitchIcon } from '@/components/icons'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Details, DetailsContent, DetailsTitle } from '@/components/ui/details'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { HomePageProps } from '@/pages/home/index'
import { useTwitchChat } from '../hooks/use_twitch_chat'

interface HomeSlideProps {
  sponsors: HomePageProps['sponsors']
}

export function HomeSlide({ sponsors }: HomeSlideProps) {
  return (
    <div className="flex-1 grid grid-cols-4 gap-8">
      <div className="col-span-2 flex flex-col gap-8">
        <Card className="overflow-hidden p-0">
          <img
            src="https://image.palaguidebot.fr/banner/banner_twitch.webp"
            className="w-full h-48 object-cover"
          />
        </Card>
        <Card>
          <CardHeader className="text-2xl">
            <CardTitle>Bienvenue sur le live PalaGuideBot</CardTitle>
            <CardDescription className="text-lg">
              Retrouvez les informations concernant Paladium en temps réel.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-evenly gap-4 [&_*]:text-xl">
            <Separator />
            <Details>
              <DetailsTitle>Site web</DetailsTitle>
              <DetailsContent>https://palaguidebot.fr</DetailsContent>
            </Details>
            <Details>
              <DetailsTitle>Discord Support</DetailsTitle>
              <DetailsContent>discord.gg/palaguidebot</DetailsContent>
            </Details>
          </CardContent>
        </Card>
        <BotDetails />
      </div>
      <div>
        <SponsorsCard sponsors={sponsors} />
      </div>
      <TwitchChatCard className="col-start-4" />
    </div>
  )
}

function TwitchChatCard({ className, ...props }: React.ComponentProps<typeof Card>) {
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const messages = useTwitchChat()

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages])

  return (
    <Card className={cn('overflow-hidden p-0 gap-0', className)} {...props}>
      <CardHeader className="bg-gradient-to-bl from-card from-20% to-[#6441a5]/40 p-4 flex justify-center items-center">
        <CardTitle className="flex items-center gap-1 font-semibold text-2xl">
          <span>Chat Twitch</span>
          <TwitchIcon className="size-6 ml-1" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 relative">
        <div
          ref={chatContainerRef}
          className="space-y-2 p-4 absolute inset-0 overflow-y-auto"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {messages.map((msg, index) => (
            <div key={index} className="flex flex-wrap items-start gap-2 text-lg">
              <span className="text-gray-400 flex-shrink-0">{msg.timestamp}</span>
              <span className={`font-semibold flex-shrink-0`} style={{ color: msg.color }}>
                {msg.username}:
              </span>
              <span className="text-gray-200 break-words">{msg.message}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function SponsorsCard({
  sponsors,
  className,
  ...props
}: React.ComponentProps<typeof Card> & { sponsors: HomePageProps['sponsors'] }) {
  return (
    <Card className={cn('overflow-hidden p-0 gap-0', className)} {...props}>
      <CardHeader className="bg-gradient-to-bl from-card from-20% to-[#ffb702]/20 p-4">
        <CardTitle className="flex items-center gap-2 font-semibold text-2xl">
          <HeartHandshake className="size-6 ml-1 " />
          <span>Nos Sponsors</span>
        </CardTitle>
        <CardDescription className="text-lg">
          Vous pouvez soutenir le projet sur Github
          <span className="text-transparent bg-gradient-to-bl bg-clip-text from-[#ffb702] from-60% to-[#e9a702]">
            {' '}
            https://github.com/sponsors/PalaGuideBot
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        {sponsors.sponsors.length === 0 && (
          <div className="text-center text-muted-foreground">Aucun sponsor pour le moment</div>
        )}

        {sponsors.sponsors.length > 0 && (
          <div className="space-y-3">
            {sponsors.sponsors.map((sponsor, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-card/50">
                <img
                  src={sponsor.sponsorEntity.avatarUrl}
                  alt={sponsor.sponsorEntity.name}
                  className="w-13 h-13 rounded-full"
                />
                <div className="flex-1">
                  <div className="font-semibold text-lg">
                    {sponsor.sponsorEntity.name || sponsor.sponsorEntity.login}
                  </div>
                  <div className="text-base text-muted-foreground">
                    @{sponsor.sponsorEntity.login}
                  </div>
                </div>
              </div>
            ))}
            <Separator />
            <div className="text-center text-lg text-muted-foreground mt-4">
              Merci à nos sponsors pour leur soutien !
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function BotDetails({ className, ...props }: React.ComponentProps<typeof Details>) {
  return (
    <Card className={cn('overflow-hidden p-0 pb-4 gap-4 flex-1', className)} {...props}>
      <CardHeader className="bg-gradient-to-bl from-card from-20% to-[#00b2ff]/20 p-4">
        <CardTitle className="font-semibold text-2xl">Informations du Bot Twitch</CardTitle>
        <CardDescription className="text-lg">
          Retrouvez toutes les informations concernant le bot PalaGuideBot.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-evenly gap-4 [&_*]:text-base px-4">
        <Details>
          <DetailsTitle>
            p!lookup{' '}
            <span className="text-transparent bg-gradient-to-bl bg-clip-text from-[#ff8731] from-60% to-[#ffef61]">
              PSEUDO
            </span>
          </DetailsTitle>
          <DetailsContent>Permet d'obtenir des informations sur un joueur.</DetailsContent>
        </Details>
        <Details>
          <DetailsTitle>
            p!faction{' '}
            <span className="text-transparent bg-gradient-to-bl bg-clip-text from-[#ff8731] from-60% to-[#ffef61]">
              NAME
            </span>
          </DetailsTitle>
          <DetailsContent>Affiche les informations de la faction.</DetailsContent>
        </Details>
        <Details>
          <DetailsTitle>
            p!carte{' '}
            <span className="text-transparent bg-gradient-to-bl bg-clip-text from-[#ff8731] from-60% to-[#ffef61]">
              PSEUDO
            </span>
          </DetailsTitle>
          <DetailsContent>Affiche le lien vers la carte du joueur.</DetailsContent>
        </Details>
        <Details>
          <DetailsTitle>p!help</DetailsTitle>
          <DetailsContent>Affiche les commandes disponibles.</DetailsContent>
        </Details>
        <Separator />
      </CardContent>
      <CardFooter className="px-4">
        <div className="w-full text-center text-lg text-muted-foreground">
          Vous souhaitez ajouter le bot sur votre chaine Twitch ?
          <br />
          Les demandes sont ouvertes via ticket sur le serveur Discord. Aucun pré-requis n'est
          nécessaire
        </div>
      </CardFooter>
    </Card>
  )
}
