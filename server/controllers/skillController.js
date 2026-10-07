const Skill = require("../models/Skill");
const CandidateSkill = require("../models/CandidateSkill");
const CandidateProfile = require("../models/CandidateProfile");


// GET all available skills
const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.findAll({
      order: [["name", "ASC"]],
    });

    res.status(200).json({
      success: true,
      skills,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET candidate skills
const getCandidateSkills = async (req, res) => {
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

    const candidateSkills = await CandidateSkill.findAll({
      where: {
        candidate_id: profile.id,
      },
    });

    const skillIds = candidateSkills.map(
      (item) => item.skill_id
    );

    if (skillIds.length === 0) {
      return res.status(200).json({
        success: true,
        skills: [],
      });
    }

    const skills = await Skill.findAll({
      where: {
        id: skillIds,
      },
      order: [["name", "ASC"]],
    });

    res.status(200).json({
      success: true,
      skills,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ADD skill to candidate
const addCandidateSkill = async (req, res) => {
  try {
    const { skill_id } = req.body;

    if (!skill_id) {
      return res.status(400).json({
        success: false,
        message: "Skill ID is required",
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

    // Check whether skill exists
    const skill = await Skill.findByPk(skill_id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    // Check duplicate
    const existingSkill = await CandidateSkill.findOne({
      where: {
        candidate_id: profile.id,
        skill_id,
      },
    });

    if (existingSkill) {
      return res.status(409).json({
        success: false,
        message: "Skill already added",
      });
    }

    // Add skill
    const candidateSkill = await CandidateSkill.create({
      candidate_id: profile.id,
      skill_id,
    });

    res.status(201).json({
      success: true,
      message: "Skill added successfully",
      candidateSkill,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// DELETE candidate skill
const deleteCandidateSkill = async (req, res) => {
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

    const candidateSkill = await CandidateSkill.findOne({
      where: {
        id,
        candidate_id: profile.id,
      },
    });

    if (!candidateSkill) {
      return res.status(404).json({
        success: false,
        message: "Candidate skill not found",
      });
    }

    await candidateSkill.destroy();

    res.status(200).json({
      success: true,
      message: "Skill removed successfully",
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
  getAllSkills,
  getCandidateSkills,
  addCandidateSkill,
  deleteCandidateSkill,
};