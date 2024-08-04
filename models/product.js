const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }, // Changed from ObjectId to String
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inStock: { type: Boolean, default: true }
});

module.exports = mongoose.model('Product', productSchema);