import  express  from 'express'
import { allMessageCount, bookNow, chat, getConnectionsUser, getMessage, login, OTP, reviewGig, reviewVendor, userProtect, verifyOTP }  from '../Controller/authController.mjs'
import { cancelOrder, getAllGigs, getAllVendor, getVendorDetail, gigRating, products, reservedGigs, services, singleGig, updateUserProfile, userAuth, userProfile, vendorRating, viewGigVendor } from '../Controller/userController.mjs'

const router = express.Router()

router
    .route('/login')
    .post(login)
    
router
    .route('/OTP')
    .post(OTP)

router
    .route('/verifyOTP')
    .post(verifyOTP)

router
    .route('/getAllVendors')
    .get(getAllVendor)

router
    .route('/vendorDetails/:id')
    .get(userProtect, getVendorDetail)

router
    .route('/allGigs')
    .get(getAllGigs)

router
    .route('/singleGig/:id')
    .get(userProtect, singleGig)

router
    .route('/services')
    .get(services)

router
    .route('/products')
    .get(products)

router
    .route('/chat')
    .post( chat)

router
    .route('/getMessage/:user1Id/:user2Id')
    .get(getMessage)

router
    .route("/getMessageCount/:userId")
    .get(allMessageCount)

router
    .route('/getUserConnections/:userId')
    .get(userProtect, getConnectionsUser)

router
    .route('/userProfile')
    .get(userProtect, userProfile)

router  
    .route("/updateUserProfile")
    .patch(userProtect, updateUserProfile)

router
    .route('/reserveNow')
    .post(userProtect, bookNow)

router
    .route("/userAuth")
    .get(userProtect, userAuth)

router
    .route("/cancelOrder")
    .patch(userProtect, cancelOrder)

router
    .route("/addReview")
    .post(userProtect, reviewGig)

router
    .route("/gigRating/:gigId")
    .get(userProtect, gigRating)

router
    .route("/reservedGigs")
    .get(userProtect, reservedGigs)

router
    .route("/viewVendorGigs/:vendorId")
    .get(userProtect, viewGigVendor)

router
    .route("/reviewVendor")
    .post(userProtect, reviewVendor)

router
    .route("/vendorRating/:id")
    .get(userProtect, vendorRating)

export default router