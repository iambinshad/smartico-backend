import mongoose from "mongoose";
import fileUploader from "../Cloudinary/fileUploader.mjs";
import Booking from "../Model/bookingModel.mjs";
import Gig from "../Model/gigModel.mjs";
import Review from "../Model/reviewModel.mjs";
import User from "../Model/userModel.mjs";
import Vendor from "../Model/vendorModel.mjs"
import vendorReview from "../Model/vendorReviewModel.mjs";
import catchAsync from "../utils/catchAsync.mjs"

export const getAllVendor = catchAsync(async (req, res, next) => {
  const allVendors = await Vendor.find()
  res.status(200).json({
    status: 'success',
    data: {
      allVendors
    }
  });
})

export const getVendorDetail = catchAsync(async (req, res) => {
  const vendorDetails = await Vendor.findOne({ _id: req.params.id })
  res.status(200).json({
    status: 'success',
    data: {
      vendorDetails
    }
  });
})

export const getAllGigs = catchAsync(async (req, res, next) => {
  const allGigs = await Gig.find().sort({ date: -1 })
  res.status(200).json({
    status: "success",
    data: {
      allGigs
    }
  })
})

export const singleGig = catchAsync(async (req, res, next) => {
  const gigId = req.params.id
  const singleGig = await Gig.findOne({ _id: gigId }).populate('vendorId')
  res.status(200).json({
    status: "success",
    data: {
      singleGig
    }
  })
})

export const userAuth = catchAsync(async(req, res, next) => {
  const userId = req.user._id
  const userData = await User.findOne({  _id: userId })
  res.status(200).json({
    status: "success",
    userData
  })
})

export const services = catchAsync(async (req, res, next) => {
  const services = await Gig.find({ type: "Service" }).sort({ date: -1 })
  res.status(200).json({
    status: "success",
    data: {
      services
    }
  })
})

export const products = catchAsync(async (req, res, next) => {
  const products = await Gig.find({ type: "Product" }).sort({ date: -1 })
  res.status(200).json({
    status: "success",
    data: {
      products
    }
  })
})

export const userProfile = catchAsync(async (req, res, next) => {
  const user = req.user
  console.log(user);
  const profile = await User.findOne({ _id: user._id })
  res.status(200).json({
    status: "success",
    data: {
      profile
    }
  })
})

export const gigRating = catchAsync(async (req, res, next) => {
  const gigId = req.params.gigId
  console.log(gigId);
  const review = await Review.find({ gigId: gigId }).populate("gigId").populate("userId").sort({ date: -1 })
  res.status(200).json({
    status: "success",
    data: {
      review
    }
  })
})

export const reservedGigs = catchAsync(async (req, res, next) => {
  const userId = req.user._id
  const reserved = await Booking.find({ userId }).populate("gigId").sort({ date: -1 })
  res.status(200).json({
    status: "success",
    data: {
      reserved
    }
  })
})

export const viewGigVendor = catchAsync(async (req, res, next) => {
  const vendorId = req.params.vendorId
  const viewGig = await Gig.find({ vendorId }).populate("category").sort({ date: -1 })
  res.status(200).json({
    status: "success",
    data: {
      viewGig
    }
  })
})

export const vendorRating = catchAsync(async (req, res, next) => {
  const vendorId = req.params.id
  const review = await vendorReview.find({ vendorId: vendorId }).populate("vendorId").populate("userId").sort({ date: -1 })
  res.status(200).json({
    status: "success",
    data: {
      review
    }
  })
})

export const updateUserProfile = catchAsync(async (req, res, next) => {
  const userId = req.user._id
  let { userName, dob, gender, phone, location, profilePhoto } = req.body
  const file = await fileUploader(profilePhoto)
  console.log(file);
  await User.findOneAndUpdate({ _id: userId }, {
    $set: {
      userName,
      dob,
      gender,
      phone,
      location,
      profilePhoto: file
    }
  }, { multi: true })
  res.status(200).json({
    status: "success"
  })
})

export const cancelOrder = catchAsync(async(req, res, next) => {
  const orderId = req.body.orderId
  await Booking.findOneAndUpdate({ _id: orderId }, { $set: { status: "Cancelled" } })
  res.status(200).json({
    status: "success"
  })
})