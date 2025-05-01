import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import asyncHandler from '../middleware/asyncHandler.js'
import bcrypt from 'bcrypt'

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createSendResToken = (user,statusCode, res) => {
    const token = signToken(user._id)

    const isDev = process.env.NODE_ENV === 'development' ? false : true

    const cookieOptions = {
        expires: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: isDev,
    }
    res.cookie('jwt', token, cookieOptions)

    user.password = undefined
    res.status(statusCode).json({ 
        message: 'Login successful', 
        data : user
    })
}

export const RegisterUser = asyncHandler(async (req, res) => {
    const isOwner = (await User.countDocuments()) === 0

    const role = isOwner ? 'admin' : 'user'

    const createUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        role
    })

    createSendResToken(createUser,201,res)
    
})

export const LoginUser = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email })

    if(!req.body.password || !req.body.email) {
        return res.status(400).json({ message: 'Email or Password must be filled' })
    }
    if(!user) {
        return res.status(400).json({ message: 'Email not found' })
    }

    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password)

    if(!isPasswordMatch) {
        return res.status(400).json({ message: 'Password not match' })
    }

    createSendResToken(user,200,res)
})

export const GetUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    res.status(200).json({ message: 'Get Detail User successful', data: user })
})

export const LogoutUser = asyncHandler(async (req, res) => {
    res.clearCookie('jwt', "", { 
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.status(200).json({ message: 'Logout successful' })
})

