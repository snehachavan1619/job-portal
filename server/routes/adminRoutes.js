const express = require("express");
const router = express.Router();

const {
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
} = require("../controllers/adminController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

// GET ALL USERS
router.get(
  "/admin/users",
  protect,
  adminOnly,
  getAllUsers
);

// GET USER BY ID
router.get(
  "/admin/users/:id",
  protect,
  adminOnly,
  getUserById
);

// ACTIVATE / DEACTIVATE USER
router.put(
  "/admin/users/:id/status",
  protect,
  adminOnly,
  updateUserStatus
);

// UPDATE USER ROLE
router.put(
  "/admin/users/:id/role",
  protect,
  adminOnly,
  updateUserRole
);

// DELETE USER
router.delete(
  "/admin/users/:id",
  protect,
  adminOnly,
  deleteUser
);
// GET ALL JOBS
router.get(
  "/admin/jobs",
  protect,
  adminOnly,
  getAllJobs
);
// GET JOB BY ID
router.get(
  "/admin/jobs/:id",
  protect,
  adminOnly,
  getJobById
);
// DELETE JOB
router.delete(
  "/admin/jobs/:id",
  protect,
  adminOnly,
  deleteJob
);
// GET ALL APPLICATIONS
router.get(
  "/admin/applications",
  protect,
  adminOnly,
  getAllApplications
);
// GET APPLICATION STATUS HISTORY
router.get(
  "/admin/applications/:id/history",
  protect,
  adminOnly,
  getApplicationStatusHistory
);
// UPDATE APPLICATION STATUS
router.put(
  "/admin/applications/:id/status",
  protect,
  adminOnly,
  updateApplicationStatus
);
// GET APPLICATION BY ID
router.get(
  "/admin/applications/:id",
  protect,
  adminOnly,
  getApplicationById
);
// GET ALL NOTIFICATIONS
router.get(
  "/admin/notifications",
  protect,
  adminOnly,
  getAllNotifications
);
// GET NOTIFICATION BY ID
router.get(
  "/admin/notifications/:id",
  protect,
  adminOnly,
  getNotificationById
);
// GET ADMIN DASHBOARD STATISTICS
router.get(
  "/admin/dashboard",
  protect,
  adminOnly,
  getDashboardStats
);
module.exports = router;