const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Alumni = sequelize.define('Alumni', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  batch: {
    type: DataTypes.STRING,
    allowNull: false
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true
  },
  position: {
    type: DataTypes.STRING,
    allowNull: true
  },
  linkedin: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  achievements: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = Alumni;