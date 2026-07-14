import Job from "../models/Job.js";

// =============================
// Create Job
// =============================
export const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      skills,
      location,
      salary,
      experience,
      jobType,
    } = req.body;

    const job = await Job.create({
      recruiter: req.user._id,
      title,
      company,
      description,
      skills,
      location,
      salary,
      experience,
      jobType,
    });

    res.status(201).json({
      success: true,
      message: "Job Created Successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get All Jobs
// =============================
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate(
      "recruiter",
      "fullName email"
    );

    res.status(200).json({
      success: true,
      total: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get Single Job
// =============================
export const getSingleJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "recruiter",
      "fullName email"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Delete Job
// =============================
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};