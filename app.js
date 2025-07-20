import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
// Routes & Middleware
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRouter.js';
import reviewRoutes from './routes/review.js';
import adminRoutes from './routes/adminRouter.js';
import paymentRoutes from './routes/paymentRouter.js';
 // tambahkan jika belum

dotenv.config();

const cors = require('cors');

app.use(cors({
  origin: 'sewa-motor-node-fe-4zz5.vercel.app', // URL Vercel kamu
  credentials: true
}));

// ES Module path fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Express-Vite Integration ===
const startServer = async () => {
  const app = express();

  // Vite middleware untuk development
  const vite = await createViteServer({
    server: { middlewareMode: true },
    root: path.resolve(__dirname, 'frontend/src'),
    appType: 'custom',
  });

  app.use(vite.middlewares);

  // Middleware backend
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Static file (uploads)
  app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/payment', paymentRoutes);
  // Pastikan motorRouter.js ada

  // Fallback route untuk frontend React
  app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl;
    const html = await vite.transformIndexHtml(url, `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Sewa Motor</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" src="/index.jsx"></script>
        </body>
      </html>
    `);
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
  } catch (e) {
    vite.ssrFixStacktrace(e);
    res.status(500).end(e.stack);
  }
});


  // Error handling middleware
  app.use(notFound);
  app.use(errorHandler);

  // Connect to MongoDB
  mongoose.connect('mongodb://127.0.0.1:27017/ServerMasEl')
    .then(() => console.log('✅ Connected to local MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Dev Server running at http://localhost:${PORT}`);
  });
};

startServer();
