import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: [true, 'Nama sudah di Gunakan oleh orang lain'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'Email sudah di Gunakan oleh orang lain'],
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [8, 'Password must be at least 8 characters long'],
    validate: {
      validator: validator.isLength,
      message: '{VALUE} must be at least 8 characters long',
    },
  },
  phone : {
    type : Number,
    required : [true, 'Phone is required'],
    unique : [true, 'Phone sudah di Gunakan oleh orang lain'],
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['admin', 'user'],
    default: 'user',
  },
});


userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;