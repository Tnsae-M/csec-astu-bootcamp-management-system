import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    bootcampId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bootcamp",
    },

    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },

    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    comment: {
      type: String,
      trim: true,
    },
    isAnonymous: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

//  prevent duplicate feedback per context
feedbackSchema.index(
  { studentId: 1, bootcampId: 1, sessionId: 1 },
  { unique: true }
);

export default mongoose.model("Feedback", feedbackSchema);