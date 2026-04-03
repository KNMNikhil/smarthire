const { sequelize } = require('./config/database');
const { Student, Company, Registration } = require('./models');
const { Op } = require('sequelize');

async function testStudentDashboard() {
  try {
    console.log('Testing student dashboard logic...');
    
    // Test with different students
    const students = await Student.findAll({
      attributes: ['id', 'name', 'rollNo', 'placedStatus'],
      order: [['name', 'ASC']]
    });
    
    for (const student of students) {
      console.log(`\\n👤 Testing dashboard for: ${student.name} (${student.rollNo})`);
      console.log(`Placement Status: ${student.placedStatus}`);
      
      // Determine company types to show
      let companyTypeFilter = [];
      
      if (student.placedStatus === 'Not Placed') {
        companyTypeFilter = ['General', 'Dream', 'Super Dream'];
      } else if (student.placedStatus === 'Placed - General') {
        companyTypeFilter = ['Dream', 'Super Dream'];
      } else if (student.placedStatus === 'Placed - Dream') {
        companyTypeFilter = ['General', 'Super Dream'];
      } else if (student.placedStatus === 'Placed - Super Dream') {
        companyTypeFilter = ['General', 'Dream'];
      } else {
        companyTypeFilter = [];
      }
      
      console.log(`Company types to show: ${companyTypeFilter.join(', ')}`);
      
      // Get eligible companies
      const eligibleCompanies = await Company.findAll({
        where: {
          status: 'Active',
          type: { [Op.in]: companyTypeFilter }
        },
        attributes: ['name', 'type']
      });
      
      console.log(`Companies shown (${eligibleCompanies.length}):`);
      eligibleCompanies.forEach(company => {
        console.log(`  - ${company.name} (${company.type})`);
      });
      
      // Get placed companies if student is placed
      if (['Placed - General', 'Placed - Dream', 'Placed - Super Dream'].includes(student.placedStatus)) {
        const selectedRegistrations = await Registration.findAll({
          where: {
            studentId: student.id,
            status: 'Selected'
          },
          include: [{
            model: Company,
            attributes: ['name', 'type']
          }]
        });
        
        if (selectedRegistrations.length > 0) {
          console.log(`Placed companies:`);
          selectedRegistrations.forEach(reg => {
            console.log(`  ✅ ${reg.Company.name} (${reg.Company.type})`);
          });
        }
      }
    }
    
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Error testing student dashboard:', error);
    process.exit(1);
  }
}

testStudentDashboard();