const sequelize = require('../databaseConnection');
const { DataTypes } = require('sequelize');

module.exports = sequelize.define(
  'Category',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(150),
      allowNull: true
    }
  },
  {
    tableName: 'food_categories',
    timestamps: true
  }
);
