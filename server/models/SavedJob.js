const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const SavedJob = sequelize.define(
  "SavedJob",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    candidate_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    job_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "saved_jobs",
    timestamps: true,
  }
);

module.exports = SavedJob;