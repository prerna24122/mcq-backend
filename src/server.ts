import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/authRoutes';
import questionRoutes from './routes/questionRoutes';
import roomRoutes from './routes/roomRoutes';
import resultRoutes from './routes/resultRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS configuration
// Allows local frontend and deployed frontend to access backend
app.use(cors({
  origin: [
   'http://localhost:3000',           // Local React (default port)
    'http://localhost:5173',           // Local Vite (default port)
    'https://*.vercel.app',            // Any Vercel deployment
    'https://*.netlify.app',           // Any Netlify deployment
    'https://*.onrender.com'           // Any Render deployment
  ],
  credentials: true,
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/results', resultRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'MCQ Platform API Running' });
});

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Database connection failed:', err);
});
