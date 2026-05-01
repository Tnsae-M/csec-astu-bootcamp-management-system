import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  meta: { type: Object, default: {} },
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);
