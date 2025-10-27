import express from 'express';
import {
  login,
  register,
  logoutUser,
  refreshAccessToken,
} from '../controllers/users.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/signup').post(register);
router.route('/signin').post(login);
router.route('/signout').post(protect, logoutUser);
router.route('/refreshToken').post(refreshAccessToken);

export default router;
