import express from "express";
import {
  applyJob,
  getAppliedJobs,
  getApplicants,
  updateStatus,
} from "../controllers/applicationController.js";
import { isAuthenticated, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Candidate application workflow.
router.post("/apply/:id", isAuthenticated, requireRole("candidate"), applyJob);

router.get("/get", isAuthenticated, requireRole("candidate"), getAppliedJobs);

// Recruiter application-management workflow.
router.get(
  "/:id/applicants",
  isAuthenticated,
  requireRole("recruiter"),
  getApplicants,
);

router.put(
  "/status/:id/update",
  isAuthenticated,
  requireRole("recruiter"),
  updateStatus,
);

export default router;
