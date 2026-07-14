import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db.js';
import { seedDatabase } from './config/seed.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

dotenv.config();

const app = express();

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Mount API endpoints
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/job', jobRoutes);
app.use('/api/v1/application', applicationRoutes);

// Health check API
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Job Portal API is running successfully.' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect Database
  await connectDB();
  
  // Seed Dev Database
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`Server successfully started on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
};

startServer();
