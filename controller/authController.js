import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import asyncHandler from '../middleware/asyncHandler.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import sendEmail from '../utils/sendEmail.js'


const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createSendResToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // true di production (HTTPS)
    sameSite: process.env.NODE_ENV !== 'development' ? 'None' : 'Lax',
    expires: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
  };

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    message: 'Login successful',
    data: user,
  });
};


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
    const emailToken = crypto.randomBytes(32).toString('hex')
createUser.emailToken = emailToken
createUser.emailTokenExpires = Date.now() + 1000 * 60 * 60 // 1 jam
await createUser.save()

const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${emailToken}`

await sendEmail({
  to: createUser.email,
  subject: 'Email Verification',
  html: `<h2>Verifikasi Email</h2><p>Click link berikut:</p><a href="${verifyUrl}">${verifyUrl}</a>`
})
    
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
export const verifyEmail = asyncHandler(async (req, res) => {
    const token = req.params.token;

    const user = await User.findOne({
        emailToken: token,
        emailTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({ message: 'Token tidak valid atau sudah expired' });
    }

    user.verified = true;
    user.emailToken = undefined;
    user.emailTokenExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Email berhasil diverifikasi!' });
});
export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return res.status(404).json({ message: 'Email tidak ditemukan' })
  }

  const resetToken = crypto.randomBytes(32).toString('hex')
  user.resetToken = resetToken
  user.resetTokenExpires = Date.now() + 1000 * 60 * 30 // 30 menit
  await user.save()

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`

  await sendEmail({
    to: user.email,
    subject: 'Reset Password',
    html: `<h2>Reset Password</h2><p>Click link berikut untuk reset password:</p><a href="${resetUrl}">${resetUrl}</a>`
  })

  res.status(200).json({ message: 'Link reset dikirim ke email' })
})
export const resetPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    resetToken: req.params.token,
    resetTokenExpires: { $gt: Date.now() }
  })

  if (!user) {
    return res.status(400).json({ message: 'Token tidak valid atau expired' })
  }

  user.password = req.body.password
  user.resetToken = undefined
  user.resetTokenExpires = undefined
  await user.save()

  res.status(200).json({ message: 'Password berhasil diubah' })
})


