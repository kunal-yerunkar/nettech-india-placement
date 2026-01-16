import dotenv from 'dotenv';
import { join } from 'path';
import { existsSync } from 'fs';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';

// Load .env file
const cwd = process.cwd();
const envPath = join(cwd, '.env');
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const router = express.Router();

// Lazy load JWT_SECRET
const getSecret = () => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable is required in production.');
    } else {
      return 'nettech_secret_key_2024_pioneer_FALLBACK_NOT_SECURE';
    }
  }
  return JWT_SECRET;
};

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Don't reveal user exists
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Same message for security
    }

    // Token expires in 24 hours
    const SECRET = getSecret();
    const accessToken = jwt.sign(
      { id: admin._id, username: admin.username },
      SECRET,
      { expiresIn: '24h' }
    );

    res.json({ accessToken });
  } catch (error) {
    next(error); // Pass to error handler
  }
});

export default router;
