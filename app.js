import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRouter.js';
import reviewRoutes from './routes/review.js';
import adminRoutes from './routes/adminRouter.js';
import paymentRoutes from './routes/paymentRouter.js';

dotenv.config();

const app = express();



// ES Module path fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS Setup
app.use(cors({
  origin: 'http://localhost:5173', // ganti dengan domain React-mu
  credentials: true,               // ⬅️ WAJIB: untuk kirim cookie JWT
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);

// React frontend build
app.use(express.static(path.join(__dirname, 'frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});

// Error middleware
app.use(notFound);
app.use(errorHandler);


// MongoDB Connect & Start Server
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB Atlas Connected!');
}).catch((err) => {
  console.error('❌ MongoDB Atlas connection error:', err);
});

