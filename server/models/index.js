const { sequelize } = require('../config/database');
const Student = require('./Student');
const Admin = require('./Admin');
const Company = require('./Company');
const Query = require('./Query');
const Registration = require('./Registration');
const Alumni = require('./Alumni');
const Message = require('./Message');
const History = require('./History');
const BusRoute = require('./BusRoute');
const InternshipCertificate = require('./InternshipCertificate');
const Quiz = require('./Quiz');
const QuizAttempt = require('./QuizAttempt');
const Badge = require('./Badge');
const StudentBadge = require('./StudentBadge');
const HigherStudiesApplication = require('./HigherStudiesApplication');
const CalendarEvent = require('./CalendarEvent');
const Chat = require('./Chat');

// Define associations
Student.hasMany(Query, { foreignKey: 'studentId' });
Query.belongsTo(Student, { foreignKey: 'studentId' });

Student.hasMany(Registration, { foreignKey: 'studentId' });
Registration.belongsTo(Student, { foreignKey: 'studentId' });

Company.hasMany(Registration, { foreignKey: 'companyId' });
Registration.belongsTo(Company, { foreignKey: 'companyId' });

Company.hasMany(History, { foreignKey: 'companyId' });
History.belongsTo(Company, { foreignKey: 'companyId' });

// New model associations
Student.hasMany(InternshipCertificate, { foreignKey: 'studentId' });
InternshipCertificate.belongsTo(Student, { foreignKey: 'studentId' });

Admin.hasMany(InternshipCertificate, { foreignKey: 'reviewedBy' });
InternshipCertificate.belongsTo(Admin, { foreignKey: 'reviewedBy' });

Student.hasMany(QuizAttempt, { foreignKey: 'studentId' });
QuizAttempt.belongsTo(Student, { foreignKey: 'studentId' });

Quiz.hasMany(QuizAttempt, { foreignKey: 'quizId' });
QuizAttempt.belongsTo(Quiz, { foreignKey: 'quizId' });

Student.belongsToMany(Badge, { through: StudentBadge, foreignKey: 'studentId' });
Badge.belongsToMany(Student, { through: StudentBadge, foreignKey: 'badgeId' });

Student.hasMany(HigherStudiesApplication, { foreignKey: 'studentId' });
HigherStudiesApplication.belongsTo(Student, { foreignKey: 'studentId' });

Admin.hasMany(HigherStudiesApplication, { foreignKey: 'reviewedBy' });
HigherStudiesApplication.belongsTo(Admin, { foreignKey: 'reviewedBy' });

Company.hasMany(BusRoute, { foreignKey: 'companyId' });
BusRoute.belongsTo(Company, { foreignKey: 'companyId' });

Student.hasMany(CalendarEvent, { foreignKey: 'studentId' });
CalendarEvent.belongsTo(Student, { foreignKey: 'studentId' });

module.exports = {
  sequelize,
  Student,
  Admin,
  Company,
  Query,
  Registration,
  Alumni,
  Message,
  History,
  BusRoute,
  InternshipCertificate,
  Quiz,
  QuizAttempt,
  Badge,
  StudentBadge,
  HigherStudiesApplication,
  CalendarEvent,
  Chat
};