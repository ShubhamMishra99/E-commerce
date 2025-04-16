import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['fan', 'ac'],
    required: true,
  },
  variants: [{
    size: String,
    color: String,
    stock: Number,
  }],
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Product', productSchema);