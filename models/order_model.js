const { DataTypes } = require('sequelize');
const sequelize = require('../databaseConnection');

module.exports = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    totalPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      field: 'total_price'
    },
    payment: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'payments',
        key: 'id'
      }
    },
    waiter: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'waiter_id'
    },
    tableNumber: {
      type: DataTypes.INTEGER,
      field: 'table_number',
      allowNull: true
    },
    orderStatus: {
      type: DataTypes.ENUM('cancelled', 'processing', 'completed', 'unpaid'),
      defaultValue: 'processing',
      allowNull: false,
      field: 'order_status'
    }
  },
  {
    tableName: 'orders',
    timestamps: true
  }
);
