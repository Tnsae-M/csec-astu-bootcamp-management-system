import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    title: String,
    description: String,
    division: String,
    instructor: String,
    startTime: Date,
    endTime: Date
});

export default mongoose.model("Session", sessionSchema);