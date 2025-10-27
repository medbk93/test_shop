import express from 'express';
const router = express.Router();
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  removeFromWishlist,
} from '../controllers/products.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getProducts).post(protect, admin, createProduct);
router
  .route('/:id')
  .patch(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);
router
  .route('/wishlist/:id')
  .post(protect, addToWishlist)
  .delete(protect, removeFromWishlist);

export default router;
