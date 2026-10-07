const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Experience = sequelize.define(
  "Experience",
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

    job_title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    company_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    location: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    currently_working: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "experience",
    timestamps: true,
  }
);

module.exports = Experience;