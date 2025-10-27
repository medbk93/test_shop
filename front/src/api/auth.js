import api from '@/lib/axios';

export const loginUser = async (credentials) => {
  try {
    const res = await api.post('/users/signin', credentials);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to login';
    throw new Error(message);
  }
};

export const logoutUser = async () => {
  try {
    await api.post('/users/signout');
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to logout';
    throw new Error(message);
  }
};

export const refreshAccessToken = async () => {
  try {
    const res = await api.post('/users/refreshToken');
    return res.data;
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to refresh token';
    throw new Error(message);
  }
};
