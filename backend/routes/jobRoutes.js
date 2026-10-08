import express from "express";
import {
  postJob,
  getAllJobs,
  getJobById,
  getAdminJobs,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import { isAuthenticated, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Public job discovery.
router.get("/get", getAllJobs);
router.get("/get/:id", getJobById);

// Recruiter-only job management.
router.post("/post", isAuthenticated, requireRole("recruiter"), postJob);

router.get(
  "/getadminjobs",
  isAuthenticated,
  requireRole("recruiter"),
  getAdminJobs,
);

router.put("/update/:id", isAuthenticated, requireRole("recruiter"), updateJob);

router.delete(
  "/delete/:id",
  isAuthenticated,
  requireRole("recruiter"),
  deleteJob,
);

export default router;
