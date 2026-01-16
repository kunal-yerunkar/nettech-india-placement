import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../src/config/db.js';
import { Record } from '../src/models/Record.js';
import { Lead } from '../src/models/Lead.js';
import { FormSchema } from '../src/models/FormSchema.js';
import { Content } from '../src/models/Content.js';
import { Admin } from '../src/models/Admin.js';
import { PLACED_STUDENTS } from '../../client/data/successData.js';
import {
  JOB_DOMAINS,
  COLLEGE_LIST,
  PROCESS_STEPS,
  FAQS,
  WHY_CHOOSE_US,
  CHALLENGES,
  PARTNER_BENEFITS
} from '../../client/constants.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Uplink established. Beginning Master Hydration...');

    await Promise.all([
      Record.deleteMany({}),
      Lead.deleteMany({}),
      FormSchema.deleteMany({}),
      Content.deleteMany({})
    ]);
    console.log('Stale nodes scrubbed.');

    const archivedStudents = PLACED_STUDENTS.map((s) => ({
      key: 'nt_students',
      data: s
    }));
    await Record.insertMany(archivedStudents);
    console.log(`Migrated ${archivedStudents.length} archives from successData.js`);

    const domainRecords = JOB_DOMAINS.map((d) => ({
      key: 'nt_domains',
      data: d
    }));
    await Record.insertMany(domainRecords);
    console.log(`Injected ${domainRecords.length} domains from constants.js`);

    const contentToSeed = [
      { key: 'nt_content_process', data: PROCESS_STEPS },
      { key: 'nt_content_faqs', data: FAQS },
      { key: 'nt_content_why_choose', data: WHY_CHOOSE_US },
      { key: 'nt_content_challenges', data: CHALLENGES },
      { key: 'nt_content_partner_benefits', data: PARTNER_BENEFITS }
    ];
    await Content.insertMany(contentToSeed);
    console.log('Content hub initialized.');

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
    console.log('Form Architect defaults loaded.');

    const firstNames = ['Aryan', 'Ishaan', 'Vihaan', 'Advait', 'Aavya', 'Ananya', 'Diya', 'Saanvi'];
    const lastNames = ['Sharma', 'Verma', 'Gupta', 'Patel', 'Mehta', 'Iyer', 'Nair', 'Singh'];

    const testLeads = [];
    for (let i = 1; i <= 50; i++) {
      const f = firstNames[Math.floor(Math.random() * firstNames.length)];
      const l = lastNames[Math.floor(Math.random() * lastNames.length)];
      const domain = JOB_DOMAINS[Math.floor(Math.random() * JOB_DOMAINS.length)];

      testLeads.push({
        type: 'student',
        id: `NT-SEED-${1000 + i}`,
        status: ['Pending', 'Processing', 'Responded'][Math.floor(Math.random() * 3)],
        timestamp: new Date().toLocaleString(),
        payload: {
          fullName: `${f} ${l}`,
          email: `${f.toLowerCase()}.${l.toLowerCase()}${i}@example.com`,
          phone: `9${Math.floor(Math.random() * 900000000 + 100000000)}`,
          collegeName: COLLEGE_LIST[Math.floor(Math.random() * COLLEGE_LIST.length)],
          highestQualification: 'B.E / B.Tech',
          passingYear: '2024',
          interestedDomain: domain.title,
          skills: domain.skills.slice(0, 4).join(', ')
        }
      });
    }
    await Lead.insertMany(testLeads);
    console.log('Injected 50 high-fidelity test leads.');

    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({ username: 'admin', password: hashedPassword });
      console.log('Admin Node Reset: admin / admin123');
    }

    console.log('Master Hydration Complete. Database is operational.');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Hydration Failure:', err);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
