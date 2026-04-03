const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const StudentBadge = sequelize.define('StudentBadge', {
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
  badgeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Badges',
      key: 'id'
    }
  },
  earnedDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  progress: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Progress towards earning the badge'
  }
});

module.exports = StudentBadge;