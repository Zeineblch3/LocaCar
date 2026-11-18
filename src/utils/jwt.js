import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

export const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role, email: user.email }, ENV.JWT_ACCESS_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, ENV.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, ENV.JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, ENV.JWT_REFRESH_SECRET);
};