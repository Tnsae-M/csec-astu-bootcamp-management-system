import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  division: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Division',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // The Instructor who assigned the task
    required: true
  },
  submissionType: {
    type: String,
    enum: ['File', 'GitHub link', 'Both'],
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  maxScore: {
    type: Number,
    required: true,
    min: 0 // Scoring system: baseline must be 0
  }
}, {
  timestamps: true // Automatically tracks createdAt for when the assignment was posted
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
