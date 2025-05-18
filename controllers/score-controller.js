const Player = require('../models/player')

class ScoreController {
	async updateScore(req, res) {
		try {
			const { id, score } = req.body
			const mode = Number(req.query.mode)

			if (!id || typeof score !== 'number' || ![15, 30, 60].includes(mode)) {
				return res.status(400).json({ message: 'Некорректные данные' })
			}

			const player = await Player.findById(id)
			if (!player) {
				return res.status(404).json({ message: 'Игрок не найден' })
			}

			const scoreField = `score${mode}`

			if (score > player[scoreField]) {
				player[scoreField] = score
				await player.save()
			}

			const topPlayers = await Player.find()
				.sort({ [scoreField]: -1 })
				.limit(10)
				.select(`login telephone ${scoreField}`)

			return res.json({
				status: 'success',
				message: 'Результат сохранён',
				data: topPlayers.map(p => ({
					login: p.login,
					telephone: p.telephone,
					score: p[scoreField],
				})),
			})
		} catch (e) {
			res.status(500).json({ message: 'Ошибка при обновлении score' })
		}
	}

	async getTopPlayers(req, res) {
		try {
			const mode = Number(req.query.mode)

			if (![15, 30, 60].includes(mode)) {
				return res
					.status(400)
					.json({ status: 'error', message: 'Некорректный режим игры' })
			}

			const scoreField = `score${mode}`

			const topPlayers = await Player.find()
				.sort({ [scoreField]: -1 })
				.limit(10)
				.select(`login telephone ${scoreField}`)

			return res.json({
				status: 'success',
				data: topPlayers.map(p => ({
					login: p.login,
					telephone: p.telephone,
					score: p[scoreField],
				})),
			})
		} catch (e) {
			res.status(500).json({ message: 'Ошибка при получении списка игроков' })
		}
	}
}

module.exports = new ScoreController()
