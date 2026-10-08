import mongoose from "mongoose";

export const isValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};

export const normalizeString = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
};

export const isNonEmptyString = (value) => {
  return typeof value === "string" && value.trim().length > 0;
};

export const isValidEmail = (email) => {
  if (typeof email !== "string") {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const parseRequirements = (requirements) => {
  const values = Array.isArray(requirements)
    ? requirements
    : typeof requirements === "string"
      ? requirements.split(",")
      : [];

  return values
    .filter((requirement) => typeof requirement === "string")
    .map((requirement) => requirement.trim())
    .filter(Boolean);
};
