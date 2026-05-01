import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ["document", "link", "other"], default: "document" },
    url: { type: String },
    fileUrl: { type: String },
    bootcampId: { type: mongoose.Schema.Types.ObjectId, ref: "Bootcamp", required: true },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Resource", resourceSchema);
