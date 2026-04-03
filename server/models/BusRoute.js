const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BusRoute = sequelize.define('BusRoute', {
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
  company: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  boardingPoint: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'College Main Gate'
  },
  busNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 50
  },
  registered: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  estimatedTravel: {
    type: DataTypes.STRING,
    allowNull: false
  },
  returnTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  timeAmPm: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'AM'
  },
  returnTimeAmPm: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'PM'
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contactPerson: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'departed', 'returned', 'cancelled'),
    defaultValue: 'scheduled'
  }
});

module.exports = BusRoute;