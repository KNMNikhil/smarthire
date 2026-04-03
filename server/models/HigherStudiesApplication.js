const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const HigherStudiesApplication = sequelize.define('HigherStudiesApplication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Students',
      key: 'id'
    }
  },
  university: {
    type: DataTypes.STRING,
    allowNull: false
  },
  program: {
    type: DataTypes.STRING,
    allowNull: false
  },
  degree: {
    type: DataTypes.ENUM('MS', 'MEng', 'MBA', 'MPhil', 'PhD'),
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  applicationDeadline: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  personalStatement: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  additionalInfo: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'revision_required', 'rejected'),
    defaultValue: 'pending'
  },
  adminComments: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  lorStatus: {
    type: DataTypes.ENUM('pending', 'approved', 'revision_required'),
    defaultValue: 'pending'
  },
  sopStatus: {
    type: DataTypes.ENUM('pending', 'approved', 'revision_required'),
    defaultValue: 'pending'
  },
  lorFilePath: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sopFilePath: {
    type: DataTypes.STRING,
    allowNull: true
  },
  reviewedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  reviewedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Admins',
      key: 'id'
    }
  }
});

module.exports = HigherStudiesApplication;