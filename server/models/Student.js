const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rollNo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  tenthPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  twelfthPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  cgpa: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true
  },
  lastSemGpa: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true
  },
  arrears: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  placedStatus: {
    type: DataTypes.ENUM('Not Placed', 'General', 'Dream', 'Super Dream'),
    defaultValue: 'Not Placed'
  },
  higherStudies: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  internship: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  batch: {
    type: DataTypes.STRING,
    defaultValue: '2025-2026'
  },
  resetToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetTokenExpiry: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

module.exports = Student;