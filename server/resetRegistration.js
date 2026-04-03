const { sequelize } = require('./config/database');
const { Student, Company, Registration } = require('./models');

async function resetRegistration() {
  try {
    console.log('Resetting registration for testing...');
    
    const student = await Student.findOne({ where: { rollNo: '220701115' } });
    const company = await Company.findOne({ where: { type: 'Dream' } });
    
    if (student && company) {
      // Delete existing registration
      await Registration.destroy({
        where: {
          studentId: student.id,
          companyId: company.id
        }
      });
      
      console.log(`✅ Reset registration for ${student.name} → ${company.name}`);
    }
    
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Error resetting registration:', error);
    process.exit(1);
  }
}

resetRegistration();