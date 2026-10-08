import path from "path";
import User from "../models/User.js";
import Application from "../models/Application.js";
import Job from "../models/Job.js";

export const authorizeResumeAccess = async (req, res, next) => {
  try {
    const requestedPath = req.path;
    const filename = path.basename(requestedPath);

    // Only allow direct resume filenames.
    if (!filename || filename === "." || requestedPath !== `/${filename}`) {
      return res.status(404).json({
        message: "Resume not found.",
        success: false,
      });
    }

    const resumePath = `/uploads/${filename}`;

    const owner = await User.findOne({
      "profile.resume": resumePath,
    }).select("_id role");

    if (!owner) {
      return res.status(404).json({
        message: "Resume not found.",
        success: false,
      });
    }

    // Users can always access their own resume.
    if (owner._id.toString() === req.id) {
      return next();
    }

    // Candidates cannot access another candidate's resume.
    if (req.user?.role !== "recruiter") {
      return res.status(403).json({
        message: "You do not have permission to access this resume.",
        success: false,
      });
    }

    // Find applications belonging to this candidate.
    const applicationIds = await Application.distinct("_id", {
      applicant: owner._id,
    });

    if (applicationIds.length === 0) {
      return res.status(403).json({
        message: "You do not have permission to access this resume.",
        success: false,
      });
    }

    // The recruiter may access the resume only if the candidate
    // applied to one of that recruiter's jobs.
    const recruiterOwnsJob = await Job.exists({
      created_by: req.id,
      applications: {
        $in: applicationIds,
      },
    });

    if (!recruiterOwnsJob) {
      return res.status(403).json({
        message: "You do not have permission to access this resume.",
        success: false,
      });
    }

    return next();
  } catch (error) {
    console.error("Resume authorization error:", error);

    return res.status(500).json({
      message: "Unable to authorize resume access.",
      success: false,
    });
  }
};
