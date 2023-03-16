import fileUploader from "../Cloudinary/fileUploader.mjs";
import Booking from "../Model/bookingModel.mjs";
import Category from "../Model/categoryModel.mjs";
import Gig from "../Model/gigModel.mjs";
import Message from "../Model/messageModel.mjs";
import Vendor from "../Model/vendorModel.mjs"
import vendorReview from "../Model/vendorReviewModel.mjs";
import catchAsync from "../utils/catchAsync.mjs"

export const vendorProfile = catchAsync(async (req, res, next) => {
    const vendorId = req.vendor._id
    const profile = await Vendor.findOne({ _id: vendorId })
    res.status(200).json({
        status: "success",
        data: {
            profile
        }
    })
})

export const vendorAuth = catchAsync(async (req, res, next) => {
    const vendorId = req.params.id
    const userData = await Vendor.findOne({ _id: vendorId })
    res.status(200).json({
        status: "success",
        userData
    })
})

export const updateVendorAddress = catchAsync(async (req, res, next) => {
    console.log(req.params.id);
    let { pincode, country, currentAddress, city, state } = req.body
    await Vendor.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            'address.pincode': pincode,
            'address.country': country,
            'address.currentAddress': currentAddress,
            'address.city': city,
            'address.state': state
        }
    }, { multi: true })
    res.status(200).json({
        status: "success"
    })
})

export const updateVendorSkills = catchAsync(async (req, res, next) => {
    console.log(req.params.id);
    let { skill, googleDrive, linkedIn, github, about, profilePhoto } = req.body
    const file = await fileUploader(profilePhoto)
    console.log(file);
    await Vendor.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            skill,
            googleDrive,
            linkedIn,
            github,
            about,
            profilePhoto: file
        }
    }, { multi: true })
    res.status(200).json({
        status: "success"
    })
})

export const updateVendorProfile = catchAsync(async (req, res, next) => {
    const vendorId = req.vendor._id
    let { userName, mobile, upiId, skill, dob, gender, googleDrive, linkedIn, github, about, profilePhoto, country, currentAddress, city, state } = req.body
    const file = await fileUploader(profilePhoto)
    console.log(file);
    await Vendor.findOneAndUpdate({ _id: vendorId }, {
        $set: {
            userName,
            mobile,
            upiId,
            dob,
            gender,
            skill,
            googleDrive,
            linkedIn,
            github,
            about,
            profilePhoto: file,
            'address.country': country,
            'address.currentAddress': currentAddress,
            'address.city': city,
            'address.state': state
        }
    }, { multi: true })
    res.status(200).json({
        status: "success"
    })
})

export const showAllCategory = catchAsync(async (req, res, next) => {
    const categories = await Category.find().sort({ date: -1 })
    res.status(200).json({
        status: 'success',
        data: {
            categories
        }
    })
})

export const bookings = catchAsync(async (req, res, next) => {
    const vendorId = req.vendor._id
    const reserved = await Booking.find({ vendorId }).populate("gigId").populate("userId").sort({ date: -1 })
    res.status(200).json({
        status: "success",
        data: {
            reserved
        }
    })
})

export const viewGigs = catchAsync(async (req, res, next) => {
    const vendorId = req.vendor._id
    const viewGig = await Gig.find({ vendorId }).populate("category").sort({ date: -1 })
    res.status(200).json({
        status: "success",
        data: {
            viewGig
        }
    })
})

export const deleteGig = catchAsync(async (req, res, next) => {
    await Gig.findByIdAndDelete({ _id: req.params.id })
    res.status(200).json({
        status: "Success"
    })
})

export const vendorRatings = catchAsync(async (req, res, next) => {
    const vendorId = req.vendor._id
    const review = await vendorReview.find({ vendorId: vendorId }).populate("userId").sort({ date: -1 })
    res.status(200).json({
        status: "success",
        data: {
            review
        }
    })
})

export const updateVendorGigs = catchAsync(async (req, res, next) => {
    let { title, overview, description, price, category, type, gigImage, gigId } = req.body.data
    const file = await fileUploader(gigImage)
    console.log(file);
    await Gig.findOneAndUpdate({ _id: gigId }, {
        $set: {
            title,
            overview,
            description,
            price,
            category,
            image: file,
            type,
        }
    }, { multi: true })
    res.status(200).json({
        status: "success"
    })
})

export const cancelUserOrder = catchAsync(async (req, res, next) => {
    const orderId = req.body.orderId
    await Booking.findOneAndUpdate({ _id: orderId }, { $set: { status: "Cancelled" } })
    res.status(200).json({
        status: "success"
    })
})

export const completeUserOrder = catchAsync(async (req, res, next) => {
    const orderId = req.body.orderId
    await Booking.findOneAndUpdate({ _id: orderId }, { $set: { status: "Completed" } })
    res.status(200).json({
        status: "success"
    })
})

export const vendorDashboardCount = catchAsync(async (req, res, next) => {
    const vendorId = req.vendor._id
    const gigsCount = await Gig.countDocuments({ vendorId: vendorId })
    const msgCount = await Message.countDocuments({ chatUsers: vendorId.toString(), sender: { $ne: vendorId }, read: false });
    const orderCount = await Booking.countDocuments({ vendorId: vendorId })
    const reviewCount = await vendorReview.countDocuments({ vendorId: vendorId })
    res.status(200).json({
        gigsCount,
        msgCount,
        orderCount,
        reviewCount,
    })
})

export const fetchOrders = catchAsync(async (req, res, next) => {
    const vendorId = req.vendor._id
    const vendorOrders = await Booking.find({ vendorId: vendorId }).sort({ date: -1 }).limit(7)
    res.status(200).json({
        vendorOrders
    })
})

export const completedOrder = catchAsync(async (req, res, next) => {
    const vendorId = req.vendor._id
    const completedOrders = await Booking.aggregate([
        {
            $match: { vendorId: vendorId, status: "Completed" }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$updatedAt" },
                    month: { $month: "$updatedAt" },
                    day: { $dayOfMonth: "$updatedAt" }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ])
    res.status(200).json({
        completedOrders
    })
})