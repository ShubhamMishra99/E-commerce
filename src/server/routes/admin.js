import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// Get all orders (admin only)
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('products.productId')
      .populate('rider');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (admin only)
router.patch('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = req.body.status;
    if (req.body.riderId) {
      order.rider = req.body.riderId;
    }
    
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;