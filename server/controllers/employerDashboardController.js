const { Op } = require("sequelize");

const Job = require("../models/Job");
const Application = require("../models/Application");

const getEmployerDashboard = async (req, res) => {
  try {
    const employerId = req.user.id;

    // Get all jobs posted by this employer
    const jobs = await Job.findAll({
      where: {
        employer_id: employerId,
      },
      attributes: ["id", "status"],
    });

    const jobIds = jobs.map((job) => job.id);

    // If employer has no jobs
    if (jobIds.length === 0) {
      return res.status(200).json({
        success: true,
        dashboard: {
          totalJobs: 0,
          activeJobs: 0,
          closedJobs: 0,
          totalApplicants: 0,
          shortlistedCandidates: 0,
          interviewCandidates: 0,
          selectedCandidates: 0,
          rejectedCandidates: 0,
        },
      });
    }

    // Count jobs
    const totalJobs = jobs.length;

    const activeJobs = jobs.filter(
      (job) => job.status === "ACTIVE"
    ).length;

    const closedJobs = jobs.filter(
      (job) => job.status === "CLOSED"
    ).length;

    // Get applications for employer's jobs
    const applications = await Application.findAll({
      where: {
        job_id: {
          [Op.in]: jobIds,
        },
      },
      attributes: ["id", "status"],
    });

    const totalApplicants = applications.length;

    const shortlistedCandidates = applications.filter(
      (application) => application.status === "SHORTLISTED"
    ).length;

    const interviewCandidates = applications.filter(
      (application) => application.status === "INTERVIEW"
    ).length;

    const selectedCandidates = applications.filter(
      (application) => application.status === "SELECTED"
    ).length;

    const rejectedCandidates = applications.filter(
      (application) => application.status === "REJECTED"
    ).length;

    return res.status(200).json({
      success: true,

      dashboard: {
        totalJobs,
        activeJobs,
        closedJobs,
        totalApplicants,
        shortlistedCandidates,
        interviewCandidates,
        selectedCandidates,
        rejectedCandidates,
      },
    });
  } catch (error) {
    console.error("Employer Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load employer dashboard",
      error: error.message,
    });
  }
};

module.exports = {
  getEmployerDashboard,
};