import  express  from 'express'
import { allMessageCountVendor, getConnections, vendorGig, vendorLogin, vendorOTP, vendorProtect, verifyVendorOTP }  from '../Controller/authController.mjs'
import { bookings, cancelUserOrder, completedOrder, completeUserOrder, deleteGig, fetchOrders, showAllCategory, updateVendorAddress, updateVendorGigs, updateVendorProfile, updateVendorSkills, vendorAuth, vendorDashboardCount, vendorProfile, vendorRatings, viewGigs } from '../Controller/vendorController.mjs'

const router = express.Router()

router
    .route('/login')
    .post(vendorLogin)

router
    .route('/vendorOTP')
    .post(vendorOTP)

router
    .route('/verifyVendorOTP')
    .post(verifyVendorOTP)

router
    .route('/vendorProfile')
    .get(vendorProtect, vendorProfile)

router
    .route("/vendorAuth/:id")
    .get(vendorProtect, vendorAuth)

router
    .route("/updateVendorProfile")
    .patch(vendorProtect, updateVendorProfile)

router  
    .route('/addAddress/:id')
    .patch(updateVendorAddress)

router
    .route('/addSkill/:id')
    .patch(updateVendorSkills)

router
    .route('/newGig')
    .post(vendorProtect, vendorGig)

router  
    .route("/deleteGig/:id")
    .delete(vendorProtect, deleteGig)

router
    .route('/categories')
    .get(vendorProtect, showAllCategory)

router
    .route('/getConnections/:vendorId')
    .get(vendorProtect, getConnections)

router
    .route('/bookedGigs')
    .get(vendorProtect, bookings)

router
    .route("/viewGigs")
    .get(vendorProtect, viewGigs)

router
    .route("/viewVendorRating")
    .get(vendorProtect, vendorRatings)

router
    .route("/updateVendorGig")
    .patch(vendorProtect, updateVendorGigs)

router
    .route("/cancelUserOrder")
    .patch(vendorProtect, cancelUserOrder)

router
    .route("/getVendorMessageCount/:vendorId")
    .get(allMessageCountVendor)

router
    .route("/completeUserOrder")
    .patch(vendorProtect, completeUserOrder)

router
    .route('/vendorDasboardCount')
    .get(vendorProtect, vendorDashboardCount)

router
    .route('/fetchAllOrders')
    .get(vendorProtect, fetchOrders)

router
    .route("/completed-orders-by-date")
    .get(vendorProtect, completedOrder)

export default router