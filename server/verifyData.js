const { sequelize, Student } = require('./models');

const verifyData = async () => {
  try {
    await sequelize.authenticate();
    
    const students = await Student.findAll({
      attributes: ['id', 'name', 'rollNo', 'email', 'department', 'cgpa']
    });
    
    console.log('Current students in database:');
    console.table(students.map(s => s.toJSON()));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

verifyData();