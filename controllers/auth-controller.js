const Player = require('../models/player')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args))

const generateAccessToken = id => {
	const payload = { id }

	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' })
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
			res.status(500).json({ message: 'Ошибка при регистрации', error: e })
		}
	}

	async signIn(req, res) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json({ message: 'Ошибка при входе', errors })
			}

			const { login, telephone } = req.body
			const player = await Player.findOne({ login, telephone })

			if (!player) {
				return res.status(404).json({ message: 'Пользователь не найден' })
			}

			const token = generateAccessToken(player._id)

			return res.json({
				status: 'success',
				message: 'Авторизация прошла успешно',
				token,
			})
		} catch (error) {
			console.log('err with login: '.error)
			res.status(500).json({ message: 'Ошибка при входе' })
		}
	}

	async getPlayers(req, res) {
		try {
			const players = await Player.find()

			res.json({ status: 'success', data: players })
		} catch (e) {
			res.status(500).json({ message: 'Ошибка при получении списка игроков' })
		}
	}
}

module.exports = new AuthController()
