const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Registration = sequelize.define('Registration', {
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
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Companies',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('Registered', 'Not Registered', 'Selected', 'Rejected'),
    defaultValue: 'Not Registered'
  },
  registeredAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

module.exports = Registration;