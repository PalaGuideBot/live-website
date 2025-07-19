import React, { useEffect, useRef } from 'react'

import { TwitchIcon } from '@/components/icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Details, DetailsContent, DetailsTitle } from '@/components/ui/details'
import { cn } from '@/lib/utils'
import { useTwitchChat } from '../hooks/use_twitch_chat'

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
        <CardTitle className="flex items-center gap-1 font-semibold">
          <span>Chat Twitch</span>
          <TwitchIcon className="size-4 ml-1" />
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
            <div key={index} className="flex flex-wrap items-start gap-2 text-sm">
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

export function HomeSlide() {
  return (
    <div className="flex-1 grid grid-cols-4 gap-4">
      <div className="col-span-2 flex flex-col gap-8">
        <Card className="overflow-hidden p-0">
          <img src="https://image.palaguidebot.fr/banner/bot.webp" className="w-full" />
        </Card>
        <Card className="flex-1">
          <CardHeader className="text-2xl">
            <CardTitle>Bienvenue sur le live PalaGuideBot</CardTitle>
            <CardDescription className="text-lg">
              Retrouvez les informations concernant Paladium en temps réel.
              <br />
              Restez connecté pour ne rien manquer !
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-evenly gap-4 [&_*]:text-xl">
            <Details>
              <DetailsTitle>Site web</DetailsTitle>
              <DetailsContent>https://palaguidebot.fr</DetailsContent>
            </Details>
            <Details>
              <DetailsTitle>Discord Support</DetailsTitle>
              <DetailsContent>discord.gg/palaguidebot</DetailsContent>
            </Details>
            <Details>
              <DetailsTitle>Nous soutenir</DetailsTitle>
              <DetailsContent className="text-transparent bg-gradient-to-bl bg-clip-text from-[#ffb702] from-60% to-[#e9a702]">
                https://github.com/sponsors/PalaGuideBot
              </DetailsContent>
            </Details>
            <Details>
              <DetailsTitle>Crédits</DetailsTitle>
              <DetailsContent>Tonykun7 - Créateur - tonykun.me</DetailsContent>
              <DetailsContent>Riveur - Développeur Web - riveur.com</DetailsContent>
              <DetailsContent>Zeluck_ - Graphiste - zeluck.fr</DetailsContent>
            </Details>
          </CardContent>
        </Card>
      </div>
      <TwitchChatCard className="col-start-4" />
    </div>
  )
}
