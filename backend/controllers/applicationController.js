import Application from "../models/Application.js";
import Job from "../models/Job.js";

const VALID_STATUSES = ["pending", "accepted", "rejected"];

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required.",
        success: false,
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(409).json({
        message: "You have already applied for this job.",
        success: false,
      });
    }

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
      status: "pending",
    });

    job.applications.push(newApplication._id);

    await job.save();

    return res.status(201).json({
      message: "Application submitted successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Apply job error:", error);

    return res.status(500).json({
      message: "Failed to submit application.",
      success: false,
    });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;

    const applications = await Application.find({
      applicant: userId,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: {
          path: "created_by",
          select: "name role",
        },
      });

    return res.status(200).json({
      applications,
      success: true,
    });
  } catch (error) {
    console.error("Get applied jobs error:", error);

    return res.status(500).json({
      message: "Failed to fetch applications.",
      success: false,
    });
  }
};

export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate({
      path: "applications",
      populate: {
        path: "applicant",
        select: "name email role profile",
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    if (job.created_by.toString() !== req.id) {
      return res.status(403).json({
        message: "You are not authorized to view applicants for this job.",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.error("Get applicants error:", error);

    return res.status(500).json({
      message: "Failed to fetch applicants.",
      success: false,
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    const normalizedStatus = status?.toLowerCase();

    if (!VALID_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({
        message: `Status must be one of: ${VALID_STATUSES.join(", ")}.`,
        success: false,
      });
    }

    const application = await Application.findById(applicationId).populate({
      path: "job",
      select: "created_by",
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    if (!application.job) {
      return res.status(404).json({
        message: "The job associated with this application no longer exists.",
        success: false,
      });
    }

    if (application.job.created_by.toString() !== req.id) {
      return res.status(403).json({
        message: "You are not authorized to update this application.",
        success: false,
      });
    }

    application.status = normalizedStatus;

    await application.save();

    return res.status(200).json({
      message: "Application status updated successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Update application status error:", error);

    return res.status(500).json({
      message: "Failed to update application status.",
      success: false,
    });
  }
};
