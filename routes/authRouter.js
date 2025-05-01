import express from 'express'
import { RegisterUser, LoginUser, LogoutUser, GetUser } from '../controller/authController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', RegisterUser)

router.post('/login', LoginUser)

router.get('/logout', authMiddleware, LogoutUser)

router.get('/getUser', authMiddleware, GetUser)

export default router