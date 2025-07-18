import type { ApplicationService } from '@adonisjs/core/types'
import { DateTime } from 'luxon'

import { PaladiumService } from '#app/paladium/services/api'

export default class PlayerOnlineProvider {
  constructor(protected app: ApplicationService) {}

  protected intervalId: NodeJS.Timeout | null = null

  /**
   * The process has been started
   */
  async ready() {
    const transmit = await this.app.container.make('transmit')

    this.intervalId = setInterval(async () => {
      const data = await this.retrieveOnlinePlayers()
      transmit.broadcast('player.online', data)
    }, 60000) // every minute
  }

  async retrieveOnlinePlayers() {
    const cache = await this.app.container.make('cache')
    const paladiumService = await this.app.container.make(PaladiumService)

    const status = await paladiumService.getStatus()
    const date = DateTime.now().toISO()!

    await cache.setForever({
      key: 'paladium.status.lastPlayersCount',
      value: status.java.global.players,
    })

    return { count: status.java.global.players, date }
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }
}
