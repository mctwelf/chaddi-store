import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: String,
  latitude: Number,
  longitude: Number,
  notes: String,
  items: [{
    id: Number,
    name: String,
    price: Number,
    quantity: Number,
    image: String,
  }],
  subtotal: {
    type: Number,
    required: true,
  },
  shippingCost: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  whatsappSent: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)
