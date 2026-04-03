const { sequelize } = require('./config/database');
const { Student, Company, Registration } = require('./models');

async function testRegistrationFlow() {
  try {
    console.log('Testing complete registration flow...');
    
    // Find a student and company
    const student = await Student.findOne({ where: { rollNo: '220701115' } });
    const company = await Company.findOne({ where: { type: 'Dream' } });
    
    if (!student || !company) {
      console.log('❌ Student or company not found');
      return;
    }
    
    console.log(`👤 Student: ${student.name} (${student.rollNo})`);
    console.log(`🏢 Company: ${company.name} (${company.type})`);
    console.log(`📊 Student Status: ${student.placedStatus}`);
    
    // Check if student can see this company based on placement status
    let canSeeCompany = false;
    if (student.placedStatus === 'Not Placed') {
      canSeeCompany = ['General', 'Dream', 'Super Dream'].includes(company.type);
    } else if (student.placedStatus === 'Placed - General') {
      canSeeCompany = ['Dream', 'Super Dream'].includes(company.type);
    } else if (student.placedStatus === 'Placed - Dream') {
      canSeeCompany = ['General', 'Super Dream'].includes(company.type);
    } else if (student.placedStatus === 'Placed - Super Dream') {
      canSeeCompany = ['General', 'Dream'].includes(company.type);
    }
    
    console.log(`✅ Can see company: ${canSeeCompany}`);
    
    if (canSeeCompany) {
      // Check existing registration
      let registration = await Registration.findOne({
        where: {
          studentId: student.id,
          companyId: company.id
        }
      });
      
      if (!registration) {
        // Create registration
        registration = await Registration.create({
          studentId: student.id,
          companyId: company.id,
          status: 'Not Registered'
        });
        console.log('📝 Created registration record');
      }
      
      // Simulate student registration
      await registration.update({
        status: 'Registered',
        registeredAt: new Date()
      });
      
      console.log('✅ Student registered successfully');
      
      // Get all registrations for this company (admin view)
      const allRegistrations = await Registration.findAll({
        where: { companyId: company.id },
        include: [{
          model: Student,
          attributes: ['name', 'rollNo', 'email']
        }]
      });
      
      console.log('\\n📋 Admin view - Registrations for ' + company.name + ':');
      allRegistrations.forEach(reg => {
        console.log(`  - ${reg.Student.name} (${reg.Student.rollNo}): ${reg.status}`);
      });
    }
    
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Error testing registration flow:', error);
    process.exit(1);
  }
}

testRegistrationFlow();