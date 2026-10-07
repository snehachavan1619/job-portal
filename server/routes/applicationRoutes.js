const express = require("express");

const {
  applyForJob,
  getMyApplications,
  withdrawApplication,
  getApplicationHistory,
} = require("../controllers/applicationController"); 

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


// Apply for job
router.post(
  "/jobs/:jobId/apply",
  protect,
  applyForJob
);


// Get my applications
router.get(
  "/candidates/applications",
  protect,
  getMyApplications
);

router.delete(
  "/applications/:id/withdraw",
  protect,
  withdrawApplication
);
router.get(
  "/applications/:id/history",
  protect,
  getApplicationHistory
);


module.exports = router;