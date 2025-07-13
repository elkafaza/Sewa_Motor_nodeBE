import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  motorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Motor',
    required: true,
  },
  startDate: Date,
  endDate: Date,
  duration: Number,
  total: Number,
  method: String,
  status: { 
    type: String, 
    enum: ['Pending','Berlangsung','Selesai','Gagal'], 
    default:'Pending' },
  buktiTransfer: String,
}, {
  timestamps: true,
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
