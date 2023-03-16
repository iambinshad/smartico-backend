import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import catchAsync from '../utils/catchAsync.mjs'
import AppError from '../utils/appError.mjs'
import nodemailer from 'nodemailer'
import User from '../Model/userModel.mjs'
import Admin from '../Model/adminModel.mjs'
import Vendor from '../Model/vendorModel.mjs'
import Gig from '../Model/gigModel.mjs'
import Category from '../Model/categoryModel.mjs'
import Booking from '../Model/bookingModel.mjs'
import Message from '../Model/messageModel.mjs'
import Review from '../Model/reviewModel.mjs'
import fileUploader from '../Cloudinary/fileUploader.mjs'
import vendorReview from '../Model/vendorReviewModel.mjs'

// --------------------------------------------------------------------------------------------------------------
// Email OTP Verify

let fullName
let userName
let email
let phone
let password
let passwordConfirm
let gender
let dob

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: 'Gmail',

    auth: {
        user: 'herseyfreelance23@gmail.com',
        pass: 'dpbquhuveeksnxnb',
    }

});

let otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);

// --------------------------------------------------------------------------------------------------------------

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    //remove the password from the output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'Success',
        token,
        data: {
            user
        }
    });
};

export const OTP = catchAsync(async (req, res, next) => {

    fullName = req.body.fullName,
        userName = req.body.userName,
        email = req.body.email,
        phone = req.body.phone,
        password = req.body.password,
        passwordConfirm = req.body.passwordConfirm;

    const user = await User.findOne({ email: email })

    if (!user) {

        // send mail with defined transport object
        let mailOptions = {
            to: req.body.email,
            subject: "Otp for registration is: ",
            html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            res.status(200).json({
                status: 'success'
            });
        });

    } else {
        res.status(401).json({
            message: 'User with this email already exists!!!'
        });
    }
})

// exports.resendOTP = catchAsync(async(req, res, next) => {
//     var mailOptions={
//        to: email,
//        subject: "Otp for registration is: ",
//        html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
//      };

//      transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.log(error);
//         }
//         console.log('Message sent: %s', info.messageId);   
//         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//         res.render('otp',{msg:"otp has been sent"});
//     });
// })

export const verifyOTP = catchAsync(async (req, res, next) => {
    if (req.body.otp == otp) {
        const newuser = await User.create({
            fullName: fullName,
            userName: userName,
            email: email,
            phone: phone,
            password: password,
            passwordConfirm: passwordConfirm
        });

        createSendToken(newuser, 201, res);
        next()
    }
    else {
        res.status(401).json({
            status: 'failed'
        });
    }
})

export const vendorOTP = catchAsync(async (req, res) => {

    fullName = req.body.fullName,
        userName = req.body.userName,
        email = req.body.email,
        phone = req.body.phone,
        gender = req.body.gender,
        dob = req.body.dob,
        password = req.body.password,
        passwordConfirm = req.body.passwordConfirm;

    const vendor = await Vendor.findOne({ email: email })

    if (!vendor) {

        // send mail with defined transport object
        let mailOptions = {
            to: req.body.email,
            subject: "Otp for registration is: ",
            html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            res.status(200).json({
                status: 'success'
            });
        });

    } else {
        res.status(401).json({
            message: 'User with this email already exists!!!'
        });
    }
})

export const verifyVendorOTP = catchAsync(async (req, res) => {
    if (req.body.otp == otp) {
        const newVendor = await Vendor.create({
            fullName: fullName,
            userName: userName,
            email: email,
            phone: phone,
            gender: gender,
            dob: dob,
            password: password,
            passwordConfirm: passwordConfirm
        });

        createSendToken(newVendor, 201, res);
    }
    else {
        res.status(401).json({
            status: 'failed'
        });
    }
})

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //to check email and password exist
    if (!email || !password) {
        return next(new AppError("wrong information"));
    }

    //to check if user exists and password is correct
    const user = await User.findOne({
        $and: [{ email }, { status: "Active" }],
    }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
        res.json({
            status: "Wrong Password"
        })
    }

    //if everything is correct, send token to user
    createSendToken(user, 201, res);
    next();
});

