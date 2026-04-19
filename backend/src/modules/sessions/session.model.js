import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    bootcamp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bootcamp",
      required: true,
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    location: {
      type: String,
    },

    onlineLink: {
      type: String,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["scheduled", "cancelled", "completed"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

// BUSINESS RULES
sessionSchema.pre("save", function (next) {
  if (!this.location && !this.onlineLink) {
    return next(new Error("Either location or onlineLink must be provided"));
  }

  const duration = (this.endTime - this.startTime) / (1000 * 60);
  if (duration < 30) {
    return next(new Error("Session must be at least 30 minutes long"));
  }

  next();
});

export default mongoose.model("Session", sessionSchema);