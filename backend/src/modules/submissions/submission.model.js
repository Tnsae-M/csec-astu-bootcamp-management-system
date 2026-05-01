import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String, // text / link
    },

    fileUrl: {
      type: String, // optional (future: file upload)
    },

    type: {
      type: String,
      enum: ["link", "text", "file", "both"],
      required: true,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["submitted", "late", "graded"],
      default: "submitted",
    },

    score: {
      type: Number,
      default: null,
    },

    feedback: {
      type: String,
    },

    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

//  prevent duplicate submission per task
submissionSchema.index({ taskId: 1, studentId: 1 }, { unique: true });

export default mongoose.model("Submission", submissionSchema);