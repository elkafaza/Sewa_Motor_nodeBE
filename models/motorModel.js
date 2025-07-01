import mongoose from 'mongoose';

const motorSchema = new mongoose.Schema({
  motorId: { type: String, required: true, unique: true }, // plat nomor
  brand: { type: String, required: true },
  model: { type: String, enum: ['Matic', 'Non-matic'], required: true },
  tersedia: { type: Boolean, default: true }, // true = bisa disewa
  harga: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Tersedia', 'Sedang diservice / dibooking'],
    default: function () {
      return this.tersedia ? 'Tersedia' : 'Sedang diservice / dibooking';
    }
  },
  gambar: String
}, { timestamps: true });

const Motor = mongoose.model('Motor', motorSchema);
export default Motor;
