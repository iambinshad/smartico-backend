import mongoose from 'mongoose'
const Objectid = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({
    userId: {
        type: Objectid,
        ref: 'User'
    },
    gigId: {
        type: Objectid,
        ref: 'Gig'
    },
    rating: {
        type: Number
    },
    title: {
        type: String
    },
    description: {
        type: String        
    },
    date: {
        type: Date,
        default: Date.now()
    },
})

const Review = mongoose.model('Review', reviewSchema)

export default Review