const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Application = sequelize.define(
  "Application",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    job_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    candidate_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    cover_note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    resume: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "APPLIED",
        "UNDER_REVIEW",
        "SHORTLISTED",
        "SELECTED",
        "REJECTED",
        "WITHDRAWN"
      ),
      allowNull: false,
      defaultValue: "APPLIED",
    },
  },
  {
    tableName: "applications",
    timestamps: true,
  }
);

module.exports = Application;