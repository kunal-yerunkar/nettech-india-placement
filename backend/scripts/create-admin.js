import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from '../src/config/db.js';
import { Admin } from '../src/models/Admin.js';

dotenv.config();

const createAdmin = async () => {
  try {
    const username = process.argv[2];
    const password = process.argv[3];

    if (!username || !password) {
      console.error('Usage: node scripts/create-admin.js <username> <password>');
      console.error('Example: node scripts/create-admin.js admin MySecurePassword123!');
      process.exit(1);
    }

    if (password.length < 8) {
      console.error('ERROR: Password must be at least 8 characters long.');
      process.exit(1);
    }

    await connectDB();
    console.log('✅ Connected to database');

    const existing = await Admin.findOne({ username });
    if (existing) {
      console.error(`ERROR: Admin user "${username}" already exists.`);
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({ username, password: hashedPassword });

    console.log(`✅ Admin user "${username}" created successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
