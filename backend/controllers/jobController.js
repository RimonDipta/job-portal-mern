import Job from "../models/Job.js";

const recruiterFields = "name role";

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

    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !position ||
      !company
    ) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    const parsedRequirements = Array.isArray(requirements)
      ? requirements
      : requirements
          .split(",")
          .map((requirement) => requirement.trim())
          .filter(Boolean);

    if (parsedRequirements.length === 0) {
      return res.status(400).json({
        message: "At least one job requirement is required.",
        success: false,
      });
    }

    const parsedPosition = Number(position);

    if (!Number.isInteger(parsedPosition) || parsedPosition < 1) {
      return res.status(400).json({
        message: "Positions must be a positive whole number.",
        success: false,
      });
    }

    const job = await Job.create({
      title: title.trim(),
      description: description.trim(),
      requirements: parsedRequirements,
      salary: salary.trim(),
      location: location.trim(),
      jobType: jobType.trim(),
      position: parsedPosition,
      company: company.trim(),
      created_by: userId,
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
    const keyword = req.query.keyword?.trim() || "";
    const category = req.query.category?.trim() || "";
    const location = req.query.location?.trim() || "";

    const query = {};

    const searchConditions = [];

    if (keyword) {
      searchConditions.push(
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { company: { $regex: keyword, $options: "i" } },
      );
    }

    if (category) {
      searchConditions.push(
        { title: { $regex: category, $options: "i" } },
        { description: { $regex: category, $options: "i" } },
      );
    }

    if (searchConditions.length > 0) {
      query.$or = searchConditions;
    }

    if (location) {
      query.location = {
        $regex: location,
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
    const jobId = req.params.id;

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
    const adminId = req.id;

    const jobs = await Job.find({
      created_by: adminId,
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
    const jobId = req.params.id;

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

    if (title !== undefined) {
      job.title = title.trim();
    }

    if (description !== undefined) {
      job.description = description.trim();
    }

    if (requirements !== undefined) {
      const parsedRequirements = Array.isArray(requirements)
        ? requirements
        : requirements
            .split(",")
            .map((requirement) => requirement.trim())
            .filter(Boolean);

      if (parsedRequirements.length === 0) {
        return res.status(400).json({
          message: "At least one job requirement is required.",
          success: false,
        });
      }

      job.requirements = parsedRequirements;
    }

    if (salary !== undefined) {
      job.salary = salary.trim();
    }

    if (location !== undefined) {
      job.location = location.trim();
    }

    if (jobType !== undefined) {
      job.jobType = jobType.trim();
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
      job.company = company.trim();
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
    const jobId = req.params.id;

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

    await Job.findByIdAndDelete(jobId);

    return res.status(200).json({
      message: "Job deleted successfully.",
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
