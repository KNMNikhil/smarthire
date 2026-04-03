const { sequelize } = require('./config/database');
const Student = require('./models/Student');

async function testFullPlacementFlow() {
  try {
    console.log('Testing full placement flow...');
    
    // Test 1: Update a student with Dream placement
    const student1 = await Student.findOne({ where: { rollNo: '220701120' } });
    if (student1) {
      await student1.update({
        placedStatus: 'Dream',
        placedCompany: 'TCS'
      });
      console.log('✅ Student 1 updated:', {
        name: student1.name,
        rollNo: student1.rollNo,
        placedStatus: student1.placedStatus,
        placedCompany: student1.placedCompany
      });
    }
    
    // Test 2: Update another student with General placement
    const student2 = await Student.findOne({ where: { rollNo: '220701114' } });
    if (student2) {
      await student2.update({
        placedStatus: 'General',
        placedCompany: 'Infosys'
      });
      console.log('✅ Student 2 updated:', {
        name: student2.name,
        rollNo: student2.rollNo,
        placedStatus: student2.placedStatus,
        placedCompany: student2.placedCompany
      });
    }
    
    // Test 3: Fetch all placed students
    const placedStudents = await Student.findAll({
      where: {
        placedStatus: { [require('sequelize').Op.in]: ['General', 'Dream', 'Super Dream'] }
      },
      attributes: ['name', 'rollNo', 'placedStatus', 'placedCompany']
    });
    
    console.log('\\n📊 All placed students:');
    placedStudents.forEach(student => {
      console.log(`- ${student.name} (${student.rollNo}): ${student.placedStatus}${student.placedCompany ? ` @ ${student.placedCompany}` : ''}`);
    });
    
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Error in test:', error);
    process.exit(1);
  }
}

testFullPlacementFlow();