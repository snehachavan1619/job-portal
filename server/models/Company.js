const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Company = sequelize.define(
  "Company",
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

    company_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    industry: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    location: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    logo: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "companies",
    timestamps: true,
  }
);

module.exports = Company;