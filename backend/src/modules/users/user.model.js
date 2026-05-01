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
    roles: {
      type: [String],
      enum: ["SUPER ADMIN", "ADMIN", "INSTRUCTOR", "STUDENT"],
      required: true,
      default: ["STUDENT"],
    },
    status: {
      type: String,
      enum: ["active", "suspended", "graduated"],
      required: true,
      default: "active",
    },
    divisionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Division",
      default: null,
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

    isEmailVerified: {
  type: Boolean,
  default: false,
},

emailVerificationToken: {
  type: String,
  default: null,
},

emailVerificationExpires: {
  type: Date,
  default: null,
},
  },
  {
    timestamps: true,
  },
);

userSchema.pre('init', function(doc) {
  if (doc.role) {
    const legacyRoles = Array.isArray(doc.role) ? doc.role : [doc.role];
    const rolesArray = Array.isArray(doc.roles) ? doc.roles : [];
    
    if (rolesArray.length === 0) {
      doc.roles = legacyRoles.map(r => String(r).toUpperCase());
    }
  }
});

userSchema.pre('validate', function() {
  if (this.role) {
    const legacyRoles = Array.isArray(this.role) ? this.role : [this.role];
    const rolesArray = Array.isArray(this.roles) ? this.roles : [];
    
    if (rolesArray.length === 0) {
      this.roles = legacyRoles.map(r => String(r).toUpperCase());
    }
  }
});

export default mongoose.model("User", userSchema);
