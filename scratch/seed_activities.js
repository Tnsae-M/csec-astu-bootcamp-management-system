import mongoose from 'mongoose';
import Activity from './backend/src/modules/audit/activity.model.js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/csec-astu-bootcamp';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to DB');

  const samples = [
    { user: "Admin", action: "Division Node Modified", type: "system", details: "Core division structure optimized for scaling." },
    { user: "Instructor", action: "Session Registry Updated", type: "academic", details: "Cybersecurity Advanced session updated with new resources." },
    { user: "System", action: "Automatic Backup Successful", type: "maintenance", details: "Nightly snapshot stored in secure cloud vault." },
    { user: "Super Admin", action: "User Access Revoked", type: "security", details: "Unauthorized access attempt blocked; user account locked." },
  ];

  await Activity.deleteMany({});
  await Activity.insertMany(samples);
  console.log('Seed successful');
  process.exit();
}

seed();
