import { dailyEvents } from '#app/event/contents/events'
import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  async handle({ inertia }: HttpContext) {
    return inertia.render('home/index', { events: dailyEvents })
  }
}
