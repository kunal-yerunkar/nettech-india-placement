import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Admin } from '../src/models/Admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function createAdmin() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not defined');

    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    const username = 'admin';
    const password = 'admin123';

    // Remove any existing admin with this username to reset it
    await Admin.deleteOne({ username });

    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.wcreate({
      username,
      password: hashedPassword
    });

    console.log(`🚀 Admin user created successfully!`);
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create admin:', error);
    process.exit(1);
  }
}

createAdmin();
