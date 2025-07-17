import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const generateAccessToken = (userId: number) => 
  jwt.sign({ userId }, process.env.ACCESS_SECRET!, { expiresIn: '15m' });

export const generateRefreshToken = (userId: number) => 
  jwt.sign({ userId }, process.env.REFRESH_SECRET!, { expiresIn: '7d' });
