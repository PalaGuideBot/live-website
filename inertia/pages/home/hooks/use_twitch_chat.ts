import { useEffect, useState } from 'react'

import { transmit } from '@/lib/transmit'

interface ChatMessage {
  username: string
  message: any
  timestamp: string
  color?: string
}

export function useTwitchChat() {
  const [messages, setMessages] = useState<Array<ChatMessage>>([])

  useEffect(() => {
    const subscription = transmit.subscription('twitch.chat.message')

    const unsubscribe = subscription.onMessage((data: ChatMessage) => {
      setMessages((prev) => [...prev, data])
    })

    subscription.create()

    return () => {
      unsubscribe()
      subscription.delete()
    }
  }, [])

  return messages
}
