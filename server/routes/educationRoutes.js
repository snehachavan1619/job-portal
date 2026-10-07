const express = require("express");

const {
  getEducation,
  addEducation,
  updateEducation,
  deleteEducation,
} = require("../controllers/educationController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();


// Get education
router.get(
  "/",
  protect,
  authorize("CANDIDATE"),
  getEducation
);


// Add education
router.post(
  "/",
  protect,
  authorize("CANDIDATE"),
  addEducation
);


// Update education
router.put(
  "/:id",
  protect,
  authorize("CANDIDATE"),
  updateEducation
);


// Delete education
router.delete(
  "/:id",
  protect,
  authorize("CANDIDATE"),
  deleteEducation
);


module.exports = router;