const Player = require('../models/player')

class ScoreController {
	async updateScore(req, res) {
		try {
			const { id, score } = req.body

			if (!id || typeof score !== 'number') {
				return res.status(400).json({ message: 'Некорректные данные' })
			}

			const player = await Player.findById(id)
			if (!player) {
				return res.status(404).json({ message: 'Игрок не найден' })
			}

			if (score > player.score) {
				player.score = score
				await player.save()
			}

			const topPlayers = await Player.find()
				.sort({ score: -1 })
				.limit(10)
				.select('login telephone score')

			return res.json({ message: 'Результат сохранён', data: topPlayers })
		} catch (e) {
			console.log('err: ', e)
			res.status(500).json({ message: 'Ошибка при обновлении score' })
		}
	}

	async getTopPlayers(req, res) {
		try {
			const topPlayers = await Player.find()
				.sort({ score: -1 })
				.limit(10)
				.select('login telephone score')

			return res.json({ data: topPlayers })
		} catch (e) {
			console.log('err: ', e)
			res.status(500).json({ message: 'Ошибка при получении списка игроков' })
		}
	}
}

module.exports = new ScoreController()
