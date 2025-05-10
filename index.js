const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./routes/auth-routes')
const gameRouter = require('./routes/score-routes')

const PORT = process.env.PORT || 5000
const DB_URL =
	'mongodb+srv://thedolbekov2:wyEJ6g89NWltJrh4@cluster0.jlrv6ho.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

const app = express()

app.use(express.json())
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/score', gameRouter)

const start = async () => {
	try {
		await mongoose.connect(DB_URL)
		app.listen(PORT, () => console.log(`server started on port ${PORT}`))
	} catch (e) {
		console.log('error: ', e)
	}
}

start()
