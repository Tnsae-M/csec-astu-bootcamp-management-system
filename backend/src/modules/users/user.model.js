import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'instructor', 'student'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'graduated'],
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);