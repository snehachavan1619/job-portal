const express = require("express");

const router = express.Router();

const {
  getCandidateDashboard,
} = require("../controllers/candidateDashboardController");

const {
  protect,
} = require("../middleware/authMiddleware");

router.get(
  "/candidate/dashboard",
  protect,
  getCandidateDashboard
);

module.exports = router;