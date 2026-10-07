const CandidateProfile = require("../models/CandidateProfile");

// Get candidate profile
const getProfile = async (req, res) => {
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

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Create candidate profile
const createProfile = async (req, res) => {
  try {
    const {
      headline,
      phone,
      location,
      date_of_birth,
      gender,
      about,
    } = req.body;

    // Check if profile already exists
    const existingProfile = await CandidateProfile.findOne({
      where: {
        user_id: req.user.id,
      },
    });

    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: "Candidate profile already exists",
      });
    }

    const profile = await CandidateProfile.create({
      user_id: req.user.id,
      headline,
      phone,
      location,
      date_of_birth,
      gender,
      about,
    });

    res.status(201).json({
      success: true,
      message: "Candidate profile created successfully",
      profile,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Update candidate profile
const updateProfile = async (req, res) => {
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

    const {
      headline,
      phone,
      location,
      date_of_birth,
      gender,
      about,
    } = req.body;

    await profile.update({
      headline,
      phone,
      location,
      date_of_birth,
      gender,
      about,
    });

    res.status(200).json({
      success: true,
      message: "Candidate profile updated successfully",
      profile,
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
  getProfile,
  createProfile,
  updateProfile,
};