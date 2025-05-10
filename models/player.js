const { Schema, model } = require('mongoose')

const Player = new Schema({
	login: { type: String, unique: false, required: true },
	telephone: { type: String, unique: true, required: true },
	score: { type: Number, default: 0 }
})

module.exports = model('Player', Player)
