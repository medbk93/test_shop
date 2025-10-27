import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUser, getUserBy, registerUser } from '../services/user.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { createAccessToken, setTokens } from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }
  const user = await getUser(email);
  if (!user) {
    res.status(401);
    throw new Error('Invalid Credentials');
  }
  // Check if password matches
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid Credentials');
  }
  const tokens = setTokens(res, user.id);
  res.json({
    id: user.id,
    email: user.email,
    isAdmin: user.email === process.env.ADMIN_EMAIL,
    accessToken: tokens.accessToken,
  });
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  if (!email || !password || !first_name || !last_name) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase()) === false) {
    res.status(400);
    throw new Error('Please provide a valid email');
  }
  const userExists = await getUser(email);

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const userData = {
    firstName: first_name.trim(),
    lastName: last_name.trim(),
    email: email.trim().toLowerCase(),
    password: hashedPassword,
  };
  const [user] = await register(userData);

  const tokens = setTokens(res, user.id);

  res.status(201).json({
    _id: user.id,
    email: user.email,
    isAdmin: user.email === process.env.ADMIN_EMAIL,
    accessToken: tokens.accessToken,
  });
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });
  res.status(200).json({ message: 'Logout successfully' });
};

// @desc    Refresh access token
// @route   POST /api/users/refreshToken
// @access  Public
const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  console.log('Refreshing token...');

  if (!refreshToken) {
    res.status(400);
    throw new Error('refresh token is required');
  }
  console.log(refreshToken);
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
    throw new Error('Invalid Access token');
  }

  const user = await getUserBy('id', decoded.userId);
  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  // Generate new token
  const newAccessToken = createAccessToken({ userId: user.id });

  res.json({
    user: {
      id: user.id,
      email: user.email,
      isAdmin: user.email === process.env.ADMIN_EMAIL,
    },
    accessToken: newAccessToken,
  });
});

export { login, register, logoutUser, refreshAccessToken };
