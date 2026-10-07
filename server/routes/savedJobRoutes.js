const express = require("express");

const {
  saveJob,
  removeSavedJob,
  getSavedJobs,
} = require("../controllers/savedJobController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


// Save job
router.post(
  "/jobs/:jobId/save",
  protect,
  saveJob
);


// Remove saved job
router.delete(
  "/jobs/:jobId/save",
  protect,
  removeSavedJob
);


// Get saved jobs
router.get(
  "/candidates/saved-jobs",
  protect,
  getSavedJobs
);


module.exports = router;