const Education = require("../models/Education");
const CandidateProfile = require("../models/CandidateProfile");


// Get all education records
const getEducation = async (req, res) => {
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

    const education = await Education.findAll({
      where: {
        candidate_id: profile.id,
      },
      order: [["start_year", "DESC"]],
    });

    res.status(200).json({
      success: true,
      education,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Add education
const addEducation = async (req, res) => {
  try {
    const {
      degree,
      institution,
      field_of_study,
      start_year,
      end_year,
      grade,
    } = req.body;

    if (!degree || !institution) {
      return res.status(400).json({
        success: false,
        message: "Degree and institution are required",
      });
    }

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

    const education = await Education.create({
      candidate_id: profile.id,
      degree,
      institution,
      field_of_study,
      start_year,
      end_year,
      grade,
    });

    res.status(201).json({
      success: true,
      message: "Education added successfully",
      education,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Update education
const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;

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

    const education = await Education.findOne({
      where: {
        id,
        candidate_id: profile.id,
      },
    });

    if (!education) {
      return res.status(404).json({
        success: false,
        message: "Education record not found",
      });
    }

    await education.update(req.body);

    res.status(200).json({
      success: true,
      message: "Education updated successfully",
      education,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Delete education
const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;

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

    const education = await Education.findOne({
      where: {
        id,
        candidate_id: profile.id,
      },
    });

    if (!education) {
      return res.status(404).json({
        success: false,
        message: "Education record not found",
      });
    }

    await education.destroy();

    res.status(200).json({
      success: true,
      message: "Education deleted successfully",
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
  getEducation,
  addEducation,
  updateEducation,
  deleteEducation,
};