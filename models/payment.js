const { DataTypes } = require("sequelize");
const sequelize = require("../database/databaseConnection");

module.exports = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    paymentMethod: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "payment_method_id",
    },
    amountPaid: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      field: "amount_paid",
    },
    amountToReturn: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      field: "amount_to_return",
    },
    dateOfPayment: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "date_paid",
    },
    timePaid: {
      type: DataTypes.TIME,
      allowNull: false,
      field: "time_paid",
    },
  },
  {
    tableName: "payments",
  }
);
