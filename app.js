import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import cors from 'cors';

import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRouter.js';
import reviewRoutes from './routes/review.js';
import adminRoutes from './routes/adminRouter.js';
import paymentRoutes from './routes/paymentRouter.js';

dotenv.config();
const app = express();

// ES Module fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'https://sewa-motor-node-fe-w45m.vercel.app',
  'https://sewa-motor-node-fe-w45m-git-master-elkas-projects-4bcbfa2e.vercel.app',
  'https://sewa-motor-node-fe-w45m-qgz933ojp-elkas-projects-4bcbfa2e.vercel.app'
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`📥 Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});

// Static file (uploads)
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
