import { model, Schema } from "mongoose"

const MessageSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	date: { type: Date, default: Date.now },
	content: String,
	title: String
})

const Message = model("Message", MessageSchema)
export {Message}