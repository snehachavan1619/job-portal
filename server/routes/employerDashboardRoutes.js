const express = require("express");

const router = express.Router();

const {
  getEmployerDashboard,
} = require("../controllers/employerDashboardController");

const {
  protect,
  employerOnly,
} = require("../middleware/authMiddleware");

router.get(
  "/employer/dashboard",
  protect,
  employerOnly,
  getEmployerDashboard
);

module.exports = router;