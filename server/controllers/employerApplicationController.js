const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const Notification = require("../models/Notification");
const ApplicationStatusHistory = require("../models/ApplicationStatusHistory");

// ==========================================
// GET ALL APPLICANTS FOR EMPLOYER JOB
// ==========================================
const getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check whether this job belongs to logged-in employer
    const job = await Job.findOne({
      where: {
        id: jobId,
        employer_id: req.user.id,
      },
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or access denied",
      });
    }

    const applications = await Application.findAll({
      where: {
        job_id: jobId,
      },

      include: [
        {
          model: User,

          // IMPORTANT:
          // User table has full_name, NOT name
          attributes: ["id", "full_name", "email"],
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      job_id: jobId,
      count: applications.length,
      applications,
    });

  } catch (error) {
    console.error("Get Applicants Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch applicants",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE APPLICATION STATUS
// ==========================================
const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "SHORTLISTED",
      "INTERVIEW",
      "SELECTED",
      "REJECTED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    const application = await Application.findOne({
      where: {
        id: applicationId,
      },

      include: [
        {
          model: Job,
          where: {
            employer_id: req.user.id,
          },
        },
      ],
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found or access denied",
      });
    }

    const oldStatus = application.status;

    // Update application
    await application.update({
      status,
    });

    // Save status history
    await ApplicationStatusHistory.create({
      application_id: application.id,
      old_status: oldStatus,
      new_status: status,
      changed_by: req.user.id,
    });

    // Notify candidate
    await Notification.create({
      user_id: application.candidate_id,
      title: "Application Status Updated",
      message: `Your application status has been changed to ${status}.`,
      type: "APPLICATION",
      is_read: false,
    });

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });

  } catch (error) {
    console.error("Update Application Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update application status",
      error: error.message,
    });
  }
};


module.exports = {
  getJobApplicants,
  updateApplicationStatus,
};