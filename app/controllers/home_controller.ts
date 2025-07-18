import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { dailyEvents } from '#app/event/contents/events'
import { PaladiumService } from '#app/paladium/services/api'
import cache from '#cache/cache'

@inject()
export default class HomeController {
  constructor(private paladiumService: PaladiumService) {}

  async handle({ inertia }: HttpContext) {
    const status = () => {
      return cache.getOrSet({
        key: 'paladium.status',
        factory: () => this.paladiumService.getStatus(),
        ttl: '5min',
      })
    }
    //   const factionQuest = () => this.paladiumService.getFactionQuest()
    //   const factionOnYourMarks = () => this.paladiumService.getFactionOnYourMarks()
    //   const factionLeaderboard = () => this.paladiumService.getLeaderboardFactions()
    const moneyLeaderboard = () => {
      return cache.getOrSet({
        key: 'paladium.leaderboard.money',
        factory: async () => {
          const leaderboard = await this.paladiumService.getLeaderboardRankingGlobal('money')
          const topPlayer = leaderboard.at(0)
            ? await this.paladiumService.getAllPlayerData(leaderboard.at(0)!.username)
            : null

          return {
            leaderboard,
            topPlayer,
          }
        },
        ttl: '5min',
      })
    }
    //   const allianceLeaderboard = () => this.paladiumService.getLeaderboardRankingGlobal('alliance')

    return inertia.render('home/index', {
      events: dailyEvents,
      status,
      // factionQuest,
      // factionOnYourMarks,
      // factionLeaderboard,
      moneyLeaderboard,
      // allianceLeaderboard,
    })
  }
}
