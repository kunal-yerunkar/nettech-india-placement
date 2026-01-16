import dotenv from 'dotenv';
dotenv.config(); // Must be called before any other imports that use process.env

import bcrypt from 'bcryptjs';
import app from './app.js';
import { connectDB } from './config/db.js';
import { Admin } from './models/Admin.js';

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    console.log('NetTech Deployment Database Secured');

    const isProduction = process.env.NODE_ENV === 'production';
    const adminCount = await Admin.countDocuments();
    
    // Only create default admin in development
    if (adminCount === 0 && !isProduction) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({ username: 'admin', password: hashedPassword });
      console.log('⚠️  Development: Default admin created (admin / admin123)');
      console.log('⚠️  WARNING: Change default credentials before production!');
    } else if (adminCount === 0 && isProduction) {
      console.error('ERROR: No admin user found. Please create an admin user manually.');
      console.error('Run: node scripts/create-admin.js <username> <password>');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('❌ Server startup failed:', err);
    process.exit(1);
  }
};

start();
