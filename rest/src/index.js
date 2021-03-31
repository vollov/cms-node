import express from 'express'
import mongoose from 'mongoose'
import Cors from 'cors'
import favicon from 'serve-favicon'
import path from 'path'
import bodyParser from 'body-parser'
import helmet from 'helmet'

import swaggerUi from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'
import YAML from 'yamljs'

// swagger configuration
const swaggerDefinition = YAML.load(path.join(__dirname, '/swagger/info.yaml'))
const options = {
	swaggerDefinition,
	apis: [path.join(__dirname, '/swagger/**/*.yaml')],
}
const swaggerSpec = swaggerJsDoc(options)

// app routes
import log from './lib/logger'
import { header, authorization } from './auth/middleware'
import auth from './auth/router'
import message from './message/router'

// load configuration from env
const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB,
	APP_CTX,
	APP_PORT
} = process.env

const db_options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
}

// ${MONGO_DB}
const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
log.info(`mongodb url = ${url}`)

const app = express()

//connect MongoDB
mongoose.Promise = global.Promise
// mongoose.set('debug', true)

mongoose.connect(url, db_options);

mongoose.connection.once('open', () =>
	log.info(`Connected to mongo, url = ${url}`)
)

app.use(helmet())
// Enable All CORS Requests
app.use(Cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(__dirname + '/public'))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const authMiddleware = [header, authorization]
app.use('*', authMiddleware)
app.use(`${APP_CTX}auth`, auth)
app.use(`${APP_CTX}messages`, message)

app.listen(APP_PORT, () =>
	log.info(`Server started on port: ${APP_PORT}`)
)

module.exports = app
