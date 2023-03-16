import mongoose from 'mongoose'
const Objectid = mongoose.Schema.Types.ObjectId

const vendorReviewSchema = new mongoose.Schema({
    userId: {
        type: Objectid,
        ref: 'User'
    },
    vendorId: {
        type: Objectid,
        ref: 'Vendor'
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
    }
})

const vendorReview = mongoose.model('vendorReview', vendorReviewSchema)

export default vendorReview