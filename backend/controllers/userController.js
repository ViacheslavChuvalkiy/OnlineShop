const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel')

//@desc Register a new user
//@route /api/users
//access Public
const registerUser = asyncHandler(async (req,res) => {

  const {name, email, password} = req.body;

  //Validation
  if(!name || !email || !password){
   res.status(400)
   throw new Error('Please include all fields')
  }

  //Find if the user already exists
  const userExists = await User.findOne({email})
  if(userExists){
    res.status(400)
    throw new Error('User already exists')
  }

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create user
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword
  })

  if(newUser){ok
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token: generateToken(_id)
    })
    }
  else {
    res.status(400)
    throw new Error("Invalid user data")
  }
})

//@desc Login a user
//@route /api/users/login
//access Public
const loginUser = asyncHandler (async (req,res) => {
  const {email, password} = req.body;

  //Validation inputs
  if(!email || !password){
    res.status(400)
    throw new Error('Please include all fields')
  }

  //Find if the user already exists
  const user = await User.findOne({email})
  if(!user){
    res.status(400)
    throw new Error('User does not exists')
  }

  //Validation password
  if(! await bcrypt.compare(password,user.password)){
    res.status(401)
    throw new Error("The password is invalid")
  }
  else {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(_id)
    })
  }

})

//@desc Get current user
//@route /api/users/me
//access Private
const getMe = asyncHandler (async (req,res) => {

  const user = {
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
  }
  res.status(200).json(user);
})

//Generate token with jsonWebToken
const generateToken = (id) => {
  return jwt.sign({id }, process.env.JWT_SECRET, {expiresIn: "30d"})
}

module.exports = {
  registerUser,
  loginUser,
  getMe
}