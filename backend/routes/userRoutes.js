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

const uploadDirectory = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    const extension = path.extname(file.originalname).toLowerCase();

    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
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
      const error = new Error(
        "Only PDF, DOC and DOCX resume files are allowed.",
      );

      error.code = "INVALID_FILE_TYPE";

      return cb(error);
    }

    if (file.mimetype !== expectedMimeType) {
      const error = new Error(
        "The uploaded file type does not match its extension.",
      );

      error.code = "INVALID_FILE_TYPE";

      return cb(error);
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
