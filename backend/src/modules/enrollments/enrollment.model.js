import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  division: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Division',
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Dropped', 'Graduated'],
    default: 'Active'
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Business Rule: A student cannot be enrolled in the exact same division twice!
// We use a compound index to force MongoDB to reject duplicates.
enrollmentSchema.index({ student: 1, division: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;
