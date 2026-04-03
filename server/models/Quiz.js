const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Quiz = sequelize.define('Quiz', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM('interview', 'coding', 'aptitude', 'communication'),
    allowNull: false
  },
  difficulty: {
    type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
    allowNull: false
  },
  questions: {
    type: DataTypes.JSON,
    allowNull: false
  },
  timeLimit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Time limit in minutes'
  },
  passingScore: {
    type: DataTypes.INTEGER,
    defaultValue: 60,
    comment: 'Minimum score to pass'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Quiz;