import Payment from '../models/paymentModel.js';
import asyncHandler from '../middleware/asyncHandler.js';
import Motor from '../models/motorModel.js';

// ➕ BUAT TRANSAKSI PEMBAYARAN
export const createPayment = asyncHandler(async (req, res) => {
  const {
    
    motorId,
    startDate,
    endDate,
    duration,
    total,
    method,
    status
  } = req.body;

  const payment = await Payment.create({
    userId: req.user._id,
    motorId,
    startDate,
    endDate,
    duration,
    total,
    method,
    status : 'Pending'
  });
 await Motor.findByIdAndUpdate(
    motorId,
    { tersedia: false, status: 'Sedang diservice / dibooking' }
  );

  res.status(201).json(payment);
});

// 📥 LIHAT SEMUA PEMBAYARAN
export const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find()
    .populate('userId', 'name email')       // Hanya ambil name dan email
    .populate('motorId', 'motorId brand');  // Hanya ambil plat nomor dan brand

  res.json({ data: payments });
});

// 📥 LIHAT PEMBAYARAN USER SAJA
export const getPaymentsByUser = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ userId: req.user._id })
    .populate('motorId')
    .sort({ createdAt: -1 });

  res.status(200).json(payments);
});

// 🔍 GET SATU PEMBAYARAN BERDASARKAN ID
export const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('userId', 'name')
    .populate('motorId', 'motorId brand');

  if (!payment) {
    return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
  }

  res.status(200).json(payment);
});


// ✏️ UPDATE STATUS PEMBAYARAN
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
  }

  payment.status = status;
  await payment.save();

  res.status(200).json({
    message: `Status transaksi diperbarui ke '${status}'`,
    data: payment
  });
});

// 📤 UPLOAD BUKTI TRANSFER
export const uploadBuktiTransfer = asyncHandler(async (req, res) => {
  const { paymentId } = req.body;

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
  }

  payment.buktiTransfer = req.file.filename;
  payment.status = 'Berlangsung';

  await payment.save();

  res.status(200).json({
    message: 'Bukti transfer berhasil diunggah',
    data: payment
  });
});
