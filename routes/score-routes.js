const Router = require('express')
const controller = require('../controllers/score-controller')
const authMiddleware = require('../middleware/auth-middleware')

const router = new Router()

router.post('/update-score', authMiddleware, controller.updateScore)
router.get('/top-players', authMiddleware, controller.getTopPlayers)

module.exports = router
