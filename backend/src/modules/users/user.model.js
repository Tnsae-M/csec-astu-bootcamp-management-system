import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "instructor", "student"],
      required: true,
      default: "student",
    },
    status: {
      type: String,
      enum: ["active", "suspended", "graduated"],
      required: true,
      default: "active",
    },
    bootcamps: [
      {
        bootcampId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Bootcamp",
          required: true,
        },
      },
    ],
    refreshToken: {
      type: String,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
