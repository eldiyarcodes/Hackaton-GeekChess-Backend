require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./swagger')
const authRouter = require('./routes/auth-routes')
const scoreRouter = require('./routes/score-routes')

const PORT = process.env.PORT || 8080
const DB_URL = process.env.DATABASE_URL

const app = express()

app.use(express.json())
app.use(
	cors({
		origin: ['https://knight-dash.vercel.app', 'http://localhost:5173'],
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	})
)
app.options('*', cors())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/score', scoreRouter)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const start = async () => {
	try {
		await mongoose.connect(DB_URL)
		app.listen(PORT, () => console.log(`server started on port ${PORT}`))
	} catch (e) {
		console.log('error: ', e)
	}
}

start()
