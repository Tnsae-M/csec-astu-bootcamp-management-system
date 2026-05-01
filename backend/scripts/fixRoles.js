import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/modules/users/user.model.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to DB');

    // Find users where role is an array
    const users = await User.find({}).lean();
    let fixed = 0;
    for (const u of users) {
      let current = u.role;
      let newRole = null;

      if (Array.isArray(current)) {
        newRole = String(current[0] || 'student').toLowerCase();
      } else if (typeof current === 'string') {
        const trimmed = current.trim();
        // Some records may have a JSON-stringified array like "[\"admin\"]"
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
          try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) newRole = String(parsed[0] || 'student').toLowerCase();
          } catch (err) {
            // fallthrough
          }
        }
      }

      if (newRole) {
        console.log(`Fixing user ${u.email} role ${JSON.stringify(u.role)} -> ${newRole}`);
        await User.findByIdAndUpdate(u._id, { role: newRole });
        fixed++;
      }
    }

    console.log(`Completed. Fixed ${fixed} users.`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.connection.close();
  }
};

run();
