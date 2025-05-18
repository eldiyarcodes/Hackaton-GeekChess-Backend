const { Schema, model } = require('mongoose')

const Player = new Schema({
	login: { type: String, unique: false, required: true },
	telephone: { type: String, unique: true, required: true },
	score15: { type: Number, default: 0 },
	score30: { type: Number, default: 0 },
	score60: { type: Number, default: 0 }
})

module.exports = model('Player', Player)
