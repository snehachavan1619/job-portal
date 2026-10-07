const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Education = sequelize.define(
  "Education",
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

    degree: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    institution: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    field_of_study: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    start_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    end_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    grade: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: "education",
    timestamps: true,
  }
);

module.exports = Education;