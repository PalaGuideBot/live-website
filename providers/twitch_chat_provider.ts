import type { ApplicationService } from '@adonisjs/core/types'
import { StaticAuthProvider } from '@twurple/auth'
import { ChatClient } from '@twurple/chat'

import env from '#start/env'

export default class TwitchChatProvider {
  private chatClient: ChatClient

  constructor(protected app: ApplicationService) {
    const authProvider = new StaticAuthProvider(
      env.get('TWITCH_CLIENT_ID'),
      env.get('TWITCH_CLIENT_TOKEN')
    )
    this.chatClient = new ChatClient({ authProvider })
  }

  async register() {
    const logger = await this.app.container.make('logger')
    const transmit = await this.app.container.make('transmit')

    this.chatClient.onMessage((channel, user, message, msg) => {
      if (channel !== 'palaguidebot') return

      const chatMessage = {
        id: msg.id,
        username: user,
        message: message,
        timestamp: new Date().toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        color: msg.userInfo.color || '#2366caff',
      }
      transmit.broadcast('twitch.chat.message', chatMessage)
    })
    this.chatClient.onConnect(() => {
      logger.info('Connected to Twitch chat')
    })
    this.chatClient.onDisconnect(() => {
      logger.info('Disconnected from Twitch chat')
    })
  }

  /**
   * The process has been started
   */
  async ready() {
    this.chatClient.connect()
    await this.chatClient.join('palaguidebot')
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {
    this.chatClient.quit()
  }
}
