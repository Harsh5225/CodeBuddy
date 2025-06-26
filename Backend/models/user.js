// Make sure your User schema includes these fields for the profile update to work
import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      require: true,
      minLength: 3,
      maxLength: 20,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 20,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      immutable: true,
    },
    age: {
      type: Number,
      min: 6,
      max: 80,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    problemSolved: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Problem",
          unique: true,
        },
      ],
    },
    password: {
      type: String,
      required: true,
    },
    // Add these fields for the profile update functionality
    location: {
      type: String,
      maxLength: 50,
      trim: true,
    },
    jobTitle: {
      type: String,
      maxLength: 100,
      trim: true,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
    },
    streak: {
      type: Number,
      min: 0,
      default: 0,
    },
    photoUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
