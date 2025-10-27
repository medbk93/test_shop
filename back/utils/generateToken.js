import jwt from 'jsonwebtoken';

export const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '10m',
  });
};

export const setTokens = (res, userId) => {
  // Generate tokens
  const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '3d',
  });
  const accessToken = createAccessToken({ userId });

  // Set access token as HTTP-Only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 day
  });

  return { accessToken, refreshToken };
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};
