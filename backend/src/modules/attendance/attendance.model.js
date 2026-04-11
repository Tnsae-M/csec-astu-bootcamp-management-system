import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late', 'Excused'],
    required: true
  },
  note: {
    type: String, // SRS says: "Excused requires note"
    trim: true
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // To track if an instructor marked it, or the student checked in themselves
  }
}, {
  timestamps: true
});

// Enforce Business Rule: "One record per student per session"
// This stops MongoDB from ever saving duplicate attendance for the same class
attendanceSchema.index({ session: 1, student: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
