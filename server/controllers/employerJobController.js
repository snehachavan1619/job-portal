const Job = require("../models/Job");
const Company = require("../models/Company");
const JobSkill = require("../models/JobSkill");
const Skill = require("../models/Skill");

// ==========================================
// CREATE JOB
// ==========================================
const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      salary_min,
      salary_max,
      job_type,
      work_mode,
      experience_required,
      application_deadline,
      skill_ids,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    // Find company of logged-in employer
    const company = await Company.findOne({
      where: {
        employer_id: req.user.id,
      },
    });

    if (!company) {
      return res.status(400).json({
        success: false,
        message: "Please create your company profile first",
      });
    }

    // Create job
    const job = await Job.create({
      employer_id: req.user.id,
      company_id: company.id,
      title,
      description,
      location,
      salary_min,
      salary_max,
      job_type,
      work_mode,
      experience_required,
      application_deadline,
      status: "ACTIVE",
    });

    // Add required skills
    if (Array.isArray(skill_ids) && skill_ids.length > 0) {
      const skills = await Skill.findAll({
        where: {
          id: skill_ids,
        },
      });

      const jobSkills = skills.map((skill) => ({
        job_id: job.id,
        skill_id: skill.id,
      }));

      if (jobSkills.length > 0) {
        await JobSkill.bulkCreate(jobSkills);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job,
    });
  } catch (error) {
    console.error("Create Job Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create job",
      error: error.message,
    });
  }
};

// ==========================================
// GET MY JOBS
// ==========================================
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: {
        employer_id: req.user.id,
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get My Jobs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};

// ==========================================
// GET ONE JOB
// ==========================================
const getMyJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findOne({
      where: {
        id,
        employer_id: req.user.id,
      },
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("Get My Job Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch job",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE JOB
// ==========================================
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findOne({
      where: {
        id,
        employer_id: req.user.id,
      },
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const {
      title,
      description,
      location,
      salary_min,
      salary_max,
      job_type,
      work_mode,
      experience_required,
      application_deadline,
      status,
      skill_ids,
    } = req.body;

    await job.update({
      title,
      description,
      location,
      salary_min,
      salary_max,
      job_type,
      work_mode,
      experience_required,
      application_deadline,
      status,
    });

    // Update skills
    if (Array.isArray(skill_ids)) {
      await JobSkill.destroy({
        where: {
          job_id: job.id,
        },
      });

      if (skill_ids.length > 0) {
        const skills = await Skill.findAll({
          where: {
            id: skill_ids,
          },
        });

        const jobSkills = skills.map((skill) => ({
          job_id: job.id,
          skill_id: skill.id,
        }));

        if (jobSkills.length > 0) {
          await JobSkill.bulkCreate(jobSkills);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    console.error("Update Job Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update job",
      error: error.message,
    });
  }
};

// ==========================================
// CLOSE JOB
// ==========================================
const closeJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findOne({
      where: {
        id,
        employer_id: req.user.id,
      },
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await job.update({
      status: "CLOSED",
    });

    return res.status(200).json({
      success: true,
      message: "Job closed successfully",
      job,
    });
  } catch (error) {
    console.error("Close Job Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to close job",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORT
// ==========================================
module.exports = {
  createJob,
  getMyJobs,
  getMyJob,
  updateJob,
  closeJob,
};