import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import { errors } from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'
import ky, { HTTPError } from 'ky'

import { ImageService } from '#paladium/services/image'

import cache from '#cache/cache'
import { getOnYourMarksGoalItem } from '#event/contents/events'
import { LeaderboardCategory, LeaderboardTrixiumCategory } from '#leaderboard/types'
import { generateDefaultStatus } from '#paladium/contents/status'
import type { ApiResponseError } from '#paladium/types'
import {
  factionOnYourMarksValidator,
  factionQuestValidator,
  factionProfileValidator,
  factionMembersValidator,
} from '#paladium/validators/faction'
import {
  factionsLeaderboardValidator,
  leaderboardCategoryValidator,
  trixiumValidators,
} from '#paladium/validators/leaderboard'
import { playerJobsValidator, playerProfileValidator } from '#paladium/validators/player'
import { statusValidator } from '#paladium/validators/status'
import env from '#start/env'

@inject()
class PaladiumService {
  constructor(private imageService: ImageService) {}

  protected client = ky.create({
    prefixUrl: env.get('PALADIUM_BASE_URL'),
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${env.get('PALADIUM_API_KEY')}`,
    },
  })

  // FACTION REQUESTS

  async getFactionProfile(name: string) {
    try {
      const response = await this.client.get(`paladium/faction/profile/${name}`)
      const data = await response.json()

      return factionProfileValidator.validate(data)
    } catch (error: unknown) {
      throw await buildError(error)
    }
  }

  async getFactionMembers(uuid: string) {
    try {
      const response = await this.client.get(`paladium/faction/profile/${uuid}/players?limit=100`)
      const data = await response.json()

      return factionMembersValidator.validate(data)
    } catch (error: unknown) {
      throw await buildError(error)
    }
  }

  // PLAYER REQUESTS

  async getPlayerProfile(username: string) {
    try {
      const response = await this.client.get(`paladium/player/profile/${username}`)
      const data = await response.json()

      return playerProfileValidator.validate(data)
    } catch (error: unknown) {
      throw await buildError(error)
    }
  }

  async getPlayerJobs(uuid: string) {
    try {
      const response = await this.client.get(`paladium/player/profile/${uuid}/jobs`)
      const data = await response.json()

      return playerJobsValidator.validate(data)
    } catch (error: unknown) {
      return null // Jobs are not required
    }
  }

  async getAllPlayerData(username: string) {
    const profile = await this.getPlayerProfile(username)

    const uuid = profile.uuid

    const jobs = await this.getPlayerJobs(uuid)

    return {
      profile,
      jobs: jobs ?? {
        alchemist: { level: 0, xp: 0 },
        farmer: { level: 0, xp: 0 },
        hunter: { level: 0, xp: 0 },
        miner: { level: 0, xp: 0 },
      },
    }
  }

  // EVENTS REQUESTS

  async getFactionQuest() {
    try {
      const response = await this.client.get('paladium/faction/quest')
      const data = await response.json()

      const result = await factionQuestValidator.validate(data)

      let image = null

      try {
        image = await this.imageService.getMinecraftItem(result.item)
      } catch {}

      return { ...result, image }
    } catch (error: unknown) {
      throw await buildError(error)
    }
  }

  async getFactionOnYourMarks() {
    try {
      const response = await this.client.get('paladium/faction/onyourmarks')
      const data = await response.json()

      const result = await factionOnYourMarksValidator.validate(data)

      let image = null

      try {
        switch (result.goalType) {
          case 'MOB_KILL':
            image = await this.imageService.getMinecraftEntity(getOnYourMarksGoalItem(result))
            break
          default:
            image = await this.imageService.getMinecraftItem(getOnYourMarksGoalItem(result))
            break
        }
      } catch {}

      return { ...result, image }
    } catch (error: unknown) {
      throw await buildError(error)
    }
  }

  // LEADERBOARD REQUESTS

  async getLeaderboardFactions() {
    try {
      const response = await this.client.get(`paladium/faction/leaderboard`)
      const data = await response.json()

      const result = await factionsLeaderboardValidator.validate(data)

      return result.map(({ elo, ...faction }) => ({
        ...faction,
        value: elo,
      }))
    } catch (error: unknown) {
      throw await buildError(error)
    }
  }

  async getLeaderboardRankingGlobal(category: LeaderboardCategory) {
    try {
      const response = await this.client.get(`paladium/ranking/leaderboard/${category}/1`)
      const data = await response.json()

      const result = await leaderboardCategoryValidator.validate(data)

      return result.toSorted((a, b) => a.position - b.position)
    } catch (error: unknown) {
      throw await buildError(error)
    }
  }

  async getLeaderboardRankingTrixium<Category extends LeaderboardTrixiumCategory>(
    category: Category
  ): Promise<Infer<(typeof trixiumValidators)[Category]>['data']> {
    try {
      const result = []
      for (let i = 0; i < 5; i++) {
        const response = await this.client.get(
          `paladium/ranking/trixium/${category}?offset=${i * 100}&limit=100`
        )
        const data = await response.json()

        const validatedData = await trixiumValidators[category].validate(data)
        result.push(...validatedData.data)
      }

      return result as Infer<(typeof trixiumValidators)[Category]>['data']
    } catch (error: unknown) {
      throw await buildError(error)
    }
  }

  async getLeaderboardRanking(
    category: `trixium.${LeaderboardTrixiumCategory}`
  ): Promise<Awaited<ReturnType<this['getLeaderboardRankingTrixium']>>>
  async getLeaderboardRanking(
    category: LeaderboardCategory
  ): Promise<Awaited<ReturnType<this['getLeaderboardRankingGlobal']>>>
  async getLeaderboardRanking(
    category: LeaderboardCategory | `trixium.${LeaderboardTrixiumCategory}`
  ): Promise<
    | Infer<(typeof trixiumValidators)[LeaderboardTrixiumCategory]>['data']
    | Infer<typeof leaderboardCategoryValidator>
  >
  async getLeaderboardRanking(
    category: LeaderboardCategory | `trixium.${LeaderboardTrixiumCategory}`
  ) {
    if (category.startsWith('trixium')) {
      return this.getLeaderboardRankingTrixium(
        category.replace('trixium.', '') as LeaderboardTrixiumCategory
      )
    }
    return this.getLeaderboardRankingGlobal(category as LeaderboardCategory)
  }

  // STATUS REQUESTS

  async getStatus() {
    try {
      const response = await this.client.get('status')
      const data = await response.json()

      return statusValidator.validate(data)
    } catch (error: unknown) {
      const cachedPlayerCount = await cache.get<number | undefined>({
        key: 'paladium.status.lastPlayerCount',
      })
      return generateDefaultStatus(cachedPlayerCount ?? 0)
    }
  }
}

async function buildError(error: unknown) {
  if (error instanceof HTTPError) {
    const data = (await error.response.json()) as ApiResponseError
    return new Exception(data.message ?? 'An error occurred while processing the request', {
      status: error.response.status,
      code: data.type ?? 'E_PALADIUM_API_ERROR',
    })
  }
  if (error instanceof errors.E_VALIDATION_ERROR) {
    return new Exception('Unable to validate data', {
      code: 'E_PALADIUM_API_VALIDATION_ERROR',
      status: 500,
    })
  }
  return new Exception('Internal error', {
    code: 'E_PALADIUM_ERROR',
    status: 500,
  })
}

export { PaladiumService }
