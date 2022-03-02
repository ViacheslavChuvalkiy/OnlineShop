const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const protect = asyncHandler(async (res, req, next) => {
  let token
  if (req.header.authorization && req.header.authorization.startsWith('Bearer')) {
    try {
      //Get token from header
      token = req.header.authorization.split(' ')[1];
      //Verify
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //Get user from token
      req.user = await User.findById(decoded.id).select('-password')
      next()
    } catch (error) {
      console.log(error)
      res.status(400)
      throw new Error('Not authorized')
    }
  }
  if (!token) {
    res.status(400)
    throw new Error('Not authorized')
  }
})
module.exports = {
  protect
}