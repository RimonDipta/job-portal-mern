import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: 'A user already exists with this email address.',
        success: false
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false
      });
    }

    const tokenData = {
      userId: user._id
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile
    };

    return res.status(200).cookie("token", token, {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'strict'
    }).json({
      message: `Welcome back, ${user.name}!`,
      user: userResponse,
      token,
      success: true
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, bio, skills } = req.body;
    
    let resume = '';
    let resumeOriginalName = '';
    
    if (req.file) {
      resume = `/uploads/${req.file.filename}`;
      resumeOriginalName = req.file.originalname;
    }

    const userId = req.id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false
      });
    }

    // Update Profile Fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (bio !== undefined) user.profile.bio = bio;
    
    if (skills !== undefined) {
      user.profile.skills = Array.isArray(skills) 
        ? skills 
        : skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    
    if (resume) {
      user.profile.resume = resume;
      user.profile.resumeOriginalName = resumeOriginalName;
    }

    await user.save();

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile
    };

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: userResponse,
      success: true
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};
