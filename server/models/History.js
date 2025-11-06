const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const History = sequelize.define('History', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Companies',
      key: 'id'
    }
  },
  eligibleStudents: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  registeredStudents: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  selectedStudents: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
});

module.exports = History;