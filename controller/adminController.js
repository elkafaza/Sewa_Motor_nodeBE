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
  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    res.status(404).json({ message: 'Data pembayaran tidak ditemukan' });
    return;
  }
  payment.status = req.body.status; // verified / rejected
  await payment.save();

  res.status(200).json({ message: 'Status pembayaran diperbarui', data: payment });
});
