import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  user: { type: String, required: true },
  action: { type: String, required: true },
  type: { type: String, enum: ['system', 'academic', 'security', 'maintenance'], default: 'system' },
  details: { type: String },
}, { timestamps: true });

export default mongoose.model('Activity', activitySchema);
