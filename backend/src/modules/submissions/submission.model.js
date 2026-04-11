import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Submission Content
  fileUrl: {
    type: String 
  },
  githubUrl: {
    type: String,
    // SRS Rule: "GitHub links must be valid"
    match: [/^https?:\/\/(www\.)?github\.com\/.+/i, 'Please enter a valid GitHub repository URL']
  },
  
  // Versioning (SRS Rule: "Resubmission allowed (version tracking)")
  version: {
    type: Number,
    default: 1 
  },
  
  // Grading System (SRS Rule: "Instructor grading: Score, Feedback, Status")
  status: {
    type: String,
    enum: ['Pending', 'Graded', 'Returned'],
    default: 'Pending'
  },
  score: {
    type: Number
  },
  feedback: {
    type: String 
  }
}, {
  // We absolutely need timestamps here to check if they submitted before the deadline
  timestamps: true 
});

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
