import jwt from 'jsonwebtoken';

// Use the already loaded process.env.JWT_SECRET from server.js entry point
const getSecret = () => {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    if (process.env.NODE_ENV === 'production') {
      console.error('ERROR: JWT_SECRET environment variable is required in production.');
      throw new Error('JWT_SECRET not configured');
    } else {
      console.warn('WARNING: JWT_SECRET not set. Using fallback (NOT SECURE FOR PRODUCTION).');
      return 'nettech_secret_key_2024_pioneer_FALLBACK_NOT_SECURE';
    }
  }

  return JWT_SECRET;
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied' });
  }

  try {
    const SECRET = getSecret();
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid Token' });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server configuration error' });
  }
};
