import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['candidate', 'recruiter'],
    required: true,
  },
  profile: {
    bio: { type: String, default: '' },
    skills: [{ type: String }],
    resume: { type: String, default: '' }, // URL or local path
    resumeOriginalName: { type: String, default: '' },
    profilePhoto: { type: String, default: '' }
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
