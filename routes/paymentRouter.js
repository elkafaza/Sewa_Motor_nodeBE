// routes/paymentRouter.js
import express from 'express';
import multer from 'multer';
import {
  createPayment,
  getAllPayments,
  updatePaymentStatus,
  uploadBuktiTransfer,
  getPaymentsByUser,
  getPaymentById
} from '../controller/paymentController.js';

import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Konfigurasi multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/bukti/'),
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, filename);
  },
});
const upload = multer({ storage });

// ✅ POST transaksi sewa motor
router.post('/', authMiddleware, createPayment);

// ✅ GET semua transaksi milik user login — HARUS DITARUH SEBELUM `/:id`
router.get('/user', authMiddleware, getPaymentsByUser);

// ✅ GET semua transaksi (admin only)
router.get('/', authMiddleware, isAdmin, getAllPayments);

// ✅ GET transaksi berdasarkan ID
router.get('/:id', authMiddleware, getPaymentById);

// ✅ PATCH ubah status transaksi (admin only)
router.patch('/:id/status', authMiddleware, isAdmin, updatePaymentStatus);

// ✅ POST upload bukti transfer
router.post('/upload-bukti', authMiddleware, upload.single('bukti'), uploadBuktiTransfer);

export default router;
