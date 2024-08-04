const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const auth = require('../middlewares/auth');

// Get all products for a provider
router.get('/provider', auth, async (req, res) => {
  try {
    const products = await Product.find({ provider: req.userId }).populate('category');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add a new product
router.post('/', auth, async (req, res) => {
    try {
      const { name, description, price, category } = req.body;
      if (!name || !description || !price || !category) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      const product = new Product({
        name,
        description,
        price,
        category, // Assuming category is a string now, not an ObjectId
        provider: req.userId
      });
      const savedProduct = await product.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ error: 'Failed to add product', details: error.message });
    }
  });
  

// Update a product
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, price, category, inStock } = req.body;
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, provider: req.userId },
      { name, description, price, category, inStock },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete a product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, provider: req.userId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Get all products for a specific provider
router.get('/provider/:providerId', auth, async (req, res) => {
    try {
      const products = await Product.find({ provider: req.params.providerId, inStock: true }).populate('category');
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

module.exports = router;