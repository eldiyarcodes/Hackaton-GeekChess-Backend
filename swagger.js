const swaggerJSDoc = require('swagger-jsdoc')

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Knight Dash API',
			version: '1.0.0',
			description: 'API документация для Knight Dash',
		},
		servers: [
			{
				url: 'http://localhost:8080',
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
	},
	apis: ['./routes/*.js'],
}

const swaggerSpec = swaggerJSDoc(options)
module.exports = swaggerSpec
