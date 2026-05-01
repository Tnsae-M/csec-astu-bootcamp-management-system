import mongoose from 'mongoose';

const groupProgressSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  bootcampId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bootcamp',
    required: true
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weekNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    minlength: [50, "Description must be at least 50 characters"]
  },
  links: [String],
  attachments: [String],
  status: {
    type: String,
    enum: ['submitted', 'reviewed'],
    default: 'submitted'
  }
}, { timestamps: true });

// Prevent multiple submissions for same group and week
groupProgressSchema.index({ groupId: 1, weekNumber: 1 }, { unique: true });

const GroupProgress = mongoose.model('GroupProgress', groupProgressSchema);
export default GroupProgress;
