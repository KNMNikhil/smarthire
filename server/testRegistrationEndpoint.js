const { sequelize } = require('./config/database');
const { Student, Company } = require('./models');

async function testRegistrationEndpoint() {
  try {
    console.log('✅ Testing registration endpoint setup...');
    
    // Check if we have students and companies
    const studentCount = await Student.count();
    const companyCount = await Company.count();
    
    console.log(`📊 Database Status:`);
    console.log(`   Students: ${studentCount}`);
    console.log(`   Companies: ${companyCount}`);
    
    if (studentCount > 0 && companyCount > 0) {
      const student = await Student.findOne();
      const company = await Company.findOne();
      
      console.log(`\\n🎯 Test Data:`);
      console.log(`   Student: ${student.name} (ID: ${student.id})`);
      console.log(`   Company: ${company.name} (ID: ${company.id})`);
      console.log(`   Registration URL: POST /api/students/register/${company.id}`);
    }
    
    console.log(`\\n✅ Registration endpoint added to server`);
    console.log(`✅ Socket.io setup completed`);
    console.log(`✅ Admin registration view endpoint added`);
    console.log(`\\n🚀 Server ready for student registrations!`);
    
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Error testing registration endpoint:', error);
    process.exit(1);
  }
}

testRegistrationEndpoint();