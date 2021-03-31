import bunyan from 'bunyan'

const {
  APP_NAME,
  APP_LOG_PATH
} = process.env

const log = bunyan.createLogger({
	name: `${APP_NAME}`,
	streams: [
		{
			level: 'debug',
			type: 'rotating-file',
			path: `${APP_LOG_PATH}/${APP_NAME}.log`,
			period: '14d',
			count: 3,
		},
		{
			level: 'trace',
			stream: process.stdout, // log INFO and above to stdout
		},
	],
})

export default log
