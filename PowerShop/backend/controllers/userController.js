import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';
import Order from '../models/orderModel.js';
import ChainUser from '../chainservice/chainuser.js'

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await ChainUser.findOne( {email} );
  if(!user){
    res.status(401);
    throw new Error('Invalid email or password');
  }
  if (user.password==password) {
    res.status(200).json({
      _id:user.email,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      password:user.password,
      cleanpowerpoint:user.cleanpowerpoint,
      role:user.role,
      token: generateToken(user.email),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  // if (!email.match(/^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@soton\.ac\.uk$/)&&!email.match(/^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@gmail\.com$/)) {
  //   throw new Error('Only University of Southampton Email Allowed!');
  // }
  console.log('get register request:' +JSON.stringify(req.body))
  //var chainUser = {email,name,password,role:'consumer'}
  const userExists = await ChainUser.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  
  const user = await ChainUser.addUser({
    name,
    email,
    password,
    role:'consumer',
    admin:'no'
  });

  if (user) {
    res.status(200).json({
      _id:user.email,
      name: user.name,
      email: user.email,
      admin: user.admin,
      password:user.password,
      cleanpowerpoint:user.cleanpowerpoint,
      role:user.role,
      token: generateToken(user.email),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile/:email
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  console.log(req.params);
  const user = await ChainUser.findOne({ email: req.params.email });
  if (user) {
    res.status(200).json({
      _id:user.email,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      password:user.password,
      cleanpowerpoint:user.cleanpowerpoint,
      role:user.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile/reviews/:email
// @access  Private
const getUserReviews = asyncHandler(async (req, res) => {
  const { email } = await ChainUser.findOne({ email: req.params.email });
  const reviewOrders = await Order.find({
    seller: email,
    review: { $ne: null },
  });
  res.status(200).json(reviewOrders);
});

// @desc    Update user profile
// @route   PUT /api/users/profile/:email
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  //console.log(req.body)
  const user = await ChainUser.findOne({email:req.body.email});
  // if (req.body.email !== req.user.email.toString()) {
  //   res.status(404);
  //   throw new Error('You are not authorized!');
  // }
  if (user) {
    user.name = req.body.name || user.name;
    if (req.body.password) {
      user.password = req.body.password;
    }
    if(req.body.cleanpowerpoint){
      user.cleanpowerpoint = req.body.cleanpowerpoint
    }
    //console.log(before updateuser);
    const updatedUser = await ChainUser.save(user);
    console.log('updateduser'+JSON.stringify(updatedUser));
    res.status(200).json({
      _id:user.email,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      cleanpowerpoint:updatedUser.cleanpowerpoint,
      password:updatedUser.password,
      role:updatedUser.role,
      //token: generateToken(updatedUser.email),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:email
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await ChainUser.findOne({email:req.params.id});

  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:email
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  var email = req.params.email
  const user = await ChainUser.findOne({email});

  if (user) {
    user._id=user.email,
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await ChainUser.findOne({email:req.params.email});

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;
    if (req.body.password) {
      user.password = req.body.password;
    }
    if(req.body.cleanpowerpoint){
      user.cleanpowerpoint = req.body.cleanpowerpoint
    }
    const updatedUser = await ChainUser.save(user);
    console.log('updateduser'+JSON.stringify(updatedUser))
    res.status(200).json({
      _id:user.email,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      cleanpowerpoint:updatedUser.cleanpowerpoint,
      password:updatedUser.password,
      role:updatedUser.role,
      //token: generateToken(updatedUser.email),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const getUserByEmail = asyncHandler(async (req, res) => {
  const user = await ChainUser.findOne({"email": req.params.email });
  console.log('request email' + JSON.stringify(req.params.email));
  if (user) {
    res.status(200).json({
      _id:user.email,
      password: user.password,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      role:user.role,
      cleanpowerpoint:user.cleanpowerpoint
    });
  } else {
    res.status(200).json('first-time');
    //res.status(401)
    //throw new Error('Invalid email')
  }
});

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  getUserReviews,
  getUserByEmail,
};
