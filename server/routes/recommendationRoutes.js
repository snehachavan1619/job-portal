const express = require("express");

const {
  getRecommendedJobs,
} = require("../controllers/recommendationController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


// Recommended jobs
router.get(
  "/candidates/recommended-jobs",
  protect,
  getRecommendedJobs
);


module.exports = router;