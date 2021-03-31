import jwt, { TokenExpiredError } from 'jsonwebtoken'
// import _ from 'lodash'
import User from '../models/user'
import log from '../lib/logger'
import redis from '../lib/redis'
import axios from 'axios'
import {
	UNAUTHORIZED_REQUEST,
	DATABASE_ERROR,
	CACHE_ERROR,
	UNAUTHORIZED, // 401
	SERVER_ERROR, // 500
	FB_QUERY_ACCESS_TOKEN_FAILED,
	FB_QUERY_USER_ID_FAILED,
	FB_QUERY_EMAIL_FAILED,
} from '../lib/codes'

import { ServerError, AuthError } from '../lib/errors'

const {
	APP_NAME,
  JWT_SECRET,
  JWT_EXPIRE,
	GOOGLE_USERAPI,
	// GOOGLE_CLIENT_ID,
	// GOOGLE_CLIENT_SECRET,
	// GOOGLE_REDIRECT_URL,
	// GOOGLE_AUTH_URL,
	// GOOGLE_SCOPE,
	FB_CLIENT_ID,
	FB_CLIENT_SECRET,
	FB_REDIRECT_URL,
	FB_AUTH_URL,
	FB_TOKEN_API,
	FB_USER_API,
	FB_PROFILE_API
} = process.env

/**
 * login with user object
 * @param {object} user {firstName, lastName, email}
 * return {user: user, token: token}
 */
const login = async (u) => {
	// save user if it is not in database
	try {
		var savedUser = await User.findOne({ email: u.email })

		if (!savedUser) {
			savedUser = await new User(u).save()
		}
	} catch (err) {
		log.error(`server auth login, database error=${err}`)
		throw new Error(DATABASE_ERROR)
	}

	// refresh user jwt token in redis. key=f(email), value=token
	// TODO: notify other client user signed in form other app
	//let user = _.assign(u, { id: savedUser.id })
	let user = { ...u, id: savedUser.id }
	log.debug(`server auth login, saved user =>${JSON.stringify(user)}`)

	try {
		const token = jwt.sign(user, JWT_SECRET, {
			expiresIn: JWT_EXPIRE,
		})
		const key = `${APP_NAME}:auth:${user.email}`
		
		await redis.set(key, token)
		return { user: user, token: token }
	} catch (err) {
		log.error(`server auth login, cache error=${err}`)
		throw new Error(CACHE_ERROR)
	}
}

/**
 * query google userinfo api to get user data
 * @param {string} token - google access token
 */
const googleLogin = async (token) => {
	const res = await axios({
		method: 'get',
		url: GOOGLE_USERAPI,
		// headers: { Authorization: 'Bearer ' + token },
	})
	const { given_name, family_name, email } = res.data

	log.trace(
		`query google userinfo api success, return email=${email} first_name=${given_name}`
	)

	return await login({
		firstName: given_name,
		lastName: family_name,
		email: email,
	})
}

/**
 * query graph.facebook.com to get access_token, user-id and email
 * @param {string} code
 */
const facebookLogin = async (code) => {
	const access_token = await getFbAccessToken(code)
	const userId = await getFbUserId(access_token)
	const profile = await getFbProfile(access_token, userId)
	const { first_name, last_name, email } = profile

	return await login({
		firstName: first_name,
		lastName: last_name,
		email: email,
	})
}

/**
 * GET https://graph.facebook.com/v8.0/oauth/access_token?
   client_id={app-id}
   &redirect_uri={redirect-uri}
   &client_secret={app-secret}
	 &code={code-parameter}
	 redirect_uri=${redirect_uri}&
 * @param {string} code 
 */
const getFbAccessToken = async (code) => {
	try {
		const redirect_uri = encodeURIComponent(FB_REDIRECT_URL)
		const url = `${FB_TOKEN_API}?client_id=${FB_CLIENT_ID}&redirect_uri=${redirect_uri}&client_secret=${FB_CLIENT_SECRET}&code=${code}`
		const res = await axios.get(url)
		log.trace(`fb acc_token=${res.data.access_token}`)
		return res.data.access_token
	} catch (err) {
		log.error(`Query facebook accesstoken failed, code=${code}, err=${err}`)
		throw new Error(FB_QUERY_ACCESS_TOKEN_FAILED)
	}
}

