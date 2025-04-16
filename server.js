import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Define a schema and model for Orders
const orderSchema = new mongoose.Schema({
  user: {
    email: String,
    name: String,
    address: String,
  },
  totalAmount: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', orderSchema);

// DB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Route to get all orders from the database
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find(); // Retrieve all orders
    res.status(200).json(orders); // Send the orders as a response
  } catch (err) {
    res.status(400).json({ message: 'Error retrieving orders', error: err });
  }
});

// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});
