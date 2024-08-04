const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Adjust the path as needed

module.exports = async (req, res, next) => {
    console.log('Auth middleware triggered');
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader);
    
    if (!authHeader) {
      console.log('No Authorization header found');
      return res.status(401).send({ error: 'No Authorization header' });
    }
  
    const token = authHeader.replace('Bearer ', '');
    console.log('Extracted token:', token);
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
  
      const user = await User.findOne({ _id: decoded.userId });
      if (!user) {
        console.log('User not found');
        throw new Error('User not found');
      }
  
      console.log('User found:', user._id);
      req.token = token;
      req.user = user;
      req.userId = user._id;
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).send({ error: 'Please authenticate.', details: error.message });
    }
  };