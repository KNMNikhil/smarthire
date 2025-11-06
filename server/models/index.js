const { sequelize } = require('../config/database');
const Student = require('./Student');
const Admin = require('./Admin');
const Company = require('./Company');
const Query = require('./Query');
const Registration = require('./Registration');
const Alumni = require('./Alumni');
const Message = require('./Message');
const History = require('./History');

// Define associations
Student.hasMany(Query, { foreignKey: 'studentId' });
Query.belongsTo(Student, { foreignKey: 'studentId' });

Student.hasMany(Registration, { foreignKey: 'studentId' });
Registration.belongsTo(Student, { foreignKey: 'studentId' });

Company.hasMany(Registration, { foreignKey: 'companyId' });
Registration.belongsTo(Company, { foreignKey: 'companyId' });

Company.hasMany(History, { foreignKey: 'companyId' });
History.belongsTo(Company, { foreignKey: 'companyId' });

module.exports = {
  sequelize,
  Student,
  Admin,
  Company,
  Query,
  Registration,
  Alumni,
  Message,
  History
};