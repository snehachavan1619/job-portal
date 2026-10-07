const express = require("express");

const {
  register,
  login,
} = require("../controllers/authController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

// Protected test route
router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    message: "You are authenticated",
    user: req.user,
  });
});

// Candidate-only test route
router.get(
  "/candidate-test",
  protect,
  authorize("CANDIDATE"),
  (req, res) => {
    res.json({
      success: true,
      message: "Candidate access granted",
      user: req.user,
    });
  }
);

module.exports = router;