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
					.status(400)
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
			console.log('err: ', e)
			res.status(500).json({ message: 'Ошибка при регистрации' })
		}
	}

	async getPlayers(req, res) {
		try {
			const players = await Player.find()

			res.json({ data: players })
		} catch (e) {
			console.log('err: ', e)
			res.status(500).json({ message: 'Ошибка при получении списка игроков' })
		}
	}
}

module.exports = new AuthController()
