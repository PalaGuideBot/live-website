import vine from '@vinejs/vine'

export const minecraftItemValidator = vine.compile(
  vine.object({
    name: vine.string(),
    url: vine.string(),
  })
)
