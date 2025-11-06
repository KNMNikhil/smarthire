const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  jobRole: {
    type: DataTypes.STRING,
    allowNull: false
  },
  package: {
    type: DataTypes.STRING,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  visitDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  registrationDeadline: {
    type: DataTypes.DATE,
    allowNull: false
  },
  eligibilityCriteria: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      minCgpa: 0,
      minLastSemGpa: 0,
      maxArrears: 0,
      minTenthPercentage: 0,
      minTwelfthPercentage: 0,
      minAge: 0,
      maxAge: 100,
      allowHigherStudies: true,
      requireInternship: false
    }
  },
  status: {
    type: DataTypes.ENUM('Active', 'Completed', 'Cancelled'),
    defaultValue: 'Active'
  },
  type: {
    type: DataTypes.ENUM('General', 'Dream', 'Super Dream'),
    defaultValue: 'General'
  }
});

module.exports = Company;