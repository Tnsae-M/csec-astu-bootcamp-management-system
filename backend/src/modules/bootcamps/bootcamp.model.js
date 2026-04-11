import mongoose from 'mongoose';


const bootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // e.g. "Summer 2025 Backend Bootcamp"
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Active', 'Completed'],
    default: 'Upcoming'
  }
}, {
  timestamps: true
});

// We ensure that the end date is actually after the start date
bootcampSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    return next(new Error('End date must be after the start date'));
  }
  next();
});

const Bootcamp = mongoose.model('Bootcamp', bootcampSchema);

export default mongoose.model("Bootcamp", bootcampSchema);
