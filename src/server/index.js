import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import riderRoutes from './routes/riders.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: '.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Google OAuth Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Authentication Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Google Login Route
app.post('/auth/google', async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const { email } = ticket.getPayload();
    
    // Check if email is in approved list (implement this check)
    // For now, we'll accept all Google emails
    const jwtToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ token: jwtToken });
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', auth, orderRoutes);
app.use('/api/admin', auth, adminRoutes);
app.use('/api/riders', auth, riderRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'E-commerce API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});