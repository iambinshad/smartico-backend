import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    chatUsers: {
        type: Array,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Message = mongoose.model('Message', messageSchema)

export default Message