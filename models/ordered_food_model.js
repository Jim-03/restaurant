const { DataTypes } = require('sequelize');
const sequelize = require('../database/databaseConnection');

module.exports = sequelize.define(
  'OrderedFood',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id'
      },
      field: 'order_id'
    },
    foodItem: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'food_items',
        key: 'id'
      },
      field: 'food_id'
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false
    }
  },
  { tableName: 'ordered_food' }
);
