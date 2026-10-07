const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const ApplicationStatusHistory = require("../models/ApplicationStatusHistory");
const Company = require("../models/Company");
const Notification = require("../models/Notification");
// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// GET USER BY ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

// ACTIVATE / DEACTIVATE USER
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    // Validate input
    if (typeof is_active !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "is_active must be true or false",
      });
    }

    // Find user
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from deactivating themselves
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot change their own status",
      });
    }

    // Update status
    await user.update({
      is_active,
    });

    return res.status(200).json({
      success: true,
      message: is_active
        ? "User activated successfully"
        : "User deactivated successfully",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
      },
    });
  } catch (error) {
    console.error("Update User Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: error.message,
    });
  }
};
// UPDATE USER ROLE
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Allowed roles
    const allowedRoles = [
      "CANDIDATE",
      "EMPLOYER",
      "ADMIN",
    ];

    // Validate role
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // Find user
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from changing their own role
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot change their own role",
      });
    }

    // Update role
    await user.update({
      role,
    });

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
      },
    });
  } catch (error) {
    console.error("Update User Role Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update user role",
      error: error.message,
    });
  }
};
// DELETE USER
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from deleting themselves
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot delete their own account",
      });
    }

    // Delete user
    await user.destroy();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};
// GET ALL JOBS
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get All Jobs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};
// GET JOB BY ID
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["id", "full_name", "email", "role"],
        },
        {
          model: Company,
          attributes: [
            "id",
            "company_name",
            "industry",
            "description",
            "location",
            "website",
            "logo",
          ],
        },
      ],
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
    console.error("Get Job Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch job",
      error: error.message,
    });
  }
};
// DELETE JOB
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await job.destroy();

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete Job Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete job",
      error: error.message,
    });
  }
};
// GET ALL APPLICATIONS
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get All Applications Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
};
// GET APPLICATION BY ID
const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findByPk(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("Get Application Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch application",
      error: error.message,
    });
  }
};
// GET APPLICATION STATUS HISTORY
const getApplicationStatusHistory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check application exists
    const application = await Application.findByPk(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }
    
    // Get status history
    const history = await ApplicationStatusHistory.findAll({
      where: {
        application_id: id,
      },
      order: [["createdAt", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      application_id: id,
      count: history.length,
      history,
    });
  } catch (error) {
    console.error("Get Application Status History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch application status history",
      error: error.message,
    });
  }
};
// UPDATE APPLICATION STATUS
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "APPLIED",
      "SHORTLISTED",
      "INTERVIEW",
      "SELECTED",
      "REJECTED",
      "WITHDRAWN",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    const application = await Application.findByPk(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const oldStatus = application.status;

    await application.update({
      status,
    });

    await ApplicationStatusHistory.create({
      application_id: application.id,
      old_status: oldStatus,
      new_status: status,
      changed_by: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    console.error("Admin Update Application Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update application status",
      error: error.message,
    });
  }
};
// GET ALL NOTIFICATIONS
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "full_name", "email", "role"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Get All Notifications Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};
// GET NOTIFICATION BY ID
const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["id", "full_name", "email", "role"],
        },
      ],
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("Get Notification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notification",
      error: error.message,
    });
  }
};
// GET ADMIN DASHBOARD STATISTICS
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();

    const totalCandidates = await User.count({
      where: {
        role: "CANDIDATE",
      },
    });

    const totalEmployers = await User.count({
      where: {
        role: "EMPLOYER",
      },
    });

    const totalJobs = await Job.count();

    const totalApplications = await Application.count();

    const totalNotifications = await Notification.count();

    return res.status(200).json({
      success: true,
      statistics: {
        total_users: totalUsers,
        total_candidates: totalCandidates,
        total_employers: totalEmployers,
        total_jobs: totalJobs,
        total_applications: totalApplications,
        total_notifications: totalNotifications,
      },
    });
  } catch (error) {
    console.error("Get Dashboard Statistics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};
module.exports = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getAllJobs,
  getJobById,
  deleteJob,
  getAllApplications,
  getApplicationById,
  getApplicationStatusHistory,
  updateApplicationStatus,
  getAllNotifications,
  getNotificationById,
  getDashboardStats,
};