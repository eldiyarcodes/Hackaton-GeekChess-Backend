const Router = require('express')
const controller = require('../controllers/score-controller')

const router = new Router()

router.post('/update-score', controller.updateScore)
router.get('/top-players', controller.getTopPlayers)

module.exports = router
