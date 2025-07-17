import type { ApplicationService } from '@adonisjs/core/types'
import { DateTime } from 'luxon'

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
    }, 10000 / 2)
  }

  async retrieveOnlinePlayers() {
    const count = Number((Math.random() * 100).toFixed(0))
    const date = DateTime.now().toISO()!

    return { count, date }
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
