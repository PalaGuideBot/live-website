import vine from '@vinejs/vine'

export const factionQuestValidator = vine.compile(
  vine.object({
    item: vine.string(),
    quantity: vine.number(),
    earningMoney: vine.number(),
    earningXp: vine.number(),
    start: vine.number(),
    end: vine.number(),
  })
)

export const factionOnYourMarksValidator = vine.compile(
  vine.object({
    goalType: vine.enum([
      'BREAK_BLOCKS',
      'MOB_KILL',
      'FISHING',
      'WALK',
      'ITEM_CRAFT',
      'ITEM_SMELT',
      'ITEM_CRAFT_PALAMACHINE',
      'ITEM_ENCHANT',
      'GRINDER_CRAFT',
      'GRINDER_SMELT',
      'USE_ITEM',
    ]),
    extra: vine.string().nullable(),
    amount: vine.number(),
    rewardElo: vine.number(),
    serverType: vine.enum(['LOBBY', 'FACTION', 'MINAGE', 'FARMLAND', 'GAME', 'DIM_MINER']),
    start: vine.number(),
    end: vine.number(),
    state: vine.enum(['NOT_STARTED', 'RUNNING', 'FINISHED']),
  })
)
