import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tracks exactly which team member submitted the update
    required: true
  },
  weekNumber: {
    type: Number,
    required: true,
    min: 1
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    // SRS Rule: "Description (≥50 characters)"
    minlength: [50, 'The weekly progress description must be at least 50 characters long'],
    trim: true
  },
  fileUrl: {
    type: String // SRS Rule: "Optional file/link"
  },
  linkUrl: {
    type: String 
  }
}, {
  timestamps: true
});

// SRS Rule: "One submission per group per week"
// The compound index forces the database to reject a second submission for the same week from the same group
progressSchema.index({ group: 1, weekNumber: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
