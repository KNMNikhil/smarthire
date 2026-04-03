const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  senderName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  senderRole: {
    type: DataTypes.ENUM('admin', 'student'),
    allowNull: false
  },
  recipientId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('sent', 'delivered', 'read'),
    defaultValue: 'sent'
  },
  isBroadcast: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

module.exports = Chat;
