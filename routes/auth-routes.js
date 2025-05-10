const Router = require('express')
const controller = require('../controllers/auth-controller')
const { check } = require('express-validator')

const router = new Router()

router.post(
	'/sign-up',
	[
		check('login', 'Поле Name не может быть пустым').notEmpty(),
		check(
			'telephone',
			'Номер телефона должен быть не менее 6 и не более 12 символов'
		).isLength({ min: 6, max: 12 }),
	],
	controller.signUp 
)

router.get('/players', controller.getPlayers)

module.exports = router
