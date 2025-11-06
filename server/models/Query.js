const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Query = sequelize.define('Query', {
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
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  reply: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Replied', 'Closed'),
    defaultValue: 'Pending'
  },
  repliedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

module.exports = Query;