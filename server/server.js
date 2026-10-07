const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB, sequelize } = require("./config/db");

// ===============================
// MODELS
// ===============================

const User = require("./models/User");
const CandidateProfile = require("./models/CandidateProfile");
const Education = require("./models/Education");
const Experience = require("./models/Experience");
const Skill = require("./models/Skill");
const CandidateSkill = require("./models/CandidateSkill");
const Resume = require("./models/Resume");
const Company = require("./models/Company");
const Job = require("./models/Job");
const JobSkill = require("./models/JobSkill");
const Application = require("./models/Application");
const ApplicationStatusHistory = require("./models/ApplicationStatusHistory");
const SavedJob = require("./models/SavedJob");
const Notification = require("./models/Notification");

// ===============================
// ROUTES
// ===============================
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const educationRoutes = require("./routes/educationRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const skillRoutes = require("./routes/skillRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const savedJobRoutes = require("./routes/savedJobRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const employerRoutes = require("./routes/employerRoutes");
const employerJobRoutes = require("./routes/employerJobRoutes");
const employerApplicationRoutes = require("./routes/employerApplicationRoutes");
const employerDashboardRoutes = require("./routes/employerDashboardRoutes");
const candidateDashboardRoutes = require("./routes/candidateDashboardRoutes");


// ===============================
// DATABASE ASSOCIATIONS
// ===============================

// ---------- User ↔ Company ----------

User.hasOne(Company, {
  foreignKey: "employer_id",
});

Company.belongsTo(User, {
  foreignKey: "employer_id",
});

// ---------- User ↔ Job ----------

User.hasMany(Job, {
  foreignKey: "employer_id",
});

Job.belongsTo(User, {
  foreignKey: "employer_id",
});

// ---------- Company ↔ Job ----------

Company.hasMany(Job, {
  foreignKey: "company_id",
});

Job.belongsTo(Company, {
  foreignKey: "company_id",
});

// ---------- User ↔ Application ----------

User.hasMany(Application, {
  foreignKey: "candidate_id",
});

Application.belongsTo(User, {
  foreignKey: "candidate_id",
});

// ---------- CandidateProfile ↔ Application ----------

Application.belongsTo(CandidateProfile, {
  foreignKey: "candidate_id",
  targetKey: "user_id",
});

CandidateProfile.hasMany(Application, {
  foreignKey: "candidate_id",
  sourceKey: "user_id",
});
Application.belongsTo(User, {
  foreignKey: "candidate_id",
});

User.hasMany(Application, {
  foreignKey: "candidate_id",
});

User.hasOne(CandidateProfile, {
  foreignKey: "user_id",
});

CandidateProfile.belongsTo(User, {
  foreignKey: "user_id",
});
// ---------- Job ↔ Application ----------

Job.hasMany(Application, {
  foreignKey: "job_id",
});

Application.belongsTo(Job, {
  foreignKey: "job_id",
});

// ---------- Application ↔ Status History ----------

Application.hasMany(ApplicationStatusHistory, {
  foreignKey: "application_id",
});

ApplicationStatusHistory.belongsTo(Application, {
  foreignKey: "application_id",
});

// ---------- SavedJob ↔ Job ----------

Job.hasMany(SavedJob, {
  foreignKey: "job_id",
});

SavedJob.belongsTo(Job, {
  foreignKey: "job_id",
});

// ---------- SavedJob ↔ User ----------

User.hasMany(SavedJob, {
  foreignKey: "candidate_id",
});

SavedJob.belongsTo(User, {
  foreignKey: "candidate_id",
});

// ---------- Job ↔ Skill ----------

Job.belongsToMany(Skill, {
  through: JobSkill,
  foreignKey: "job_id",
});

Skill.belongsToMany(Job, {
  through: JobSkill,
  foreignKey: "skill_id",
});

// ---------- User ↔ Notification ----------

User.hasMany(Notification, {
  foreignKey: "user_id",
});

Notification.belongsTo(User, {
  foreignKey: "user_id",
});

// ===============================
// EXPRESS APP
// ===============================

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// ===============================
// API ROUTES
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/candidate", candidateRoutes);

app.use("/api/candidates/education", educationRoutes);

app.use("/api/candidates/experience", experienceRoutes);

app.use("/api/candidates/skills", skillRoutes);

app.use("/api/candidates/resume", resumeRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api", applicationRoutes);

app.use("/api", savedJobRoutes);

app.use("/api", recommendationRoutes);

app.use("/api", notificationRoutes);

app.use("/api", employerRoutes);

app.use("/api", employerJobRoutes);

app.use("/api", employerApplicationRoutes);

app.use("/api", employerDashboardRoutes);

app.use("/api", candidateDashboardRoutes);

app.use("/api", adminRoutes);
// ===============================
// HOME ROUTE
// ===============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Job Portal API is running",
  });
});

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    await sequelize.sync();

    console.log("✅ Database tables synchronized");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup error:", error);
  }
};

startServer();