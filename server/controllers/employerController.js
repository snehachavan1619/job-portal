const Company = require("../models/Company");


// Create company profile
const createCompany = async (req, res) => {
  try {
    const employerId = req.user.id;

    // Check existing company
    const existingCompany = await Company.findOne({
      where: {
        employer_id: employerId,
      },
    });

    if (existingCompany) {
      return res.status(409).json({
        success: false,
        message: "Company profile already exists",
      });
    }

    const {
      company_name,
      industry,
      description,
      location,
      website,
    } = req.body;

    if (!company_name) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    const company = await Company.create({
      employer_id: employerId,
      company_name,
      industry,
      description,
      location,
      website,
    });

    res.status(201).json({
      success: true,
      message: "Company profile created successfully",
      company,
    });

  } catch (error) {
    console.error("Create company error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const getMyCompany = async (req, res) => {
  try {
    const employerId = req.user.id;

    const company = await Company.findOne({
      where: {
        employer_id: employerId,
      },
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    res.status(200).json({
      success: true,
      company,
    });

  } catch (error) {
    console.error("Get company error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const updateCompany = async (req, res) => {
  try {
    const employerId = req.user.id;

    const company = await Company.findOne({
      where: {
        employer_id: employerId,
      },
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    const {
      company_name,
      industry,
      description,
      location,
      website,
    } = req.body;

    await company.update({
      company_name: company_name ?? company.company_name,
      industry: industry ?? company.industry,
      description: description ?? company.description,
      location: location ?? company.location,
      website: website ?? company.website,
    });

    res.status(200).json({
      success: true,
      message: "Company profile updated successfully",
      company,
    });

  } catch (error) {
    console.error("Update company error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
module.exports = {
  createCompany,
  getMyCompany,
  updateCompany,
};