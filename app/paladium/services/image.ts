import ky, { HTTPError } from 'ky'

import { minecraftItemValidator } from '#paladium/validators/image'
import env from '#start/env'

const imageClient = ky.create({
  prefixUrl: env.get('PALAGUIDEBOT_IMAGE_URL'),
  timeout: 10000,
  headers: {
    authorization: 'Bearer ' + env.get('PALAGUIDEBOT_IMAGE_KEY'),
  },
})

export class ImageService {
  async getMinecraftItem(id: string) {
    try {
      const response = await imageClient.get(
        `minecraft/items/${encodeURIComponent(id)}/informations`
      )
      const data = await response.json()

      return await minecraftItemValidator.validate(data)
    } catch (error: unknown) {
      if (error instanceof HTTPError && error.response.status === 404) {
        throw new Error(`Minecraft item with id "${id}" not found`)
      }
      throw error
    }
  }

  async getMinecraftEntity(id: string) {
    try {
      const response = await imageClient.get(
        `minecraft/entities/${encodeURIComponent(id)}/informations`
      )
      const data = await response.json()

      return await minecraftItemValidator.validate(data)
    } catch (error: unknown) {
      if (error instanceof HTTPError && error.response.status === 404) {
        throw new Error(`Minecraft entity with id "${id}" not found`)
      }
      throw error
    }
  }
}
