import vine from '@vinejs/vine'

const jobs = vine
  .object({
    level: vine.number(),
    xp: vine.number(),
  })
  .parse((value) => value ?? { level: 0, xp: 0 })

export const playerProfileValidator = vine.compile(
  vine.object({
    faction: vine.string().optional().nullable(),
    factionRank: vine.string().optional().nullable(),
    firstSeen: vine.number().optional().nullable(),
    money: vine.number().optional().nullable(),
    rank: vine.string().optional().nullable(),
    timePlayed: vine.number().optional().nullable(),
    username: vine.string(),
    uuid: vine.string(),
  })
)

export const playerJobsValidator = vine.compile(
  vine.object({
    alchemist: jobs,
    farmer: jobs,
    hunter: jobs,
    miner: jobs,
  })
)
