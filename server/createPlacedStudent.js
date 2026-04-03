const { sequelize } = require('./config/database');
const { Student, Company, Registration } = require('./models');

async function createPlacedStudent() {
  try {
    console.log('Setting up placed student scenario...');
    
    // Find the student KAILAASH B
    const student = await Student.findOne({
      where: { rollNo: '220701115' }
    });
    
    if (!student) {
      console.log('❌ Student KAILAASH B not found');
      return;
    }
    
    // Find a company to place the student in
    const company = await Company.findOne({
      where: { type: 'Dream' }
    });
    
    if (!company) {
      console.log('❌ No Dream company found');
      return;
    }
    
    // Update student placement status
    await student.update({
      placedStatus: 'Placed - Dream'
    });
    
    // Create or update registration as Selected
    const [registration, created] = await Registration.findOrCreate({
      where: {
        studentId: student.id,
        companyId: company.id
      },
      defaults: {
        status: 'Selected',
        registeredAt: new Date()
      }
    });
    
    if (!created) {
      await registration.update({
        status: 'Selected'
      });
    }
    
    console.log('✅ Successfully set up placed student:');
    console.log(`- Student: ${student.name} (${student.rollNo})`);
    console.log(`- Status: ${student.placedStatus}`);
    console.log(`- Company: ${company.name} (${company.type})`);
    console.log(`- Registration Status: ${registration.status}`);
    
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Error setting up placed student:', error);
    process.exit(1);
  }
}

createPlacedStudent();