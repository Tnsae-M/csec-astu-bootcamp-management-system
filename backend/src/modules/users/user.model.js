import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6 
  },
  role: {
    type: String,
    enum: ['Admin', 'Instructor', 'Student'],
    required: true
  },
  divisions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Division'
  }],
  status: {
    type: String,
    enum: ['Active', 'Suspended', 'Graduated'],
    default: 'Active'
  }
}, {
  timestamps: true 
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
