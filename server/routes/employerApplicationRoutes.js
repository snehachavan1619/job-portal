const express = require("express");

const router = express.Router();

const {
  getJobApplicants,
  updateApplicationStatus,
} = require("../controllers/employerApplicationController");

const {
  protect,
  employerOnly,
} = require("../middleware/authMiddleware");

// ==========================================
// GET ALL APPLICANTS FOR A JOB
// ==========================================
router.get(
  "/employer/jobs/:jobId/applicants",
  protect,
  employerOnly,
  getJobApplicants
);

// ==========================================
// UPDATE APPLICATION STATUS
// ==========================================
router.put(
  "/employer/applications/:applicationId/status",
  protect,
  employerOnly,
  updateApplicationStatus
);

module.exports = router;