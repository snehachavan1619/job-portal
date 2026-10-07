const express = require("express");

const {
  uploadResumeFile,
  getResume,
  deleteResume,
} = require("../controllers/resumeController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const uploadResume = require("../middleware/uploadMiddleware");

const router = express.Router();


// Upload resume
router.post(
  "/",
  protect,
  authorize("CANDIDATE"),
  uploadResume.single("resume"),
  uploadResumeFile
);


// Get resume
router.get(
  "/",
  protect,
  authorize("CANDIDATE"),
  getResume
);


// Delete resume
router.delete(
  "/",
  protect,
  authorize("CANDIDATE"),
  deleteResume
);


module.exports = router;