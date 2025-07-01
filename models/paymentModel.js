import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  motorId: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  method: {
    type: String,
    enum: ['qris', 'transfer', 'cod'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Berlangsung', 'Selesai', 'Gagal'], // ✅ Fix here
    default: 'Berlangsung',
  },
  buktiTransfer: {
    type: String,
    default: '',
  },
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
