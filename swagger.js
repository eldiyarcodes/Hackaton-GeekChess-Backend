const swaggerAutogen = require('swagger-autogen')()

const doc = {
	info: {
		title: 'Knight Dash API',
		description: 'API documentation',
	},
	host: 'localhost:5000',
	schemas: ['http'],
}

const outputFile = './swagger-output.json'
const endpointFiles = ['./index.js']

swaggerAutogen(outputFile, endpointFiles, doc).then(() => {
	require('./index.js')
})
