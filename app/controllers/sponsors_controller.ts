import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { GitHubService } from '#app/github/services/api'

@inject()
export default class GithubSponsorsController {
  constructor(private githubService: GitHubService) {}

  public async index({ response }: HttpContext) {
    const sponsors = await this.githubService.getSponsors()

    return response.ok(sponsors)
  }
}
