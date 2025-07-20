import router from '@adonisjs/core/services/router'
import transmit from '@adonisjs/transmit/services/main'

const HomeController = () => import('#controllers/home_controller')
const PaladiumController = () => import('#paladium/controllers/paladium')
const GithubSponsorsController = () => import('#controllers/sponsors_controller')

transmit.registerRoutes()

router.get('/', [HomeController])

router.get('/paladium/faction/qdf', [PaladiumController, 'factionQuest'])
router.get('/paladium/faction/avm', [PaladiumController, 'factionOnYourMarks'])
router.get('/paladium/faction/leaderboard', [PaladiumController, 'fationLeaderboard'])

router.get('/paladium/leaderboard/:category', [PaladiumController, 'leaderboardByCategory'])

router.get('/github/sponsors', [GithubSponsorsController, 'index'])
