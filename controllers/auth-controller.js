const Player = require('../models/player')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args))

const { secret } = require('../config')

const generateAccessToken = id => {
	const payload = { id }

	return jwt.sign(payload, secret, { expiresIn: '24h' })
}

class AuthController {
	async signUp(req, res) {
		// #swagger.tags = ['Auth']
  	// #swagger.description = 'Регистрация нового пользователя'

		/* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          login: 'login123',
          telephone: '+996550101010'
        }
		} */

			/* #swagger.responses[200] = {
					schema: {
					"status": "success",
					"message": "Пользователь успешно зарегистрирован",
					"player": {
						"_id": "6822090b675832c7ee5dfa09",
						"login": "login123",
						"telephone": "+996550101010"
					},
					"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVF9UHjbh2_703vsqM....",
					"bitrix": {
						"result": 438106,
						"time": {
							"start": 1747061003.976503,
							"finish": 1747061004.325477,
							"duration": 0.34897398948669434,
							"processing": 0.32679295539855957,
							"date_start": "2025-05-12T17:43:23+03:00",
							"date_finish": "2025-05-12T17:43:24+03:00",
							"operating_reset_at": 1747061603,
							"operating": 0.32677698135375977
						}
					}
				}
		} */

		/* #swagger.responses[409] = {
					schema: {
						message: "Пользователь с таким номером телефона существует"
					}
		} */

		try {
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				return res
					.status(400)
					.json({ message: 'Ошибка при регистрации', errors })
			}

			const { login, telephone } = req.body
			const candidate = await Player.findOne({ telephone })

			if (candidate) {
				return res
					.status(409)
					.json({ message: 'Пользователь с таким номером телефона существует' })
			}

			const player = new Player({ login, telephone })
			await player.save()

			const bitrixResponse = await fetch(
				`https://geektech.bitrix24.ru/rest/1/e08w1jvst0jj152c/crm.lead.add.json`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					body: new URLSearchParams({
						'fields[SOURCE_ID]': '127',
						'fields[NAME]': login,
						'fields[TITLE]': 'GEEKS GAME: Хакатон 2025',
						'fields[PHONE][0][VALUE]': telephone,
						'fields[PHONE][0][VALUE_TYPE]': 'WORK',
					}),
				}
			)

			const bitrixData = await bitrixResponse.json()

			const token = generateAccessToken(player._id)

			return res.json({
				status: 'success',
				message: 'Пользователь успешно зарегистрирован',
				player: {
					_id: player._id,
					login: player.login,
					telephone: player.telephone,
				},
				token,
				bitrix: bitrixData,
			})
		} catch (e) {
			res.status(500).json({ message: 'Ошибка при регистрации' })
		}
	}

	async getPlayers(req, res) {
		// #swagger.tags = ['Auth']
  	// #swagger.description = 'Список всех пользователей'

			/* #swagger.responses[200] = {
					schema: {
						status: "success",
						data: [
							{
								_id: '507f1f77bcf86cd799439011',
								login: 'login123',
								telephone: '+996550101010',
								score: 0
							}
						]
					}
		} */

		try {
			const players = await Player.find()

			res.json({ status: 'success', data: players })
		} catch (e) {
			res.status(500).json({ message: 'Ошибка при получении списка игроков' })
		}
	}
}

module.exports = new AuthController()
