const Experience = require("../models/Experience");
const CandidateProfile = require("../models/CandidateProfile");


// GET all experience
const getExperience = async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({
      where: {
        user_id: req.user.id,
      },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    const experience = await Experience.findAll({
      where: {
        candidate_id: profile.id,
      },
      order: [["start_date", "DESC"]],
    });

    res.status(200).json({
      success: true,
      experience,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ADD experience
const addExperience = async (req, res) => {
  try {
    const {
      job_title,
      company_name,
      location,
      start_date,
      end_date,
      currently_working,
      description,
    } = req.body;

    // Required fields
    if (!job_title || !company_name || !start_date) {
      return res.status(400).json({
        success: false,
        message: "Job title, company name and start date are required",
      });
    }

    // Find candidate profile
    const profile = await CandidateProfile.findOne({
      where: {
        user_id: req.user.id,
      },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    // Create experience
    const experience = await Experience.create({
      candidate_id: profile.id,
      job_title,
      company_name,
      location,
      start_date,
      end_date,
      currently_working: currently_working || false,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Experience added successfully",
      experience,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// UPDATE experience
const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;

    // Find candidate profile
    const profile = await CandidateProfile.findOne({
      where: {
        user_id: req.user.id,
      },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    // Find experience belonging to this candidate
    const experience = await Experience.findOne({
      where: {
        id,
        candidate_id: profile.id,
      },
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience record not found",
      });
    }

    await experience.update(req.body);

    res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      experience,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// DELETE experience
const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;

    // Find candidate profile
    const profile = await CandidateProfile.findOne({
      where: {
        user_id: req.user.id,
      },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    // Find experience
    const experience = await Experience.findOne({
      where: {
        id,
        candidate_id: profile.id,
      },
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience record not found",
      });
    }

    await experience.destroy();

    res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = {
  getExperience,
  addExperience,
  updateExperience,
  deleteExperience,
};