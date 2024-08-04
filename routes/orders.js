const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middlewares/auth');

// Create a new order
router.post('/', auth, async (req, res) => {
  try {
    const { products, totalAmount, providerId } = req.body;
    const order = new Order({
      customer: req.userId,
      provider: providerId,
      products,
      totalAmount,
      status: 'pending'
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Fetch orders for customers
router.get('/customer', auth, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.userId })
      .populate('provider')
      .populate('products.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Fetch orders for providers
router.get('/provider', auth, async (req, res) => {
  try {
    const orders = await Order.find({ provider: req.userId })
      .populate('customer')
      .populate('products.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Confirm an order
router.put('/confirm/:orderId',auth, async (req, res) => {
    try {
      const { orderId } = req.params;
      const { userId, userType } = req.body;  // Get these from the request body
  
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      console.log('Order provider:', order.provider);
      console.log('User ID from request:', userId.name);
      console.log('User type from request:', userType);
  
      // Check if the user is a provider and matches the order's provider
      if (userType !== 'provider' || order.provider.name !== userId.name) {
        return res.status(403).json({ error: 'Unauthorized. Only the order provider can confirm the order.' });
      }
  
      // Check if the order is already completed
      if (order.status === 'completed') {
        return res.status(400).json({ error: 'Order is already completed' });
      }
  
      order.status = 'completed';
      await order.save();
      res.json(order);
    } catch (error) {
      console.error('Error confirming order:', error);
      res.status(500).json({ error: 'Failed to confirm order', details: error.message });
    }
  });
  router.put('/cancel/:orderId',auth, async (req, res) => {
    try {
      const { orderId } = req.params;
      const { userId, userType } = req.body;  // Get these from the request body
  
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      console.log('Order provider:', order.provider);
      console.log('User ID from request:', userId.name);
      console.log('User type from request:', userType);
  
      // Check if the user is a provider and matches the order's provider
      if (userType !== 'provider' || order.provider.name !== userId.name) {
        return res.status(403).json({ error: 'Unauthorized. Only the order provider can confirm the order.' });
      }
  
      // Check if the order is already completed
      if (order.status === 'cancelled') {
        return res.status(400).json({ error: 'Order is already cancelled' });
      }
  
      order.status = 'cancelled';
      await order.save();
      res.json(order);
    } catch (error) {
      console.error('Error confirming order:', error);
      res.status(500).json({ error: 'Failed to confirm order', details: error.message });
    }
  });
  
module.exports = router;
