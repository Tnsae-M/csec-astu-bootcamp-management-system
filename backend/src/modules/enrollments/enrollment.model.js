import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    bootcampId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bootcamp",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "completed", "dropped"],
      default: "active",
    },

    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

//  Prevent duplicate enrollment
enrollmentSchema.index({ userId: 1, bootcampId: 1 }, { unique: true });

export default mongoose.model("Enrollment", enrollmentSchema);