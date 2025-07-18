import type { Infer } from '@vinejs/vine/types'

import type { statusValidator } from '#paladium/validators/status'

export function generateDefaultStatus(playersCount: number) {
  return {
    java: {
      factions: {
        Aeloria: 'unknown',
        Egopolis: 'unknown',
        Kilmordra: 'unknown',
        Runegard: 'unknown',
        Xanoth: 'unknown',
      },
      global: {
        status: 'unknown',
        players: playersCount,
      },
    },
    launcher: {
      status: 'unknown',
    },
  } satisfies Infer<typeof statusValidator>
}
