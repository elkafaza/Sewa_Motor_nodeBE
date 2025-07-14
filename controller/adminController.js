import Motor from '../models/motorModel.js';
import Payment from '../models/paymentModel.js';
import asyncHandler from '../middleware/asyncHandler.js';
import path from 'path';

export const uploadMotor = asyncHandler(async (req, res) => {
  const { motorId, brand, model, tersedia, harga } = req.body;

  const gambar = req.file ? `/uploads/${req.file.filename}` : '';

  const motor = await Motor.create({
    motorId,
    brand,
    model,
    tersedia: tersedia === 'true' || tersedia === true, // convert ke boolean
    harga,
    gambar
  });

  res.status(201).json({ message: 'Motor berhasil ditambahkan', data: motor });
});


export const listMotor = asyncHandler(async (req, res) => {
  const data = await Motor.find();
  res.status(200).json(data);
});

export const getmotor = asyncHandler(async(req, res) =>{
  const data = await Motor.find(req.params.id);
  res.status(200).json(data);

})

export const getPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find().populate('userId', 'name email');
  res.status(200).json(payments);
});

export const verifyPayment = asyncHandler(async (req, res) => {
  console.log('PATCH /payments/:id dipanggil'); // <--- Tambah log

  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    console.log('Payment ID tidak ditemukan:', req.params.id);  // <--- log tambahan
    return res.status(404).json({ message: 'Data pembayaran tidak ditemukan' });
  }

  payment.status = req.body.status;
  await payment.save();

  const motor = await Motor.findById(payment.motorId);
if (motor) {
  if (payment.status === 'Selesai' || payment.status === 'Gagal') {
    motor.status = 'Tersedia';
    motor.tersedia = true;
  } else {
    motor.status = 'Sedang diservice / dibooking';
    motor.tersedia = false;
  }
  await motor.save();
}

  res.status(200).json({ message: 'Status pembayaran diperbarui', data: payment });
});

export const updateMotor = asyncHandler(async (req, res) => {
  const motor = await Motor.findById(req.params.id);
  if (!motor) return res.status(404).json({ message: 'Motor tidak ditemukan' });

  const { motorId, brand, harga, status, model } = req.body;

  if (motorId) motor.motorId = motorId;
  if (brand) motor.brand = brand;
  if (harga !== undefined) motor.harga = harga;
  if (status) {
    motor.status = status;
    motor.tersedia = status === 'Tersedia';
  }
  if (model) motor.model = model;

  // 🔁 Update gambar jika di-upload ulang
  if (req.file) {
    motor.gambar = `/uploads/${req.file.filename}`;
  }

  await motor.save();
  res.status(200).json({ message: 'Data motor diperbarui', data: motor });
});




