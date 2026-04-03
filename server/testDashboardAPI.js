const { sequelize } = require('./config/database');
const { Student, Company, Registration } = require('./models');

async function testDashboardAPI() {
  try {
    console.log('Testing dashboard API logic...');
    
    // Find the student
    const student = await Student.findOne({
      where: { rollNo: '220701115' }
    });
    
    if (!student) {
      console.log('❌ Student not found');
      return;
    }
    
    console.log('Student found:', {
      name: student.name,
      rollNo: student.rollNo,
      placedStatus: student.placedStatus
    });
    
    // Get placed companies if student is placed
    let placedCompanies = [];
    if (['General', 'Dream', 'Super Dream'].includes(student.placedStatus)) {
      const selectedRegistrations = await Registration.findAll({
        where: {
          studentId: student.id,
          status: 'Selected'
        },
        include: [{
          model: Company,
          attributes: ['id', 'name', 'type', 'package']
        }]
      });
      placedCompanies = selectedRegistrations.map(reg => reg.Company);
    }
    
    console.log('Placed companies:', placedCompanies.map(c => ({
      name: c.name,
      type: c.type,
      package: c.package
    })));
    
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Error testing dashboard API:', error);
    process.exit(1);
  }
}

testDashboardAPI();