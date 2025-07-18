import { Card } from '@/components/ui/card'
import { useEffect, useRef } from 'react'
import { TwitchIcon } from 'lucide-react'
import { useTwitchChat } from '../hooks/use_twitch_chat'

function CustomTwitchChat() {
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
    <Card className="h-full shadow-lg overflow-hidden p-0">
      <div className="flex flex-col h-full text-white">
        <div className="bg-purple-700 p-3 text-center font-semibold">
          Chat Twitch <TwitchIcon className="inline-block w-4 h-4 ml-1" />
        </div>

        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-2 space-y-2"
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
      </div>
    </Card>
  )
}

export function HomeSlide() {
  return (
    <div className="flex justify-between w-full h-screen">
      <div className="flex justify-start">
        <Card className="w-full max-w-2xl p-6 shadow-lg h-1/2">
          <h1 className="text-2xl font-bold mb-4">Bienvenue sur le live PalaGuideBot</h1>
          <p className="text-gray-700">
            Sur ce live vous pouvez retrouver différentes informations concernant le serveur
            Paladium, les événements à venir, l'état des serveurs et bien plus encore. Restez
            connecté pour ne rien manquer !
          </p>
        </Card>
      </div>
      <div className="w-96 h-3/4">
        <CustomTwitchChat />
      </div>
    </div>
  )
}
