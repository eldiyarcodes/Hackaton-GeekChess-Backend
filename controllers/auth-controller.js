const Player = require('../models/player')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
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
			const token = generateAccessToken(player._id)

			return res.json({
				status: 'success',
				message: 'Пользователь успешно зарегистрирован',
				player: {
					login: player.login,
					telephone: player.telephone,
				},
				token,
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
