import vine, { VineValidator } from '@vinejs/vine'

import { LeaderboardTrixiumCategory } from '#leaderboard/types'

export const factionsLeaderboardValidator = vine.compile(
  vine.array(
    vine.object({
      name: vine.string(),
      elo: vine.number(),
      emblem: vine
        .array(vine.number())
        .parse((value) => (value ? Object.values(value) : ([] as number[]))),
      position: vine.number(),
    })
  )
)

export const leaderboardCategoryValidator = vine.compile(
  vine.array(
    vine.object({
      username: vine.string(),
      uuid: vine.string(),
      position: vine.number(),
      value: vine.number(),
    })
  )
)

const leaderboardTrixiumPlayersValidator = vine.compile(
  vine.object({
    data: vine.array(
      vine.object({
        username: vine.string(),
        value: vine.number(),
      })
    ),
    totalCount: vine.number(),
  })
)

const leaderboardTrixiumFactionsValidator = vine.compile(
  vine.object({
    data: vine.array(
      vine.object({
        uuid: vine.string(),
        value: vine.number(),
      })
    ),
    totalCount: vine.number(),
  })
)

export const trixiumValidators = {
  player: leaderboardTrixiumPlayersValidator,
  faction: leaderboardTrixiumFactionsValidator,
} satisfies Record<LeaderboardTrixiumCategory, VineValidator<any, any>>
