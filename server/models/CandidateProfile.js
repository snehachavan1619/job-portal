const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const CandidateProfile = sequelize.define(
  "CandidateProfile",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    headline: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    location: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    gender: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },

    about: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "candidate_profiles",
    timestamps: true,
  }
);

module.exports = CandidateProfile;