export const adminLogin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //to check email and password exist
    if (!email || !password) {
        return next(new AppError("wrong information"));
    }

    //to check if admin exists and password is correct
    const admin = await Admin.findOne({
        $and: [{ email }, { status: "Active" }],
    }).select("+password");

    if (!admin || !(await admin.correctPassword(password, admin.password))) {
        res.json({
            status: "Wrong Password"
        })
    }

    //if everything is correct, send token to admin
    createSendToken(admin, 201, res);
    next();
});

export const vendorLogin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //to check email and password exist
    if (!email || !password) {
        return next(new AppError("wrong information"));
    }

    //to check if vendor exists and password is correct
    const vendor = await Vendor.findOne({
        $and: [{ email }, { status: "Approved" }],
    }).select("+password");
    console.log(vendor);

    if (!vendor || !(await vendor.correctPassword(password, vendor.password))) {
        res.json({
            status: "Wrong Password"
        })
    }

    //if everything is correct, send token to vendor
    createSendToken(vendor, 201, res);
    next();
});

export const vendorGig = catchAsync(async (req, res, next) => {
    const file = await fileUploader(req.body.gigImage)
    console.log(file);
    const newGig = await Gig.create({
        title: req.body.title,
        overview: req.body.overview,
        image: file,
        type: req.body.type,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        vendorId: req.body.vendorId
    });
    res.status(200).json({
        status: 'success',
        data: {
            newGig
        }
    });
})

export const addCategory = catchAsync(async (req, res, next) => {
    const newCategory = await Category.create({
        name: req.body.name,
    });
    res.status(200).json({
        status: 'success',
        data: {
            newCategory
        }
    });
});

export const bookNow = catchAsync(async (req, res, next) => {
    const userId = req.user._id
    const data = req.body
    const newBooking = await Booking.create({
        userId,
        vendorId: data.gig.vendorId._id,
        title: data.gig.title,
        requirements: data.requirements,
        gigId: data.gig._id
    })
    res.status(200).json({
        status: 'success',
        data: {
            newBooking
        }
    });
})

export const reviewGig = catchAsync(async (req, res, next) => {
    const userId = req.user._id
    const data = req.body
    console.log(data);
    const newReview = await Review.create({
        userId,
        gigId: data.reviewData.gig,
        rating: data.reviewData.rating,
        title: data.reviewData.title,
        description: data.reviewData.description
    })
    res.status(200).json({
        status: "Success"
    })
})

export const reviewVendor = catchAsync(async (req, res, next) => {
    const userId = req.user._id
    const data = req.body
    const vendorId = data.reviewData.vendor
    const newReview = await vendorReview.create({
        userId,
        vendorId: data.reviewData.vendor,
        rating: data.reviewData.rating,
        title: data.reviewData.title,
        description: data.reviewData.description
    })

    res.status(200).json({
        status: "Success"
    })
})

export const chat = catchAsync(async (req, res, next) => {
    console.log(req.body);
    const { from, to, message } = req.body
    const newMessage = await Message.create({
        message: message,
        chatUsers: [from, to],
        sender: from
    })
    res.status(200).json({
        data: {
            newMessage
        }
    })
})

export const getConnections = catchAsync(async (req, res, next) => {
    const vendorId = req.params.vendorId
    let connectionCount = []
    const connections = await Message.find({ chatUsers: vendorId }).sort({ createdAt: -1 })
    const connection = [];
    connections.map((message) => {
        const chatUsers = message.chatUsers
        console.log(chatUsers);
        const otherUsers = Object.values(chatUsers).filter((id) => id.toString() !== vendorId.toString());
        connection.push(...otherUsers);
    });

    const uniqueConnections = [...new Set(connection)];

    const users = await User.find({ _id: { $in: uniqueConnections } })
    const sortedUsers = uniqueConnections.map(id => users.find(user => user._id.toString() === id));

    const messages = await Message.find({ chatUsers: vendorId, sender: { $ne: vendorId }, read: false });
    console.log(messages);
    const counts = {};
    messages.forEach(message => {
        message.chatUsers.forEach(userId => {
            if (!counts[userId]) {
                counts[userId] = 1;
            } else {
                counts[userId]++;
            }
        });
    });
    const results = Object.entries(counts).map(([userId, count]) => ({ userId, count }));
    users.map((vendorId) => {
        results.map((data) => vendorId._id == data.userId ? connectionCount.push(data) : null)
    })

    res.status(200).json({ sortedUsers, connectionCount })
})

