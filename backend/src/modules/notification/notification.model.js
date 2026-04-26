import mongoose from "mongoose";

const notificationSchema=new mongoose.Schema({
    type:{
        type:String,
        enum:["session_created","session_cancelled","task_reminder","submission_graded","weekly_progress_alert"]
    },
    title:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    is_read:{
        type:Boolean,
        default:false
    },
    related_id:{
        type:String
    },
    notification_id:{
        type:String
    },
    channels: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
    },
    metadata: {
      sessionId: String,
      taskId: String,
      submissionId: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    }
 },
 {timestamps:true}
);
export default mongoose.model("Notification",notificationSchema);