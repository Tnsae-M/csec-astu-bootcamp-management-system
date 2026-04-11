import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5 // SRS Rule: "Students rate sessions (1–5)"
  },
  comment: {
    type: String, // SRS Rule: "Optional comments"
    trim: true
  }
}, {
  timestamps: true
});

// SRS Rule: "One feedback per session per student"
// Compound index ensures MongoDB instantly blocks duplicate reviews
feedbackSchema.index({ session: 1, student: 1 }, { unique: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
