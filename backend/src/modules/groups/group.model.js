import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  division: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Division',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['Active', 'Dissolved'],
    default: 'Active'
  }
}, {
  timestamps: true
});

const Group = mongoose.model('Group', groupSchema);

export default Group;
