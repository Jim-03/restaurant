const sequelize = require('../databaseConnection');
const { DataTypes } = require('sequelize');

module.exports = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
      phone: {
        type: DataTypes.STRING(10),
          allowNull: false,
          unique: true
      },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'full_name'
    },
    role: {
      type: DataTypes.INTEGER,
      references: {
        model: 'roles',
        key: 'id'
      },
      allowNull: false,
      field: 'role_id'
    }
  },
  { tableName: 'users', timestamps: true }
);
