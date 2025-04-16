import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    email: String,
    name: String,
    address: String,
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: Number,
    size: String,
    color: String,
  }],
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'delivered', 'undelivered'],
    default: 'pending',
  },
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rider',
  },
  totalAmount: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Order', orderSchema);