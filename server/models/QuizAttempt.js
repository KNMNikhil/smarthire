const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const QuizAttempt = sequelize.define('QuizAttempt', {
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
  quizId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Quizzes',
      key: 'id'
    }
  },
  answers: {
    type: DataTypes.JSON,
    allowNull: false
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  timeSpent: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Time spent in minutes'
  },
  passed: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  attemptNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
});

module.exports = QuizAttempt;