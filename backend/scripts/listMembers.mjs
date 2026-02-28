import 'dotenv/config';
import mongoose from 'mongoose';
import Member from '../src/models/members.js';

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/club-members';

async function main(){
  try{
    await mongoose.connect(MONGO, { dbName: undefined });
    console.log('Connected to', MONGO);
    const members = await Member.find().lean();
    console.log(JSON.stringify(members, null, 2));
    await mongoose.disconnect();
    process.exit(0);
  }catch(err){
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}

main();
