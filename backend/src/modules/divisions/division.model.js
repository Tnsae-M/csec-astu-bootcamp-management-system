import mongoose from 'mongoose';

const divisionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  bootcamp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bootcamp',
    required: true
  }
  
  // Note: Your SRS mentions tracking statistics (total students, total sessions, etc.).
  // Instead of storing hardcoded numbers that easily get out of sync, 
  // it is a best practice to calculate those stats dynamically down in the Service layer
  // using MongoDB Aggregation when the Admin requests them.
}, {
  timestamps: true
});

const Division = mongoose.model('Division', divisionSchema);

export default Division;
