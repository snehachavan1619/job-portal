const { Op } = require("sequelize");

const CandidateProfile = require("../models/CandidateProfile");
const Education = require("../models/Education");
const Experience = require("../models/Experience");
const CandidateSkill = require("../models/CandidateSkill");
const Resume = require("../models/Resume");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");
const Notification = require("../models/Notification");

const getCandidateDashboard = async (req, res) => {
  try {
    const candidateId = req.user.id;

    // Candidate profile
    const profile = await CandidateProfile.findOne({
      where: {
        user_id: candidateId,
      },
    });

    // Education
    const educationCount = await Education.count({
      where: {
        candidate_id: candidateId,
      },
    });

    // Experience
    const experienceCount = await Experience.count({
      where: {
        candidate_id: candidateId,
      },
    });

    // Skills
    const skillCount = await CandidateSkill.count({
      where: {
        candidate_id: candidateId,
      },
    });

    // Resume
    const resumeCount = await Resume.count({
      where: {
        candidate_id: candidateId,
      },
    });

    // Applications
    const applications = await Application.findAll({
      where: {
        candidate_id: candidateId,
      },
      attributes: ["id", "status"],
    });

    const totalApplications = applications.length;

    const applied = applications.filter(
      (application) => application.status === "APPLIED"
    ).length;

    const shortlisted = applications.filter(
      (application) => application.status === "SHORTLISTED"
    ).length;

    const interviews = applications.filter(
      (application) => application.status === "INTERVIEW"
    ).length;

    const selected = applications.filter(
      (application) => application.status === "SELECTED"
    ).length;

    const rejected = applications.filter(
      (application) => application.status === "REJECTED"
    ).length;

    // Saved Jobs
    const savedJobs = await SavedJob.count({
      where: {
        candidate_id: candidateId,
      },
    });

    // Unread Notifications
    const unreadNotifications = await Notification.count({
      where: {
        user_id: candidateId,
        is_read: false,
      },
    });

    // Profile completion
    let profileCompletion = 0;

    if (profile) {
      profileCompletion += 30;
    }

    if (educationCount > 0) {
      profileCompletion += 15;
    }

    if (experienceCount > 0) {
      profileCompletion += 15;
    }

    if (skillCount > 0) {
      profileCompletion += 20;
    }

    if (resumeCount > 0) {
      profileCompletion += 20;
    }

    return res.status(200).json({
      success: true,

      dashboard: {
        profileCompletion,

        applications: {
          total: totalApplications,
          applied,
          shortlisted,
          interviews,
          selected,
          rejected,
        },

        savedJobs,

        notifications: {
          unread: unreadNotifications,
        },
      },
    });
  } catch (error) {
    console.error("Candidate Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load candidate dashboard",
      error: error.message,
    });
  }
};

module.exports = {
  getCandidateDashboard,
};