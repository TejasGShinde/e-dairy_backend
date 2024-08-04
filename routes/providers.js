const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middlewares/auth');

// Fetch nearby providers
router.get('/nearby', auth, async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    const providers = await User.find({
      userType: 'provider',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: 10000 // 10km in meters
        }
      }
    }).select('-password');
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch nearby providers' });
  }
});

// Fetch all providers
router.get('/', auth, async (req, res) => {
  try {
    const providers = await User.find({ userType: 'provider' }).select('-password');
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all providers' });
  }
});
router.get('/customers', auth, async (req, res) => {
    try {
      const customers = await User.find({ userType: 'customer' }).select('-password');
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch all providers' });
    }
  });
module.exports = router;
