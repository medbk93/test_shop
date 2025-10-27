import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import { getUserBy } from '../services/user.js';

// User must be authenticated
const protect = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401);
      throw new Error('Not authorized, no token');
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserBy('id', payload.userId);

    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }

    req.user = user;
    req.user.isAdmin = req.user.email === process.env.ADMIN_EMAIL;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

// User must be an admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export { protect, admin };
