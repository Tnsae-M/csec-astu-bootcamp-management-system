import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  division: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Division',
    required: true
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session' // Optional: Resources can be generic to the division, or tied to a single specific class session
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Instructor who posted it
    required: true
  },
  type: {
    type: String,
    enum: ['PDF', 'Video', 'Image', 'ZIP', 'Link'], // Exact mapping from SRS Upload Types
    required: true
  },
  url: {
    type: String,
    required: true // Cloudinary URL or External Link
  },
  downloads: {
    type: Number,
    default: 0 // Initial download tracker count!
  }
}, {
  timestamps: true
});

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
