const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CalendarEvent = sequelize.define('CalendarEvent', {
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
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'blue'
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  }
});

module.exports = CalendarEvent;