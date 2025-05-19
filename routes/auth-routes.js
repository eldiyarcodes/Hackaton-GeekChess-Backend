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

/**
 * @swagger
 * /api/v1/auth/sign-up:
 *   post:
 *     tags: [Auth]
 *     summary: Регистрация нового пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [login, telephone]
 *             properties:
 *               login:
 *                 type: string
 *                 example: login123
 *               telephone:
 *                 type: string
 *                 example: +996550101010
 *     responses:
 *       200:
 *         description: Пользователь успешно зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 player:
 *                   type: object
 *                 token:
 *                   type: string
 *                 bitrix:
 *                   type: object
 *       409:
 *         description: Пользователь уже существует
 */
router.post('/sign-up', validationSchema, controller.signUp)
router.post('/sign-in', validationSchema, controller.signIn)
router.get('/players', authMiddleware, controller.getPlayers)

module.exports = router
