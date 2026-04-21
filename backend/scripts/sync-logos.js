import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from the backend directory
dotenv.config({ path: path.join(__dirname, '../.env') });

import { Record } from '../src/models/Record.js';

const logoDir = path.join(__dirname, '../../client/images/PartnerLogo');

async function seedLogos() {
  try {
    const uri = process.env.MONGODB_URI;
    console.log(`Connecting to: ${uri ? uri.substring(0, 20) + '...' : 'UNDEFINED'}`);

    if (!uri) throw new Error('MONGODB_URI is not defined in .env');

    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB for Logo Sync');

    const files = fs.readdirSync(logoDir);
    const logos = files.filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.webp') || f.endsWith('.svg') || f.endsWith('.gif'));

    console.log(`🔍 Found ${logos.length} logos in directory.`);

    // Clear existing partner records
    await Record.deleteMany({ key: 'nt_partners' });

    const partnerRecords = logos.map(filename => {
      const name = path.parse(filename).name;
      // Convert filename to a URL-safe format if necessary, though getSafeUrl handles it on frontend
      return {
        key: 'nt_partners',
        data: {
          name: name,
          logo: `/images/PartnerLogo/${filename}`,
          id: Date.now() + Math.random()
        }
      };
    });

    await Record.insertMany(partnerRecords);
    console.log(`🚀 Successfully uploaded ${partnerRecords.length} partners to database.`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  }
}

seedLogos();
