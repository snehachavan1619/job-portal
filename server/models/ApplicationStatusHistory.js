const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ApplicationStatusHistory = sequelize.define(
  "ApplicationStatusHistory",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    application_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    old_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    new_status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    changed_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "application_status_history",
    timestamps: true,
  }
);

module.exports = ApplicationStatusHistory;