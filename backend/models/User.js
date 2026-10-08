import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["candidate", "recruiter"],
      required: true,
    },
    profile: {
      bio: {
        type: String,
        default: "",
        maxlength: 2000,
      },
      skills: [
        {
          type: String,
          trim: true,
          maxlength: 100,
        },
      ],
      resume: {
        type: String,
        default: "",
      },
      resumeOriginalName: {
        type: String,
        default: "",
        maxlength: 255,
      },
      profilePhoto: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
