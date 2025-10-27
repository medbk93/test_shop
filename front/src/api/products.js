import api from '@/lib/axios';

export const getProducts = async (page = 1, filters) => {
  try {
    const queryFilters = new URLSearchParams(filters).toString();
    const res = await api.get(`/products?page=${page}&${queryFilters}`);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to login';
    throw new Error(message);
  }
};

export const addToWishlist = async (productId) => {
  try {
    const res = await api.post(`/products/wishlist/${productId}`);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to login';
    throw new Error(message);
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    const res = await api.delete(`/products/wishlist/${productId}`);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to login';
    throw new Error(message);
  }
};
