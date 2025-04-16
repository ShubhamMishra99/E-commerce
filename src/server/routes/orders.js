import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// Create new order
router.post('/', async (req, res) => {
  try {
    const order = new Order({
      user: req.body.user,
      products: req.body.products,
      totalAmount: req.body.totalAmount,
    });
    
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user orders
router.get('/my-orders', async (req, res) => {
  try {
    const orders = await Order.find({ 'user.email': req.userId })
      .populate('products.productId')
      .populate('rider');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;