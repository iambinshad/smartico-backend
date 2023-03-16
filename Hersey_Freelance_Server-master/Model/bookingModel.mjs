import mongoose from 'mongoose'
const Objectid = mongoose.Types.ObjectId

const bookingSchema = new mongoose.Schema({
    userId: {
        type: Objectid,
        ref: 'User'
    },
    title: {
        type: String
    },
    requirements: {
        type: String
    },
    vendorId: {
        type: Objectid,
        ref: 'Vendor'
    },
    gigId: {
        type: Objectid,
        ref: 'Gig'
    },
    status: {
        type: String,
        default: 'Reserved'
    },
    date: {
        type: Date,
        default: Date.now()
    }
},  { timestamps: true })

const Booking = mongoose.model('Booking', bookingSchema)

export default Booking