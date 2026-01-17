import dotenv from 'dotenv';
dotenv.config(); // Must be called before any other imports that use process.env

import bcrypt from 'bcryptjs';
import app from './app.js';
import { connectDB } from './config/db.js';
import { Admin } from './models/Admin.js';
import { Record } from './models/Record.js';
import { FormSchema } from './models/FormSchema.js';
import { Content } from './models/Content.js';
import { Lead } from './models/Lead.js';
import { PLACED_STUDENTS } from '../../client/data/successData.js';
import { JOB_DOMAINS, PROCESS_STEPS, FAQS, WHY_CHOOSE_US, CHALLENGES, PARTNER_BENEFITS } from '../../client/constants.js';

const PORT = process.env.PORT || 5000;

const resetAndBootstrap = async () => {
  const confirm = process.env.RESET_CONFIRM === 'ERASE';
  if (process.env.RESET_DB === 'true' && confirm) {
    await Promise.all([
      Record.deleteMany({}),
      Lead.deleteMany({}),
      FormSchema.deleteMany({}),
      Content.deleteMany({}),
      Admin.deleteMany({})
    ]);
  }
  const archivedStudents = PLACED_STUDENTS.map((s) => ({ key: 'nt_students', data: s }));
  const domainRecords = JOB_DOMAINS.map((d) => ({ key: 'nt_domains', data: d }));
  if (archivedStudents.length) await Record.insertMany(archivedStudents);
  if (domainRecords.length) await Record.insertMany(domainRecords);
  const contentToSeed = [
    { key: 'nt_content_process', data: PROCESS_STEPS },
    { key: 'nt_content_faqs', data: FAQS },
    { key: 'nt_content_why_choose', data: WHY_CHOOSE_US },
    { key: 'nt_content_challenges', data: CHALLENGES },
    { key: 'nt_content_partner_benefits', data: PARTNER_BENEFITS }
  ];
  await Content.insertMany(contentToSeed);
  const defaultSchemas = [
    {
      type: 'student',
      fields: [
        { id: 101, label: 'State', name: 'state', type: 'text', required: true, system: true },
        { id: 102, label: 'City', name: 'city', type: 'text', required: true, system: true }
      ]
    },
    { type: 'partner', fields: [] },
    { type: 'inquiry', fields: [] }
  ];
  await FormSchema.insertMany(defaultSchemas);
  const u = process.env.BOOTSTRAP_ADMIN_USER;
  const p = process.env.BOOTSTRAP_ADMIN_PASS;
  if (u && p) {
    const hashedPassword = await bcrypt.hash(p, 10);
    await Admin.create({ username: u, password: hashedPassword });
  }
};

const bootstrapIfEmpty = async () => {
  const recordCount = await Record.countDocuments();
  if (recordCount === 0) {
    const archivedStudents = PLACED_STUDENTS.map((s) => ({ key: 'nt_students', data: s }));
    const domainRecords = JOB_DOMAINS.map((d) => ({ key: 'nt_domains', data: d }));
    if (archivedStudents.length) await Record.insertMany(archivedStudents);
    if (domainRecords.length) await Record.insertMany(domainRecords);
  }
  const contentCount = await Content.countDocuments();
  if (contentCount === 0) {
    const contentToSeed = [
      { key: 'nt_content_process', data: PROCESS_STEPS },
      { key: 'nt_content_faqs', data: FAQS },
      { key: 'nt_content_why_choose', data: WHY_CHOOSE_US },
      { key: 'nt_content_challenges', data: CHALLENGES },
      { key: 'nt_content_partner_benefits', data: PARTNER_BENEFITS }
    ];
    await Content.insertMany(contentToSeed);
  }
  const schemaCount = await FormSchema.countDocuments();
  if (schemaCount === 0) {
    const defaultSchemas = [
      {
        type: 'student',
        fields: [
          { id: 101, label: 'State', name: 'state', type: 'text', required: true, system: true },
          { id: 102, label: 'City', name: 'city', type: 'text', required: true, system: true }
        ]
      },
      { type: 'partner', fields: [] },
      { type: 'inquiry', fields: [] }
    ];
    await FormSchema.insertMany(defaultSchemas);
  }
};

const start = async () => {
  try {
    await connectDB();
    console.log('NetTech Deployment Database Secured');

    const isProduction = process.env.NODE_ENV === 'production';
    const shouldReset = process.env.RESET_DB === 'true' && process.env.RESET_CONFIRM === 'ERASE';
    const shouldBootstrap = process.env.AUTO_BOOTSTRAP === 'true' || shouldReset;
    if (shouldBootstrap) {
      if (shouldReset) {
        await resetAndBootstrap();
      } else {
        await bootstrapIfEmpty();
      }
    }
    const adminCount = await Admin.countDocuments();

    if (adminCount === 0) {
      if (!isProduction) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await Admin.create({ username: 'admin', password: hashedPassword });
        console.log('⚠️  Development: Default admin created (admin / admin123)');
        console.log('⚠️  WARNING: Change default credentials before production!');
      } else {
        const u = process.env.BOOTSTRAP_ADMIN_USER;
        const p = process.env.BOOTSTRAP_ADMIN_PASS;
        if (u && p) {
          const hashedPassword = await bcrypt.hash(p, 10);
          await Admin.create({ username: u, password: hashedPassword });
          console.log('Admin user created from environment variables');
        } else {
          console.error('ERROR: No admin user found. Please create an admin user manually.');
          console.error('Run: node scripts/create-admin.js <username> <password>');
          process.exit(1);
        }
      }
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
