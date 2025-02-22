const { DataTypes } = require('sequelize');
const sequelize = require('../database/databaseConnection');

module.exports = sequelize.define(
  'FoodItem',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    category: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'food_categories',
        key: 'id'
      },
      field: 'category_id'
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    tableName: 'food_items',
    timestamps: true
  }
);
