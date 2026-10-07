const express = require("express");

const {
  createCompany,
  getMyCompany,
  updateCompany,
} = require("../controllers/employerController");

const {
  protect,
  employerOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();


// Create company
router.post(
  "/employer/company",
  protect,
  employerOnly,
  createCompany
);


// Get company
router.get(
  "/employer/company",
  protect,
  employerOnly,
  getMyCompany
);


// Update company
router.put(
  "/employer/company",
  protect,
  employerOnly,
  updateCompany
);


module.exports = router;