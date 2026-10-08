import Job from "../models/Job.js";
import Application from "../models/Application.js";
import {
  escapeRegex,
  isNonEmptyString,
  isValidObjectId,
  normalizeString,
  parseRequirements,
} from "../utils/validation.js";

const recruiterFields = "name role";

const validateJobFields = ({
  title,
  description,
  requirements,
  salary,
  location,
  jobType,
  position,
  company,
}) => {
  const fields = {
    title,
    description,
    salary,
    location,
    jobType,
    company,
  };

  for (const [field, value] of Object.entries(fields)) {
    if (!isNonEmptyString(value)) {
      return `${field} is required.`;
    }
  }

  const parsedRequirements = parseRequirements(requirements);

  if (parsedRequirements.length === 0) {
    return "At least one job requirement is required.";
  }

  const parsedPosition = Number(position);

  if (!Number.isInteger(parsedPosition) || parsedPosition < 1) {
    return "Positions must be a positive whole number.";
  }

  return null;
};

export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      position,
      company,
    } = req.body;

    const validationError = validateJobFields({
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      position,
      company,
    });

    if (validationError) {
      return res.status(400).json({
        message: validationError,
        success: false,
      });
    }

    const parsedRequirements = parseRequirements(requirements);
    const parsedPosition = Number(position);

    const job = await Job.create({
      title: normalizeString(title),
      description: normalizeString(description),
      requirements: parsedRequirements,
      salary: normalizeString(salary),
      location: normalizeString(location),
      jobType: normalizeString(jobType),
      position: parsedPosition,
      company: normalizeString(company),
      created_by: req.id,
    });

    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.error("Post job error:", error);

    return res.status(500).json({
      message: "Failed to create job.",
      success: false,
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = normalizeString(req.query.keyword);
    const category = normalizeString(req.query.category);
    const location = normalizeString(req.query.location);

    const query = {};
    const searchConditions = [];

    if (keyword) {
      const safeKeyword = escapeRegex(keyword);

      searchConditions.push(
        { title: { $regex: safeKeyword, $options: "i" } },
        { description: { $regex: safeKeyword, $options: "i" } },
        { company: { $regex: safeKeyword, $options: "i" } },
      );
    }

    if (category) {
      const safeCategory = escapeRegex(category);

      searchConditions.push(
        { title: { $regex: safeCategory, $options: "i" } },
        { description: { $regex: safeCategory, $options: "i" } },
      );
    }

    if (searchConditions.length > 0) {
      query.$or = searchConditions;
    }

    if (location) {
      query.location = {
        $regex: escapeRegex(location),
        $options: "i",
      };
    }

    const jobs = await Job.find(query)
      .populate({
        path: "created_by",
        select: recruiterFields,
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.error("Get jobs error:", error);

    return res.status(500).json({
      message: "Failed to fetch jobs.",
      success: false,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { id: jobId } = req.params;

    if (!isValidObjectId(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID.",
        success: false,
      });
    }

    const job = await Job.findById(jobId).populate({
      path: "created_by",
      select: recruiterFields,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.error("Get job by ID error:", error);

    return res.status(500).json({
      message: "Failed to fetch job details.",
      success: false,
    });
  }
};

export const getAdminJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      created_by: req.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.error("Get recruiter jobs error:", error);

    return res.status(500).json({
      message: "Failed to fetch your jobs.",
      success: false,
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;

    if (!isValidObjectId(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID.",
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

    if (job.created_by.toString() !== req.id) {
      return res.status(403).json({
        message: "You are not authorized to update this job.",
        success: false,
      });
    }

    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      position,
      company,
    } = req.body;

    if (title !== undefined) {
      if (!isNonEmptyString(title)) {
        return res.status(400).json({
          message: "Title cannot be empty.",
          success: false,
        });
      }

      job.title = normalizeString(title);
    }

    if (description !== undefined) {
      if (!isNonEmptyString(description)) {
        return res.status(400).json({
          message: "Description cannot be empty.",
          success: false,
        });
      }

      job.description = normalizeString(description);
    }

    if (requirements !== undefined) {
      const parsedRequirements = parseRequirements(requirements);

      if (parsedRequirements.length === 0) {
        return res.status(400).json({
          message: "At least one job requirement is required.",
          success: false,
        });
      }

      job.requirements = parsedRequirements;
    }

    if (salary !== undefined) {
      if (!isNonEmptyString(salary)) {
        return res.status(400).json({
          message: "Salary cannot be empty.",
          success: false,
        });
      }

      job.salary = normalizeString(salary);
    }

    if (location !== undefined) {
      if (!isNonEmptyString(location)) {
        return res.status(400).json({
          message: "Location cannot be empty.",
          success: false,
        });
      }

      job.location = normalizeString(location);
    }

    if (jobType !== undefined) {
      if (!isNonEmptyString(jobType)) {
        return res.status(400).json({
          message: "Job type cannot be empty.",
          success: false,
        });
      }

      job.jobType = normalizeString(jobType);
    }

    if (position !== undefined) {
      const parsedPosition = Number(position);

      if (!Number.isInteger(parsedPosition) || parsedPosition < 1) {
        return res.status(400).json({
          message: "Positions must be a positive whole number.",
          success: false,
        });
      }

      job.position = parsedPosition;
    }

    if (company !== undefined) {
      if (!isNonEmptyString(company)) {
        return res.status(400).json({
          message: "Company cannot be empty.",
          success: false,
        });
      }

      job.company = normalizeString(company);
    }

    await job.save();

    return res.status(200).json({
      message: "Job updated successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.error("Update job error:", error);

    return res.status(500).json({
      message: "Failed to update job.",
      success: false,
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;

    if (!isValidObjectId(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID.",
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

    if (job.created_by.toString() !== req.id) {
      return res.status(403).json({
        message: "You are not authorized to delete this job.",
        success: false,
      });
    }

    // Remove every application associated with the job before
    // removing the job itself. This prevents orphaned application
    // documents from remaining in the database.
    await Application.deleteMany({
      job: jobId,
    });

    await Job.findByIdAndDelete(jobId);

    return res.status(200).json({
      message: "Job and related applications deleted successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Delete job error:", error);

    return res.status(500).json({
      message: "Failed to delete job.",
      success: false,
    });
  }
};