export const getConnectionsUser = catchAsync(async (req, res, next) => {

    const userId = req.params.userId
    let connectionCount = []
    const connections = await Message.find({ chatUsers: userId }).sort({ createdAt: -1 })
    const connection = [];

    connections.map((message) => {
        const chatUsers = message.chatUsers
        const otherUsers = Object.values(chatUsers).filter((id) => id.toString() !== userId.toString());
        connection.push(...otherUsers);

    });

    const uniqueConnections = [...new Set(connection)];

    const users = await Vendor.find({ _id: { $in: uniqueConnections } })

    const sortedUsers = uniqueConnections.map(id => users.find(user => user._id.toString() === id));

    const messages = await Message.find({ chatUsers: userId, sender: { $ne: userId },  read: false });
    const counts = {};
    messages.forEach(message => {
        message.chatUsers.forEach(userId => {
            if (!counts[userId]) {
                counts[userId] = 1;
            } else {
                counts[userId]++;
            }
        });
    });
    const results = Object.entries(counts).map(([userId, count]) => ({ userId, count }));
    users.map((vendorId) => {
        results.map((data) => vendorId._id == data.userId ? connectionCount.push(data) : null)
    })

    res.status(200).json({ sortedUsers, connectionCount })
})

export const allMessageCountVendor = catchAsync(async (req, res, next) => {
    const vendorId = req.params.vendorId
    const count = await Message.countDocuments({ chatUsers: vendorId, sender: { $ne: vendorId }, read: false });
    res.status(200).json({ count })
})

export const allMessageCount = catchAsync(async (req, res, next) => {
    const userId = req.params.userId
    const count = await Message.countDocuments({ chatUsers: userId, sender: { $ne: userId }, read: false });
    res.status(200).json({ count })
})

export const getMessage = catchAsync(async (req, res, next) => {
    const from = req.params.user1Id
    const to = req.params.user2Id

    const newMessage = await Message.find({
        chatUsers: {
            $all: [from, to]
        }
    }).sort({ createdAt: 1 })

    const allMessage = newMessage.map((msg) => {
        return {
            myself: msg.sender.toString() === from,
            message: msg.message
        }
    })
    await Message.updateMany({ chatUsers: { $all: [from, to] }, sender: { $ne: from } }, { $set: { read: true } })

    res.status(200).json(allMessage)
})

export const userProtect = catchAsync(async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        res.json({
            user: false
        })
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findOne({ _id: decoded.id });
    if (!currentUser) {
        return next(
            new AppError(
                res.json({
                    user: false
                })
            )
        );
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError("User recently changed password! Please log in again.", 401)
        );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

export const adminProtect = catchAsync(async (req, res, next) => {
    console.log(req.headers);
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        res.json({
            admin: false
        })
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    console.log(decoded)
    const currentAdmin = await Admin.findOne({ _id: decoded.id });
    if (!currentAdmin) {
        return next(
            new AppError(
                res.json({
                    admin: false
                })
            )
        );
    }

    // 4) Check if user changed password after the token was issued
    if (currentAdmin.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError("User recently changed password! Please log in again.", 401)
        );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.admin = currentAdmin;
    next();
});

export const vendorProtect = catchAsync(async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        res.json({
            vendor: false
        })
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    console.log(decoded)
    const currentVendor = await Vendor.findOne({ _id: decoded.id });
    if (!currentVendor) {
        return next(
            new AppError(
                res.json({
                    vendor: false
                })
            )
        );
    }

    // 4) Check if user changed password after the token was issued
    if (currentVendor.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError("User recently changed password! Please log in again.", 401)
        );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.vendor = currentVendor;
    next();
});