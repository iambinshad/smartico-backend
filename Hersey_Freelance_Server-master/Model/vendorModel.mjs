import crypto from 'crypto'
import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'

const vendorSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'enter your email id'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail,  'please enter a valid email']
    },
    skill: {
        type: String
    },
    googleDrive: {
        type: String,
    },
    linkedIn: {
        type: String
    },
    github: {
        type: String
    },
    address: {
        pincode: {
            type: Number,
        },
        country: {
            type: String,
        },
        currentAddress: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        }
    },
    upiId: {
        type: String
    },
    about: {
        type: String
    },
    profilePhoto: {
        type: String
    },
    dob: {
        type: Date
    },
    gender: {
        type: String,
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: [true, 'provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'confirm your password'],
        validate: {
            validator: function(el) {
                return el === this.password 
            },
            message: 'Password are not the same'
        }
    },
    status: {
        type: String,
        default: 'Not Approved'
    },
    date: {
        type: Date,
        default: Date.now()
    },
    payment: {
        type: String
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date

})

vendorSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined
    next()
})

vendorSchema.methods.correctPassword = async function(candidatePassword, vendorPassword) {
    return await bcrypt.compare(candidatePassword, vendorPassword)
}

vendorSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {

        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)

        return JWTTimestamp < changedTimestamp
    }

    //false means not changed
    return false
}

vendorSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000

    return resetToken
}

const Vendor = mongoose.model('Vendor', vendorSchema)

export default Vendor