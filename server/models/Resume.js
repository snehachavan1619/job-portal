const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Resume = sequelize.define(
  "Resume",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    candidate_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    original_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    file_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    file_path: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },

    mime_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    file_size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "resumes",
    timestamps: true,
  }
);

module.exports = Resume;