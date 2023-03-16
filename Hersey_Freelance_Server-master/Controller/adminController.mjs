import Category from "../Model/categoryModel.mjs";
import User from "../Model/userModel.mjs";
import Vendor from "../Model/vendorModel.mjs";
import catchAsync from "../utils/catchAsync.mjs";

export const getAllUsers = catchAsync(async( req, res, next ) => {
    const users = await User.find().sort({date: -1})
    res.status(200).json({
        status: 'success',
        data: {
          users
        }
      });
})

export const blockUser = catchAsync(async(req, res, next ) => {
    await User.findOneAndUpdate({ _id: req.body.id }, { $set: { status: "Blocked" } })
    res.status(200).json({
        status: 'success'
    })
})

export const unBlockUser = catchAsync(async(req, res, next ) => {
    await User.findOneAndUpdate({ _id: req.body.id }, { $set: { status: "Active" } })
    res.status(200).json({
        status: 'success'
    })
})

export const getAllVendors = catchAsync(async(req, res, next ) => {
    const vendors = await Vendor.find().sort({date: -1})
    res.status(200).json({
        status: 'success',
        data: {
            vendors
        }
    })
})

export const approveVendor = catchAsync(async(req, res, next ) => {
    await Vendor.findOneAndUpdate({ _id: req.body.id }, { $set: { status: "Approved" } })
    res.status(200).json({
        status: "success"
    })
})

export const blockVendor = catchAsync(async(req, res, next ) => {
    await Vendor.findOneAndUpdate({ _id:req.body.id }, { $set: { status: "Blocked" } })
    res.status(200).json({
        status: "success"
    })
})

export const getVendorDetails = catchAsync(async(req, res, next ) => {
    const vendorDetails = await Vendor.findOne({ _id: req.body.id })
    res.status(200).json({
        status: 'success',
        data: {
            vendorDetails
        }
      });
})

export const getAllCategory = catchAsync( async(req, res, next) => {
    const categories = await Category.find().sort({date: -1})
    res.status(200).json({
        status: 'success',
        data: {
            categories
        }
    })
})

export const deleteCategory = catchAsync(async(req, res, next ) => {
    await Category.findByIdAndDelete({ _id: req.body.id })
    res.status(200).json({
        status: 'success',
      });
})

export const dashboardCount = catchAsync(async(req, res, next) => {
    const unblockedUserCount = await User.countDocuments({ status: "Active" })
    const blockedUserCount = await User.countDocuments({ status: "Blocked" })
    const approvedVendorCount = await Vendor.countDocuments({ status: "Approved" })
    const blockedVendorCount = await Vendor.countDocuments({ status: "Not Approved" })    
    res.status(200).json({
        unblockedUserCount,
        blockedUserCount,
        approvedVendorCount,
        blockedVendorCount
    })
})

export const newUsers = catchAsync(async(req, res, next) => {
    const newUser = await User.find().sort({ date: -1 }).limit(7)
    res.status(200).json({
        newUser
    })
})