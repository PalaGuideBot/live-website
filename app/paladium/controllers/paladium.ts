import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { PaladiumService } from '#paladium/services/api'

@inject()
export default class PaladiumController {
  constructor(private paladiumService: PaladiumService) {}

  async factionQuest({ response }: HttpContext) {
    const quest = await this.paladiumService.getFactionQuest()

    return response.ok(quest)
  }

  async factionOnYourMarks({ response }: HttpContext) {
    const quest = await this.paladiumService.getFactionOnYourMarks()

    return response.ok(quest)
  }

  async fationLeaderboard({ response }: HttpContext) {
    const leaderboard = await this.paladiumService.getLeaderboardFactions()

    return response.ok(leaderboard)
  }

  async leaderboardByCategory({ request, response }: HttpContext) {
    const category = request.param('category')
    const leaderboard = await this.paladiumService.getLeaderboardRankingGlobal(category)

    if (!leaderboard) {
      return response.notFound({ message: 'Leaderboard not found' })
    }

    return response.ok(leaderboard)
  }

  async status({ response }: HttpContext) {
    const status = await this.paladiumService.getStatus()

    return response.ok(status)
  }
}