/**
 * GET https://graph.facebook.com/me?scope=email&access_token={access_token}
 *
 * @param {string} token
 */
const getFbUserId = async (token) => {
	try {
		const url = `${FB_USER_API}?access_token=${token}`
		const res = await axios.get(url)
		log.trace(`user id data = ${JSON.stringify(res.data)}`)
		return res.data.id
	} catch (err) {
		log.error(`Query facebook user id failed, err=${err}`)
		throw new Error(FB_QUERY_USER_ID_FAILED)
	}
}

/**
 * https://graph.facebook.com/v8.0/{person-id}/?access_token={app-token-or-admin-token}
 * @param {string} token
 * @param {string} userId
 */
const getFbProfile = async (token, userId) => {
	try {
		const url = `${FB_PROFILE_API}/${userId}/?access_token=${token}`
		const res = await axios.get(url)
		log.trace(`profile data = ${JSON.stringify(res.data)}`)
		return res.data
	} catch (err) {
		log.error(`Query facebook profile failed, err=${err}`)
		throw new Error(FB_QUERY_PROFILE_FAILED)
	}
}

/**
 * decode/verify token
 * @param {String} token
 * return User {id, firstName, lastName, email}
 */
const decodeToken = async (token) => {
	try {
		return jwt.verify(token, JWT_SECRET)
	} catch (err) {
		log.error(`Decode token failed, error=${err}`)
		if (err instanceof TokenExpiredError) {
			log.error(`Decode token error: JWT_TOKEN_EXPIRED`)
			throw new Error(JWT_TOKEN_EXPIRED)
		} else {
			log.error(`Decode token error: JWT_TOKEN_INVALID`)
			throw new Error(JWT_TOKEN_INVALID)
		}
	}
}

/**
 * check if user session in redis service, key=f(email), value = user
 * @param {string} token
 * return true if session in redis
 */
const isAuthenticated = async (token) => {
	const user = await decodeToken(token)

	const key = `${APP_NAME}:auth:${user.email}`

	const jwt_token = await redis.get(key)
	// user not authenticated, if email not in redis
	if (!jwt_token) {
		log.error(`server isAuthenticated() error, key:${key} is not in cache`)
		throw new Error(JWT_TOKEN_INVALID)
	}

	// token must match redis token
	if (jwt_token !== token) {
		log.error(
			`server isAuthenticated() error, jwt_token:${jwt_token} not match.`
		)
		throw new Error(JWT_TOKEN_INVALID)
	} else {
		return { user: user, token: token }
	}
}

/**
 * logout user by user id
 * @param {object} user fetched from jwt token
 * @param {string} id - user id
 */
const logout = async (user) => {
	if (!user) {
		throw new AuthError(UNAUTHORIZED_REQUEST, UNAUTHORIZED)
	}
	const key = `${APP_NAME}:auth:${user.email}`
	try {
		return await redis.del(key)
	} catch (err) {
		log.error(`logout() err=${err}`)
		throw new ServerError(CACHE_ERROR, SERVER_ERROR)
	}
}

/**
 * parse http header to get user object
 * return User {id, firstName, lastName, email}
 */
// const decodeJwt = (req) => {
// 	try {
// 		const authHeader = req.get('Authorization')
// 		log.trace(`authHeader =${authHeader}`)
// 		const tokenArray = authHeader.split(' ')
// 		const token = tokenArray[1]
// 		return jwt.verify(token, cfg.jwt.secret)
// 	} catch (err) {
// 		log.error(`Decode token failed, error=${err}`)
// 		if (err instanceof TokenExpiredError) {
// 			log.error(`Decode token error: JWT_TOKEN_EXPIRED`)
// 			throw new Error(JWT_TOKEN_EXPIRED)
// 		} else {
// 			log.error(`Decode token error: JWT_TOKEN_INVALID`)
// 			throw new Error(JWT_TOKEN_INVALID)
// 		}
// 	}
// }

export { logout, login, isAuthenticated, googleLogin, facebookLogin }
