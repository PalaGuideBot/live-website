import { Exception } from '@adonisjs/core/exceptions'
import { errors } from '@vinejs/vine'
import ky, { HTTPError } from 'ky'

import { githubSponsorsValidator } from '#app/github/validators/sponsors'
import type { ApiResponseError } from '#paladium/types'
import env from '#start/env'

class GitHubService {
  protected client = ky.create({
    prefixUrl: 'https://api.github.com',
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${env.get('GITHUB_TOKEN')}`,
    },
  })

  async getSponsors() {
    try {
      const query = `
        query {
          organization(login: "PalaGuideBot") {
            sponsorshipsAsMaintainer(first: 100) {
              totalCount
              nodes {
                sponsorEntity {
                  ... on User {
                    login
                    name
                    avatarUrl
                  }
                  ... on Organization {
                    login
                    name
                    avatarUrl
                  }
                }
                tier {
                  name
                  monthlyPriceInDollars
                }
              }
            }
          }
        }
      `

      const response = await this.client.post('graphql', {
        json: { query },
      })

      const rawData = await response.json()
      const data = await githubSponsorsValidator.validate(rawData)

      if (!data.data?.organization) {
        throw new Exception('Impossible de récupérer les sponsors', {
          status: 500,
          code: 'E_GITHUB_API_ERROR',
        })
      }

      const sponsors = data.data.organization.sponsorshipsAsMaintainer.nodes

      return {
        count: sponsors.length,
        sponsors,
      }
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
      code: data.type ?? 'E_GITHUB_API_ERROR',
    })
  }
  if (error instanceof errors.E_VALIDATION_ERROR) {
    return new Exception('Unable to validate data', {
      code: 'E_GITHUB_API_VALIDATION_ERROR',
      status: 500,
    })
  }
  return new Exception('Internal error', {
    code: 'E_GITHUB_ERROR',
    status: 500,
  })
}

export { GitHubService }
