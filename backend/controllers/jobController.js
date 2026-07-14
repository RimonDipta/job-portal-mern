import Job from '../models/Job.js';

export const postJob = async (req, res) => {
  try {
    const { title, description, requirements, salary, location, jobType, position, company } = req.body;
    const userId = req.id;

    if (!title || !description || !requirements || !salary || !location || !jobType || !position || !company) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false
      });
    }

    const parsedRequirements = Array.isArray(requirements) 
      ? requirements 
      : requirements.split(',').map(req => req.trim()).filter(Boolean);

    const job = await Job.create({
      title,
      description,
      requirements: parsedRequirements,
      salary,
      location,
      jobType,
      position: Number(position),
      company,
      created_by: userId
    });

    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const category = req.query.category || "";
    
    const query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { company: { $regex: keyword, $options: "i" } }
      ];
    }

    if (category) {
      query.$or = query.$or || [];
      query.$or.push(
        { title: { $regex: category, $options: "i" } },
        { description: { $regex: category, $options: "i" } }
      );
    }

    // Clean up empty $or array
    if (query.$or && query.$or.length === 0) {
      delete query.$or;
    }

    const jobs = await Job.find(query).populate({
      path: "created_by"
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      jobs,
      success: true
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications"
    }).populate({
      path: "created_by"
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false
      });
    }

    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).sort({ createdAt: -1 });
    
    return res.status(200).json({
      jobs,
      success: true
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { title, description, requirements, salary, location, jobType, position, company } = req.body;
    
    let job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false
      });
    }

    if (job.created_by.toString() !== req.id) {
      return res.status(403).json({
        message: "You are not authorized to update this job.",
        success: false
      });
    }

    if (title) job.title = title;
    if (description) job.description = description;
    if (requirements) {
      job.requirements = Array.isArray(requirements) 
        ? requirements 
        : requirements.split(',').map(req => req.trim()).filter(Boolean);
    }
    if (salary) job.salary = salary;
    if (location) job.location = location;
    if (jobType) job.jobType = jobType;
    if (position) job.position = Number(position);
    if (company) job.company = company;

    await job.save();

    return res.status(200).json({
      message: "Job updated successfully.",
      job,
      success: true
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false
      });
    }

    if (job.created_by.toString() !== req.id) {
      return res.status(403).json({
        message: "You are not authorized to delete this job.",
        success: false
      });
    }

    await Job.findByIdAndDelete(jobId);
    
    return res.status(200).json({
      message: "Job deleted successfully.",
      success: true
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};
