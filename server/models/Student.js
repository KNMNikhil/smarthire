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
    type: DataTypes.ENUM('Not Placed', 'Placed - General', 'Placed - Dream', 'Placed - Super Dream', 'Higher Studies'),
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
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  currentSemester: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  sem1Gpa: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true
  },
  sem2Gpa: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true
  },
  sem3Gpa: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true
  },
  sem4Gpa: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true
  },
  sem5Gpa: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true
  },
  sem6Gpa: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true
  },
  sem7Gpa: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true
  },
  resetToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetTokenExpiry: {
    type: DataTypes.DATE,
    allowNull: true
  },
  resumeUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  skills: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  resumeScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = Student;