const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  senderType: {
    type: DataTypes.ENUM('admin', 'student'),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('broadcast', 'announcement', 'general'),
    defaultValue: 'general'
  }
});

module.exports = Message;