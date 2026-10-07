const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Job = sequelize.define(
  "Job",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
     employer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    responsibilities: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    min_experience: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    max_experience: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    education_requirement: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },

    job_type: {
      type: DataTypes.ENUM(
        "FULL_TIME",
        "PART_TIME",
        "INTERNSHIP",
        "CONTRACT"
      ),
      allowNull: false,
      defaultValue: "FULL_TIME",
    },

    work_mode: {
      type: DataTypes.ENUM(
        "ONSITE",
        "REMOTE",
        "HYBRID"
      ),
      allowNull: false,
      defaultValue: "ONSITE",
    },

    location: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    min_salary: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },

    max_salary: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },

    openings: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },

    status: {
      type: DataTypes.ENUM(
        "DRAFT",
        "ACTIVE",
        "CLOSED",
        "EXPIRED"
      ),
      defaultValue: "ACTIVE",
    },

    deadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "jobs",
    timestamps: true,
  }
);

module.exports = Job;