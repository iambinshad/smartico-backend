import mongoose from 'mongoose'
const Objectid = mongoose.Types.ObjectId

const gigSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    overview: {
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
    },
    vendorId: {
        type: Objectid,
        ref: "Vendor"
    },
    category: {
        type: Objectid,
        ref: "Category"
    },
    image: {
        type: String,
    },
    type: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

const Gig = mongoose.model('Gig', gigSchema)

export default Gig