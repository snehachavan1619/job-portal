const { createNotification } = require("../services/notificationService");
const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const ApplicationStatusHistory = require(
  "../models/ApplicationStatusHistory"
);


// Apply for a job
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { cover_note } = req.body || {};
    const candidateId = req.user.id;

    // Check whether job exists
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

    // Check duplicate application
    const existingApplication = await Application.findOne({
      where: {
        job_id: jobId,
        candidate_id: candidateId,
      },
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // Create application
    const application = await Application.create({
      job_id: jobId,
      candidate_id: candidateId,
      cover_note: cover_note || null,
      resume: null,
      status: "APPLIED",
    });
   await createNotification({
  userId: candidateId,
  title: "Application Submitted",
  message: "Your application has been submitted successfully.",
  type: "APPLICATION",
}); 
    await ApplicationStatusHistory.create({
  application_id: application.id,
  old_status: null,
  new_status: "APPLIED",
  changed_by: candidateId,
});

    res.status(201).json({
      success: true,
      message: "Job application submitted successfully",
      application: {
        id: application.id,
        job_id: application.job_id,
        candidate_id: application.candidate_id,
        status: application.status,
        applied_at: application.createdAt,
      },
    });

  } catch (error) {
    console.error("❌ APPLY JOB ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get candidate's applications
const getMyApplications = async (req, res) => {
  try {
    const candidateId = req.user.id;

    const applications = await Application.findAll({
      where: {
        candidate_id: candidateId,
      },

      include: [
        {
          model: Job,
          attributes: [
            "id",
            "title",
            "location",
            "job_type",
            "work_mode",
            "status",
          ],
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      applications,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// Withdraw application
const withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const candidateId = req.user.id;

    const application = await Application.findOne({
      where: {
        id,
        candidate_id: candidateId,
      },
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Already withdrawn
    if (application.status === "WITHDRAWN") {
      return res.status(400).json({
        success: false,
        message: "Application is already withdrawn",
      });
    }

    // Cannot withdraw after final decision
    if (
      application.status === "SELECTED" ||
      application.status === "REJECTED"
    ) {
      return res.status(400).json({
        success: false,
        message: "Application cannot be withdrawn now",
      });
    }

    const oldStatus = application.status;

    application.status = "WITHDRAWN";

    await application.save();

    // Save status history
    await ApplicationStatusHistory.create({
      application_id: application.id,
      old_status: oldStatus,
      new_status: "WITHDRAWN",
      changed_by: candidateId,
    });

    res.status(200).json({
      success: true,
      message: "Application withdrawn successfully",
      application: {
        id: application.id,
        status: application.status,
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
// Get application status history
const getApplicationHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const candidateId = req.user.id;

    const application = await Application.findOne({
      where: {
        id,
        candidate_id: candidateId,
      },
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const history = await ApplicationStatusHistory.findAll({
      where: {
        application_id: id,
      },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({
      success: true,
      application_id: application.id,
      current_status: application.status,
      history,
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
  applyForJob,
  getMyApplications,
  withdrawApplication,
  getApplicationHistory,
};