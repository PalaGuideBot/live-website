import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import { errors } from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'
import ky, { HTTPError } from 'ky'

import { ImageService } from '#paladium/services/image'

import { getOnYourMarksGoalItem } from '#event/contents/events'
import { LeaderboardCategory, LeaderboardTrixiumCategory } from '#leaderboard/types'
import type { ApiResponseError } from '#paladium/types'
import { factionOnYourMarksValidator, factionQuestValidator } from '#paladium/validators/faction'
import {
  factionsLeaderboardValidator,
  leaderboardCategoryValidator,
  trixiumValidators,
} from '#paladium/validators/leaderboard'
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

      const validate = await factionsLeaderboardValidator.validate(data)

      return validate.map((faction) => ({
        name: faction.name,
        value: faction.elo,
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
      throw await buildError(error)
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
