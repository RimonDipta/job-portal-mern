import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  isNonEmptyString,
  isValidEmail,
  normalizeString,
} from "../utils/validation.js";

const VALID_ROLES = ["candidate", "recruiter"];

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const normalizedName = normalizeString(name);
    const normalizedEmail = normalizeString(email).toLowerCase();
    const normalizedRole = normalizeString(role).toLowerCase();

    if (
      !isNonEmptyString(normalizedName) ||
      !isNonEmptyString(normalizedEmail) ||
      !isNonEmptyString(password) ||
      !isNonEmptyString(normalizedRole)
    ) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    if (normalizedName.length < 2 || normalizedName.length > 100) {
      return res.status(400).json({
        message: "Name must be between 2 and 100 characters.",
        success: false,
      });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
        success: false,
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
        success: false,
      });
    }

    if (!VALID_ROLES.includes(normalizedRole)) {
      return res.status(400).json({
        message: "Role must be either candidate or recruiter.",
        success: false,
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "A user already exists with this email address.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      role: normalizedRole,
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Register error:", error);

    if (error?.code === 11000) {
      return res.status(409).json({
        message: "A user already exists with this email address.",
        success: false,
      });
    }

    return res.status(500).json({
      message: "Registration failed.",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = normalizeString(email).toLowerCase();

    if (!isNonEmptyString(normalizedEmail) || !isNonEmptyString(password)) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
        success: false,
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back, ${user.name}!`,
        user: userResponse,
        token,
        success: true,
      });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Login failed.",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: "Logged out successfully.",
        success: true,
      });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      message: "Logout failed.",
      success: false,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, bio, skills } = req.body;

    const user = await User.findById(req.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    if (name !== undefined) {
      const normalizedName = normalizeString(name);

      if (normalizedName.length < 2 || normalizedName.length > 100) {
        return res.status(400).json({
          message: "Name must be between 2 and 100 characters.",
          success: false,
        });
      }

      user.name = normalizedName;
    }

    if (email !== undefined) {
      const normalizedEmail = normalizeString(email).toLowerCase();

      if (!isValidEmail(normalizedEmail)) {
        return res.status(400).json({
          message: "Please provide a valid email address.",
          success: false,
        });
      }

      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "A user already exists with this email address.",
          success: false,
        });
      }

      user.email = normalizedEmail;
    }

    if (bio !== undefined) {
      if (typeof bio !== "string") {
        return res.status(400).json({
          message: "Bio must be text.",
          success: false,
        });
      }

      const normalizedBio = bio.trim();

      if (normalizedBio.length > 2000) {
        return res.status(400).json({
          message: "Bio cannot exceed 2000 characters.",
          success: false,
        });
      }

      user.profile.bio = normalizedBio;
    }

    if (skills !== undefined) {
      const parsedSkills = Array.isArray(skills)
        ? skills
        : typeof skills === "string"
          ? skills.split(",")
          : null;

      if (!parsedSkills) {
        return res.status(400).json({
          message: "Skills must be provided as text or an array.",
          success: false,
        });
      }

      const normalizedSkills = parsedSkills
        .filter((skill) => typeof skill === "string")
        .map((skill) => skill.trim())
        .filter(Boolean);

      if (normalizedSkills.length > 30) {
        return res.status(400).json({
          message: "You can add up to 30 skills.",
          success: false,
        });
      }

      user.profile.skills = normalizedSkills;
    }

    if (req.file) {
      user.profile.resume = `/uploads/${req.file.filename}`;
      user.profile.resumeOriginalName = req.file.originalname;
    }

    await user.save();

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: userResponse,
      success: true,
    });
  } catch (error) {
    console.error("Profile update error:", error);

    if (error?.code === 11000) {
      return res.status(409).json({
        message: "A user already exists with this email address.",
        success: false,
      });
    }

    return res.status(500).json({
      message: "Profile update failed.",
      success: false,
    });
  }
};
