const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
	if (req.method === 'OPTIONS') {
		next()
	}

	try {
		const token = req.headers.authorization.split(' ')[1]
		if (!token) {
			return res.status(401).json({
				status: 'error',
				message: 'Пользователь не авторизован',
			})
		}

		const decodedData = jwt.verify(token, process.env.JWT_SECRET)
		req.user = decodedData
		next()
	} catch (e) {
		return res
			.status(401)
			.json({ status: 'error', message: 'Пользователь не авторизован' })
	}
}
