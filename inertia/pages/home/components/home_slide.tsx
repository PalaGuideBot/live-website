import React, { useEffect, useRef } from 'react'

import { TwitchIcon } from '@/components/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
      <CardContent className="p-4">
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto space-y-2"
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
      <Card>
        <CardContent>
          <h1 className="text-2xl font-bold mb-4">Bienvenue sur le live PalaGuideBot</h1>
          <p className="text-muted-foreground">
            Sur ce live vous pouvez retrouver différentes informations concernant le serveur
            Paladium, les événements à venir, l'état des serveurs et bien plus encore. Restez
            connecté pour ne rien manquer !
          </p>
        </CardContent>
      </Card>
      <TwitchChatCard className="col-start-4" />
    </div>
  )
}
