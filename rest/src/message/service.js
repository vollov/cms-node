import { Message } from '../models/message'
import { DATABASE_ERROR } from '../lib/codes'
import log from '../lib/logger'

/**
 * Note:
 *  - use exec() so the stack trace will print the file name that throw error
 *  - use async syntax to catch exceptions
 */

 const all = async () => {
	try{
		return await Message.find({})
			.sort({ date: 1 }) //Sort by name Added ASC
			.exec()
	} catch(err){
		log.error(`all message error: ${err}`)
		throw new Error(DATABASE_ERROR)
	}
}

const list = async (uid) => {
	log.debug(`list messages by uid=${uid}`)
	try{
		return await Message.find({user: uid})
			.sort({ date: 1 }) //Sort by name Added ASC
			.exec()
	} catch(err){
		log.error(`list message error: ${err}`)
		throw new Error(DATABASE_ERROR)
	}
}

const add = async (data) => {
	try{
		return await new Message(data).save()
	} catch(err){
		log.error(`add message error: ${err}`)
		throw new Error(DATABASE_ERROR)
	}
}

const remove = async (id) => {
	try{
		return await Message.deleteOne({ _id: id }).exec()
	} catch(err){
		log.error(`remove message error: ${err}`)
		throw new Error(DATABASE_ERROR)
	} 
}

const find = async (id) => {
	try{
		return await Message.find({ _id: id }).exec()
	} catch(err){
		log.error(`find message error: ${err}`)
		throw new Error(DATABASE_ERROR)
	}
}

const update = async (id, data) => {
	try{
		return await Message.findByIdAndUpdate(id, data, { new: true }).exec()
	} catch(err){
		log.error(`update message error: ${err}`)
		throw new Error(DATABASE_ERROR)
	}
}

const insertMany = async (data) => {

	try{
		return await Message.collection.insertMany(data)
	} catch(err){
		log.error(`bulk write message error: ${err}`)
		throw new Error(DATABASE_ERROR)
	}
}

export {all, list, add, find, update, remove, insertMany }