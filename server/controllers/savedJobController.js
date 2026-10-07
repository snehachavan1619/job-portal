const SavedJob = require("../models/SavedJob");
const Job = require("../models/Job");
const Company = require("../models/Company");


// Save a job
const saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const candidateId = req.user.id;

    // Check job
    const job = await Job.findOne({
      where: {
        id: jobId,
        status: "ACTIVE",
      },
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or job is not active",
      });
    }

    // Check if already saved
    const existingSavedJob = await SavedJob.findOne({
      where: {
        candidate_id: candidateId,
        job_id: jobId,
      },
    });

    if (existingSavedJob) {
      return res.status(409).json({
        success: false,
        message: "Job is already saved",
      });
    }

    // Save job
    const savedJob = await SavedJob.create({
      candidate_id: candidateId,
      job_id: jobId,
    });

    res.status(201).json({
      success: true,
      message: "Job saved successfully",
      savedJob: {
        id: savedJob.id,
        job_id: savedJob.job_id,
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Remove saved job
const removeSavedJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const candidateId = req.user.id;

    const savedJob = await SavedJob.findOne({
      where: {
        candidate_id: candidateId,
        job_id: jobId,
      },
    });

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        message: "Saved job not found",
      });
    }

    await savedJob.destroy();

    res.status(200).json({
      success: true,
      message: "Job removed from saved jobs",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Get my saved jobs
const getSavedJobs = async (req, res) => {
  try {
    const candidateId = req.user.id;

    const savedJobs = await SavedJob.findAll({
      where: {
        candidate_id: candidateId,
      },

      include: [
        {
          model: Job,
          include: [
            {
              model: Company,
              attributes: [
                "id",
                "company_name",
                "industry",
                "location",
                "logo",
              ],
            },
          ],
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      savedJobs,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = {
  saveJob,
  removeSavedJob,
  getSavedJobs,
};