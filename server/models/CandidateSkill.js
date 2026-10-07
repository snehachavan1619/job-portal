const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const CandidateSkill = sequelize.define(
  "CandidateSkill",
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

    skill_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "candidate_skills",
    timestamps: true,
  }
);

module.exports = CandidateSkill;