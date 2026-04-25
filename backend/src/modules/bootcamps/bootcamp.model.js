import mongoose from "mongoose";
const bootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  divisionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Division",
    required: true,
    index: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  instructors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  status: {
    type: String,
    enum: ["upcoming", "active", "completed"],
    default: "upcoming",
  },
});

export default mongoose.model("Bootcamp", bootcampSchema);
