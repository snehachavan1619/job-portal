const { Op } = require("sequelize");

const Job = require("../models/Job");
const Skill = require("../models/Skill");
const CandidateSkill = require("../models/CandidateSkill");
const JobSkill = require("../models/JobSkill");
const Company = require("../models/Company");


// Get recommended jobs
const getRecommendedJobs = async (req, res) => {
  try {
    const candidateId = req.user.id;

    // Get candidate skills
    const candidateSkills = await CandidateSkill.findAll({
      where: {
        candidate_id: candidateId,
      },
      attributes: ["skill_id"],
    });

    const skillIds = candidateSkills.map(
      (skill) => skill.skill_id
    );

    // Candidate has no skills
    if (skillIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Add skills to your profile to get recommendations",
        recommendations: [],
      });
    }

    // Find jobs having candidate skills
    const jobSkills = await JobSkill.findAll({
      where: {
        skill_id: {
          [Op.in]: skillIds,
        },
      },
      attributes: ["job_id", "skill_id"],
    });

    // Count matching skills per job
    const matchCount = {};

    jobSkills.forEach((item) => {
      if (!matchCount[item.job_id]) {
        matchCount[item.job_id] = 0;
      }

      matchCount[item.job_id]++;
    });

    const jobIds = Object.keys(matchCount);

    if (jobIds.length === 0) {
      return res.status(200).json({
        success: true,
        recommendations: [],
      });
    }

    // Get active jobs
    const jobs = await Job.findAll({
      where: {
        id: {
          [Op.in]: jobIds,
        },
        status: "ACTIVE",
      },

      include: [
        {
          model: Company,
          attributes: [
            "id",
            "company_name",
            "industry",
            "location",
            "logo",
          ],
        },
      ],
    });

    // Add match information
    const recommendations = jobs.map((job) => {
      const matchedSkills = matchCount[job.id];

      return {
        job,
        matchedSkills,
      };
    });

    // Sort by matching skills
    recommendations.sort(
      (a, b) => b.matchedSkills - a.matchedSkills
    );

    res.status(200).json({
      success: true,
      recommendations,
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
  getRecommendedJobs,
};