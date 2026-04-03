const { sequelize } = require('./config/database');
const { Student } = require('./models');

async function testNewPlacementFormat() {
  try {
    console.log('Testing new placement format...');
    
    // Get all students with their placement status
    const students = await Student.findAll({
      attributes: ['name', 'rollNo', 'placedStatus'],
      order: [['name', 'ASC']]
    });
    
    console.log('All students with new placement format:');
    students.forEach(student => {
      console.log(`- ${student.name} (${student.rollNo}): ${student.placedStatus}`);
    });
    
    // Test updating a student to the new format
    const testStudent = await Student.findOne({
      where: { rollNo: '220701115' }
    });
    
    if (testStudent) {
      await testStudent.update({
        placedStatus: 'Placed - Dream'
      });
      
      console.log(`\\n✅ Successfully updated ${testStudent.name} to: ${testStudent.placedStatus}`);
    }
    
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Error testing new placement format:', error);
    process.exit(1);
  }
}

testNewPlacementFormat();