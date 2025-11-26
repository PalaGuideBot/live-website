import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { dailyEvents } from '#app/event/contents/events'
import { GitHubService } from '#app/github/services/api'
import { PaladiumService } from '#app/paladium/services/api'
import { ImageService } from '#paladium/services/image'
import cache from '#cache/cache'

@inject()
export default class HomeController {
  constructor(
    private paladiumService: PaladiumService,
    private githubService: GitHubService,
    private imageService: ImageService
  ) {}

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
    const factionLeaderboard = () => {
      return cache.getOrSet({
        key: 'paladium.leaderboard.faction',
        factory: async () => {
          const leaderboard = await this.paladiumService.getLeaderboardFactions()

          const factions = await Promise.all(
            leaderboard.slice(0, 10).map(async (faction) => {
              const emblem = await this.imageService.getOrCreateEmblem(faction.emblem)

              return {
                name: faction.name,
                value: faction.value,
                position: faction.position,
                emblemUrl: emblem.url,
              }
            })
          )

          const topFaction = factions.at(0)
            ? await this.paladiumService.getFactionProfile(factions.at(0)!.name)
            : null

          return {
            leaderboard: factions,
            topFaction: topFaction
              ? {
                  ...topFaction,
                  elo: factions.find((f) => f.name === topFaction.name)!.value,
                  emblemUrl: factions.find((f) => f.name === topFaction.name)!.emblemUrl,
                  players: topFaction.players.slice(0, 56),
                }
              : null,
          }
        },
        ttl: '5min',
      })
    }

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

    const sponsors = () => {
      return cache.getOrSet({
        key: 'github.sponsors',
        factory: () => this.githubService.getSponsors(),
        ttl: '15min',
      })
    }

    return inertia.render('home/index', {
      events: dailyEvents,
      status,
      // factionQuest,
      // factionOnYourMarks,
      factionLeaderboard,
      moneyLeaderboard,
      sponsors,
    })
  }
}
