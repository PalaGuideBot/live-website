import vine from '@vinejs/vine'

const sponsorEntityValidator = vine.object({
  login: vine.string(),
  name: vine.string(),
  avatarUrl: vine.string(),
})

const tierValidator = vine.object({
  name: vine.string(),
  monthlyPriceInDollars: vine.number(),
})

const sponsorValidator = vine.object({
  sponsorEntity: sponsorEntityValidator,
  tier: tierValidator,
})

export const githubSponsorsValidator = vine.compile(
  vine.object({
    data: vine
      .object({
        organization: vine
          .object({
            sponsorshipsAsMaintainer: vine.object({
              nodes: vine.array(sponsorValidator),
            }),
          })
          .nullable(),
      })
      .nullable(),
  })
)
