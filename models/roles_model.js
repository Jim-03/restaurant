const sequelize = require('../database/databaseConnection');
const { DataTypes } = require('sequelize');

module.exports = sequelize.define(
  'Role',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING(150),
      allowNull: true
    }
  },
  {
    tableName: 'roles',
    timestamps: true
  }
);
