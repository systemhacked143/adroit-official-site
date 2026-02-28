import 'dotenv/config';
import mongoose from 'mongoose';
import Member from '../src/models/members.js';

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/club-members';

const sampleMembers = [
  { name: 'Aarav Sharma', role: 'President', email: 'aarav.president@adro.it', domain: 'ml', year: '4th', department: 'CSE', bio: 'Leads AdroIT with a focus on ML research.' },
  { name: 'Meera Patel', role: 'Vice President', email: 'meera.vp@adro.it', domain: 'cc', year: '4th', department: 'IT', bio: 'Coordinates cloud initiatives and partnerships.' },
  { name: 'Rohan Gupta', role: 'Domain Head', email: 'rohan.ml@adro.it', domain: 'ml', year: '3rd', department: 'CSE' },
  { name: 'Priya Nair', role: 'Domain Head', email: 'priya.cc@adro.it', domain: 'cc', year: '3rd', department: 'IT' },
  { name: 'Vikram Singh', role: 'Domain Head', email: 'vikram.cy@adro.it', domain: 'cy', year: '3rd', department: 'CSE' },
  { name: 'Nisha Rao', role: 'Domain Head', email: 'nisha.da@adro.it', domain: 'da', year: '3rd', department: 'Data Science' },
  { name: 'Ankit Verma', role: 'Project & Development Head', email: 'ankit.pd@adro.it', domain: 'ml', year: '3rd' },
  { name: 'Sana Khan', role: 'Project & Development Head', email: 'sana.pd@adro.it', domain: 'cc', year: '3rd' },
  { name: 'Aditi Rao', role: 'Events & Outreach Head', email: 'aditi.events@adro.it', domain: 'da', year: '2nd' },
  { name: 'Karan Mehta', role: 'Social Media Lead', email: 'karan.social@adro.it', domain: 'cy', year: '2nd' },
  { name: 'Ritu Singh', role: 'Senior Core Member', email: 'ritu.sc@adro.it', domain: 'ml', year: '2nd' },
  { name: 'Dev Chopra', role: 'Senior Core Member', email: 'dev.sc@adro.it', domain: 'cc', year: '2nd' },
  { name: 'Maya Iyer', role: 'Senior Core Member', email: 'maya.sc@adro.it', domain: 'cy', year: '2nd' },
  { name: 'Rahul Jain', role: 'Senior Core Member', email: 'rahul.sc@adro.it', domain: 'da', year: '2nd' }
];

async function seed(){
  try{
    await mongoose.connect(MONGO);
    console.log('Connected to', MONGO);

    // Insert many; ignore duplicates
    const result = await Member.insertMany(sampleMembers, { ordered: false }).catch(e => e);

    if (Array.isArray(result)) {
      console.log(`Inserted ${result.length} members.`);
    } else if (result && result.writeErrors) {
      const inserted = (result.result && result.result.nInserted) || 0;
      console.log(`Inserted ${inserted} members (with some duplicates/errors).`);
    } else {
      console.log('Insert result:', result);
    }

    const count = await Member.countDocuments();
    console.log('Total members in DB:', count);

    await mongoose.disconnect();
    process.exit(0);
  }catch(err){
    console.error('Seeding failed:', err.message || err);
    process.exit(1);
  }
}

seed();
