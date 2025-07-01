import Payment from '../models/paymentModel.js';
import asyncHandler from '../middleware/asyncHandler.js';

// ➕ BUAT TRANSAKSI PEMBAYARAN
export const createPayment = asyncHandler(async (req, res) => {
  const {
    userId,
    motorId,
    startDate,
    endDate,
    duration,
    total,
    method,
    status
  } = req.body;

  const payment = await Payment.create({
    userId,
    motorId,
    startDate,
    endDate,
    duration,
    total,
    method,
    status
  });

  res.status(201).json(payment); // hanya return payment (untuk ambil _id di frontend)
});

// 📥 LIHAT SEMUA PEMBAYARAN
export const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find().sort({ createdAt: -1 });
  res.status(200).json(payments);
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

   console.log("📩 ID dari upload bukti:", paymentId); 
    console.log("📷 File yang diupload:", req.file?.filename);
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
