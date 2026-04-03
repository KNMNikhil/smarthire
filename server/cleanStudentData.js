const { sequelize, Student } = require('./models');

const cleanStudentData = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    
    // Find the student to keep
    const studentToKeep = await Student.findOne({
      where: {
        rollNo: '220701120'
      }
    });
    
    if (!studentToKeep) {
      console.log('Student with roll number 220701120 not found!');
      console.log('Available students:');
      const allStudents = await Student.findAll({
        attributes: ['id', 'name', 'rollNo', 'email']
      });
      console.table(allStudents.map(s => s.toJSON()));
      process.exit(1);
    }
    
    console.log('Found student to keep:', studentToKeep.name, '- Roll No:', studentToKeep.rollNo);
    
    // Delete all other students
    const deletedCount = await Student.destroy({
      where: {
        id: {
          [sequelize.Sequelize.Op.ne]: studentToKeep.id
        }
      }
    });
    
    console.log(`Deleted ${deletedCount} dummy student records.`);
    console.log('Remaining student:', studentToKeep.name);
    
    // Verify final count
    const finalCount = await Student.count();
    console.log(`Total students remaining: ${finalCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error cleaning student data:', error);
    process.exit(1);
  }
};

cleanStudentData();