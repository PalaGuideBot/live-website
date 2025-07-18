import type { ApplicationService } from '@adonisjs/core/types'
import { ChatClient } from '@twurple/chat'
import { StaticAuthProvider } from '@twurple/auth'
import transmit from '@adonisjs/transmit/services/main'

export default class TwitchChatProvider {
  private chatClient: ChatClient

  constructor(protected app: ApplicationService) {
    const authProvider = new StaticAuthProvider(
      'ID_CLIENT_TWITCH_HERE', // Replace with your actual Twitch client ID
      'TOKEN_HERE' // Replace with your actual Twitch OAuth token
    )
    this.chatClient = new ChatClient({ authProvider })
  }

  /**
   * The process has been started
   */
  async ready() {
    this.chatClient.connect()
    await this.chatClient.join('palaguidebot')
    this.chatClient.onMessage((channel, user, message, msg) => {
      if (channel !== 'palaguidebot') {
        return
      }
      const chatMessage = {
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
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {
    this.chatClient.onDisconnect(() => {
      console.log('Disconnected from Twitch chat')
    })
  }
}
