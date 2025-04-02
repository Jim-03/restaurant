const { DataTypes } = require('sequelize');
const sequelize = require('../databaseConnection');

module.exports = sequelize.define(
  'PaymentMethod',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(150),
      allowNull: true
    }
  },
  {
    tableName: 'payment_methods',
    timestamps: true
  }
);
