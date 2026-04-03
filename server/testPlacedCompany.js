const { sequelize } = require('./config/database');
const Student = require('./models/Student');

async function testPlacedCompany() {
  try {
    console.log('Testing placed company functionality...');
    
    // Find a student to update
    const student = await Student.findOne({
      where: { rollNo: '220701120' }
    });
    
    if (student) {
      // Update student with Dream placement at TCS
      await student.update({
        placedStatus: 'Dream',
        placedCompany: 'TCS'
      });
      
      console.log('✅ Updated student:', {
        name: student.name,
        rollNo: student.rollNo,
        placedStatus: student.placedStatus,
        placedCompany: student.placedCompany
      });
    } else {
      console.log('❌ Student not found');
    }
    
    // Close the connection
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Error testing placed company:', error);
    process.exit(1);
  }
}

// Run the test
testPlacedCompany();