const express = require("express");

const {
  getExperience,
  addExperience,
  updateExperience,
  deleteExperience,
} = require("../controllers/experienceController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();


// Get experience
router.get(
  "/",
  protect,
  authorize("CANDIDATE"),
  getExperience
);


// Add experience
router.post(
  "/",
  protect,
  authorize("CANDIDATE"),
  addExperience
);


// Update experience
router.put(
  "/:id",
  protect,
  authorize("CANDIDATE"),
  updateExperience
);


// Delete experience
router.delete(
  "/:id",
  protect,
  authorize("CANDIDATE"),
  deleteExperience
);


module.exports = router;