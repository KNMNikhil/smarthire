const { sequelize } = require('./config/database');
const { Student, Company, Registration } = require('./models');

async function testRegistrationAPI() {
  try {
    console.log('Testing registration API logic...');
    
    const student = await Student.findOne({ where: { rollNo: '220701115' } });
    const company = await Company.findOne({ where: { type: 'Dream' } });
    
    if (!student || !company) {
      console.log('❌ Student or company not found');
      return;
    }
    
    console.log(`Testing registration for: ${student.name} → ${company.name}`);
    
    // Simulate the registration API logic
    const studentId = student.id;
    const companyId = company.id;
    
    // Check if company is valid and deadline hasn't passed
    if (!company || company.registrationDeadline < new Date()) {
      console.log('❌ Registration deadline passed or company not found');
      return;
    }
    
    // Check existing registration
    let registration = await Registration.findOne({
      where: { studentId, companyId }
    });
    
    if (registration) {
      if (registration.status === 'Registered') {
        console.log('❌ Already registered for this company');
        return;
      }
      // Update existing record
      await registration.update({
        status: 'Registered',
        registeredAt: new Date()
      });
      console.log('✅ Updated existing registration');
    } else {
      // Create new registration
      registration = await Registration.create({
        studentId,
        companyId,
        status: 'Registered',
        registeredAt: new Date()
      });
      console.log('✅ Created new registration');
    }
    
    console.log('Registration details:', {
      studentId: registration.studentId,
      companyId: registration.companyId,
      status: registration.status,
      registeredAt: registration.registeredAt
    });
    
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Error testing registration API:', error);
    process.exit(1);
  }
}

testRegistrationAPI();