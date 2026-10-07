const express = require("express");

const router = express.Router();

const {
  createJob,
  getMyJobs,
  getMyJob,
  updateJob,
  closeJob,
} = require("../controllers/employerJobController");

const {
  protect,
  employerOnly,
} = require("../middleware/authMiddleware");
// Create Job
router.post(
  "/employer/jobs",
  protect,
  employerOnly,
  createJob
);

// Get all my jobs
router.get(
  "/employer/jobs",
  protect,
  employerOnly,
  getMyJobs
);

// Get one job
router.get(
  "/employer/jobs/:id",
  protect,
  employerOnly,
  getMyJob
);

// Update job
router.put(
  "/employer/jobs/:id",
  protect,
  employerOnly,
  updateJob
);

// Close job
router.put(
  "/employer/jobs/:id/close",
  protect,
  employerOnly,
  closeJob
);

module.exports = router;