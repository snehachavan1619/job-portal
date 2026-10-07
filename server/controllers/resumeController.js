const fs = require("fs");
const path = require("path");

const Resume = require("../models/Resume");
const CandidateProfile = require("../models/CandidateProfile");


// Upload resume
const uploadResumeFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume",
      });
    }

    const profile = await CandidateProfile.findOne({
      where: {
        user_id: req.user.id,
      },
    });

    if (!profile) {
      // Delete uploaded file if profile doesn't exist
      fs.unlinkSync(req.file.path);

      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    // Check existing resume
    const existingResume = await Resume.findOne({
      where: {
        candidate_id: profile.id,
      },
    });

    // Delete old file
    if (existingResume) {
      const oldFilePath = path.join(
        __dirname,
        "..",
        existingResume.file_path
      );

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      await existingResume.destroy();
    }

    const resume = await Resume.create({
      candidate_id: profile.id,
      original_name: req.file.originalname,
      file_name: req.file.filename,
      file_path: `uploads/resumes/${req.file.filename}`,
      mime_type: req.file.mimetype,
      file_size: req.file.size,
    });

    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      resume: {
        id: resume.id,
        original_name: resume.original_name,
        file_name: resume.file_name,
        file_size: resume.file_size,
      },
    });
  } catch (error) {
    console.error(error);

    // Delete uploaded file if something fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Get candidate resume
const getResume = async (req, res) => {
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

    const resume = await Resume.findOne({
      where: {
        candidate_id: profile.id,
      },
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Delete resume
const deleteResume = async (req, res) => {
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

    const resume = await Resume.findOne({
      where: {
        candidate_id: profile.id,
      },
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const filePath = path.join(
      __dirname,
      "..",
      resume.file_path
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await resume.destroy();

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
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
  uploadResumeFile,
  getResume,
  deleteResume,
};