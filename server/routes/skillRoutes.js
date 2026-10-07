const express = require("express");

const {
  getAllSkills,
  getCandidateSkills,
  addCandidateSkill,
  deleteCandidateSkill,
} = require("../controllers/skillController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();


// Get all available skills
router.get(
  "/",
  protect,
  authorize("CANDIDATE"),
  getAllSkills
);


// Get candidate's selected skills
router.get(
  "/my-skills",
  protect,
  authorize("CANDIDATE"),
  getCandidateSkills
);


// Add skill
router.post(
  "/",
  protect,
  authorize("CANDIDATE"),
  addCandidateSkill
);


// Remove skill
router.delete(
  "/:id",
  protect,
  authorize("CANDIDATE"),
  deleteCandidateSkill
);


module.exports = router;