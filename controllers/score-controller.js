const Player = require('../models/player')

class ScoreController {
	async updateScore(req, res) {
		// #swagger.tags = ['Score']
  	// #swagger.description = 'Обновление score игрока'

		/* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          id: '6822090b675832c7ee5dfa09',
          score: '1500'
        }
		} */

			/* #swagger.responses[200] = {
					schema: {
						status: "success",
						message: "Результат сохранён",
						data: [
							{
								"_id": "6822090b675832c7ee5dfa09",
								"login": "login123",
								"telephone": "+996550101010",
								"score": 1500
							}
						]
					}
		} */
	
		/* #swagger.responses[500] = {
					schema: {
						message: "Ошибка при обновлении score",
					}
		} */

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

			return res.json({ 
				status: 'success', 
				message: 'Результат сохранён', 
				data: topPlayers 
			})
		} catch (e) {
			console.log('err: ', e)
			res.status(500).json({ message: 'Ошибка при обновлении score' })
		}
	}

	async getTopPlayers(req, res) {
		// #swagger.tags = ['Score']
  	// #swagger.description = 'Топ 10 игрков'

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

		/* #swagger.responses[500] = {
					schema: {
						message: "Ошибка при получении списка игроков",
					}
		} */

		try {
			const topPlayers = await Player.find()
				.sort({ score: -1 })
				.limit(10)
				.select('login telephone score')

			return res.json({ status: 'success', data: topPlayers })
		} catch (e) {
			console.log('err: ', e)
			res.status(500).json({ message: 'Ошибка при получении списка игроков' })
		}
	}
}

module.exports = new ScoreController()
