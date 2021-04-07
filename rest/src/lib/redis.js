import Redis from 'ioredis'
// import dotenv  from "dotenv"
// dotenv.config()
const {
	REDIS_SECRET
} = process.env

const redis = new Redis({ password: REDIS_SECRET })

const set = (key, value) => {
	return redis.set(key, value)
}

const remove = (key) => {
	return redis.del(key)
}

const get = (key) => {
	return redis.get(key)
}

const exists = (key) => {
	return redis.exists(key)
}

/**
 *
 * @param {string} key
 * @param {number} seconds
 */
const expire = (key, seconds) => {
	return redis.expire(key, seconds)
}

const disconnect = () => {
	redis.disconnect()
}

//export { set, get, exists, disconnect, expire, remove };
export default redis
