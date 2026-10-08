import express from "express";
import {
  register,
  login,
  logout,
  updateProfile,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads", { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        path.extname(file.originalname).toLowerCase(),
    );
  },
});

const allowedFileTypes = new Map([
  [".pdf", "application/pdf"],
  [".doc", "application/msword"],
  [
    ".docx",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
]);

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const expectedMimeType = allowedFileTypes.get(extension);

    if (!expectedMimeType) {
      return cb(new Error("Only PDF, DOC and DOCX resume files are allowed."));
    }

    if (file.mimetype !== expectedMimeType) {
      return cb(
        new Error("The uploaded file type does not match its extension."),
      );
    }

    cb(null, true);
  },
});

router.post("/register", register);

router.post("/login", login);

router.get("/logout", logout);

router.put(
  "/profile/update",
  isAuthenticated,
  upload.single("resume"),
  updateProfile,
);

export default router;
