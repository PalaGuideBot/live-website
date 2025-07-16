import router from '@adonisjs/core/services/router'
import transmit from '@adonisjs/transmit/services/main'

const HomeController = () => import('#controllers/home_controller')

transmit.registerRoutes()

router.get('/', [HomeController])
