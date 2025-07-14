import express from 'express';
import { uploadMotor, listMotor, verifyPayment, getPayments, getmotor } from '../controller/adminController.js';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import { updateMotor } from '../controller/adminController.js';

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // ambil .jpg, .png, dll
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage }); // ← pakai storage custom ini
// Upload motor
router.post(
  '/motor',
  (req, res, next) => {
    console.log('📥 POST /motor MASUK');
    next();
  },
  authMiddleware,
  isAdmin,
  upload.single('gambar'),
  uploadMotor
);

router.get('/motor', listMotor);
router.get('/motor/:id', authMiddleware, getmotor);
router.put(
  '/motor/:id',
  authMiddleware,
  isAdmin,
  upload.single('gambar'), // ← untuk menangani gambar yang dikirim dari frontend
  updateMotor
);


// Verifikasi pembayaran
router.get('/payments', authMiddleware, isAdmin, getPayments);
router.patch('/payments/:id', authMiddleware, isAdmin, verifyPayment);


export default router;
