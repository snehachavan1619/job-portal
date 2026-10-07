const express = require("express");

const {
  getJobs,
  getJobById,
} = require("../controllers/jobController");

const router = express.Router();


// Get all jobs
router.get("/", getJobs);


// Get single job
router.get("/:id", getJobById);


module.exports = router;