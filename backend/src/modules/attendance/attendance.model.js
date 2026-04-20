import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },

    bootcampId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bootcamp",
      required: true,
    },

    status: {
      type: String,
      enum: ["present", "absent", "late"],
      default: "present",
    },

    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // instructor/admin
    },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);