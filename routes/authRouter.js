import express from 'express';
import {
  RegisterUser,
  LoginUser,
  LogoutUser,
  GetUser,
  verifyEmail,
  forgotPassword,
  resetPassword
} from '../controller/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', RegisterUser);
router.post('/login', LoginUser);
router.get('/logout', authMiddleware, LogoutUser);
router.get('/getUser', authMiddleware, GetUser);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
