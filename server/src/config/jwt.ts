import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'accesssecret';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'refreshsecret';

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export const verifyRefreshToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as { id: string };
    return decoded.id;
  } catch (err) {
    return null;
  }
};
