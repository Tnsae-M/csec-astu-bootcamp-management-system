import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/modules/users/user.model.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to DB');

    const users = await User.find({}).lean();
    console.log('Users:');
    users.forEach(u => {
      console.log(`${u.email} | role=${JSON.stringify(u.role)} | verified=${u.isEmailVerified} | status=${u.status}`);
    });
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.connection.close();
  }
};

run();
