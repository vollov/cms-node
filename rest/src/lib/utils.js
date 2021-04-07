import _ from 'lodash'
// import log from './logger'

const whiteTable = {
	GET: [
		/\/api\/auth\/google\/login\/*/,
		/\/api\/pages\/*/,
		/\/api\/auth\/foo/
	],
	POST: [/\/api\/auth\/login/]
}

export const publicAPI = (method, path) => {
	const checkList = whiteTable[method]
	// const r = _.some(checkList, (item) => {
	// 	log.debug(`check item =${item} with ${path}`)
	// 	return item.test(path)
	// })
	// log.debug(`publicAPI r =${r} with ${path}`)
	// return r
	return _.some(checkList, (item) => {return item.test(path)})
}
