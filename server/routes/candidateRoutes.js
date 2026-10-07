const express = require("express");

const {
  getProfile,
  createProfile,
  updateProfile,
} = require("../controllers/candidateController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();


// Get candidate profile
router.get(
  "/profile",
  protect,
  authorize("CANDIDATE"),
  getProfile
);


// Create candidate profile
router.post(
  "/profile",
  protect,
  authorize("CANDIDATE"),
  createProfile
);


// Update candidate profile
router.put(
  "/profile",
  protect,
  authorize("CANDIDATE"),
  updateProfile
);


module.exports = router;