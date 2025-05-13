const Router = require('express')
const controller = require('../controllers/auth-controller')
const { check } = require('express-validator')
const authMiddleware = require('../middleware/auth-middleware')

const router = new Router()

const validationSchema = [
	check('login', 'Поле Name не может быть пустым').notEmpty(),
	check(
		'telephone',
		'Номер телефона должен быть не менее 6 и не более 12 символов'
	).isLength({ min: 6, max: 13 }),
]

router.post('/sign-up', validationSchema, controller.signUp)
router.post('/sign-in', validationSchema, controller.signIn)
router.get('/players', authMiddleware, controller.getPlayers)

module.exports = router
