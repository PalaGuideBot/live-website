import { useEffect, useState } from 'react'

import { transmit } from '@/lib/transmit'

type IncomingData = {
  count: number
  date: string
}

export function useOnlinePlayers() {
  const [onlinePlayers, setOnlinePlayers] = useState<Array<IncomingData>>([])

  useEffect(() => {
    const subscription = transmit.subscription('player.online')

    const unsbuscribe = subscription.onMessage((data: IncomingData) => {
      setOnlinePlayers((prev) => [...prev, data])
    })

    subscription.create()

    return () => {
      unsbuscribe()
      subscription.delete()
    }
  }, [])

  return onlinePlayers
}
