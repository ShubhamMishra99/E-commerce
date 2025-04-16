import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// Get rider's assigned orders
router.get('/my-orders', async (req, res) => {
  try {
    const orders = await Order.find({ rider: req.userId, status: 'shipped' })
      .populate('products.productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (rider only)
router.patch('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      rider: req.userId,
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (!['delivered', 'undelivered'].includes(req.body.status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    order.status = req.body.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;