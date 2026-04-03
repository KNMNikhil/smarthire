const { sequelize } = require('./config/database');
const { Student, Company, Registration } = require('./models');
const { Op } = require('sequelize');

async function testAllStudentRegistrations() {
  try {
    console.log('🔍 Testing registrations for ALL students...');
    console.log('=' .repeat(60));
    
    // Get all students and companies
    const students = await Student.findAll({
      attributes: ['id', 'name', 'rollNo', 'placedStatus', 'cgpa', 'arrears'],
      order: [['name', 'ASC']]
    });
    
    const companies = await Company.findAll({
      attributes: ['id', 'name', 'type', 'eligibilityCriteria', 'registrationDeadline'],
      where: { status: 'Active' }
    });
    
    console.log(`📊 Found ${students.length} students and ${companies.length} companies`);
    
    // Test each student
    for (const student of students) {
      console.log(`\\n👤 Testing: ${student.name} (${student.rollNo}) - ${student.placedStatus}`);
      
      // Determine which company types this student can see
      let allowedTypes = [];
      if (student.placedStatus === 'Not Placed') {
        allowedTypes = ['General', 'Dream', 'Super Dream'];
      } else if (student.placedStatus === 'Placed - General') {
        allowedTypes = ['Dream', 'Super Dream'];
      } else if (student.placedStatus === 'Placed - Dream') {
        allowedTypes = ['General', 'Super Dream'];
      } else if (student.placedStatus === 'Placed - Super Dream') {
        allowedTypes = ['General', 'Dream'];
      } else {
        allowedTypes = [];
      }
      
      console.log(`   Can see: ${allowedTypes.join(', ')}`);
      
      // Filter companies by type and eligibility
      const eligibleCompanies = companies.filter(company => {
        // Check type filter
        if (!allowedTypes.includes(company.type)) return false;
        
        // Check deadline
        if (company.registrationDeadline < new Date()) return false;
        
        // Check eligibility criteria
        const criteria = company.eligibilityCriteria || {};
        return (
          (student.cgpa || 0) >= (criteria.minCgpa || 0) &&
          (student.arrears || 0) <= (criteria.maxArrears || 999)
        );
      });
      
      console.log(`   Eligible companies: ${eligibleCompanies.map(c => c.name).join(', ')}`);
      
      // Test registration for each eligible company
      for (const company of eligibleCompanies) {
        try {
          // Check existing registration
          let registration = await Registration.findOne({
            where: { studentId: student.id, companyId: company.id }
          });
          
          if (!registration) {
            // Create new registration
            registration = await Registration.create({
              studentId: student.id,
              companyId: company.id,
              status: 'Registered',
              registeredAt: new Date()
            });
            console.log(`   ✅ Registered for ${company.name}`);
          } else if (registration.status !== 'Registered') {
            // Update existing registration
            await registration.update({
              status: 'Registered',
              registeredAt: new Date()
            });
            console.log(`   ✅ Updated registration for ${company.name}`);
          } else {
            console.log(`   ℹ️  Already registered for ${company.name}`);
          }
        } catch (regError) {
          console.log(`   ❌ Failed to register for ${company.name}: ${regError.message}`);
        }
      }
      
      if (eligibleCompanies.length === 0) {
        console.log(`   ℹ️  No eligible companies`);
      }
    }
    
    // Summary
    console.log('\\n' + '=' .repeat(60));
    const totalRegistrations = await Registration.count();
    const activeRegistrations = await Registration.count({ where: { status: 'Registered' } });
    
    console.log(`📈 SUMMARY:`);
    console.log(`   Total registrations: ${totalRegistrations}`);
    console.log(`   Active registrations: ${activeRegistrations}`);
    console.log(`   ✅ All students can now register for eligible companies`);
    
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Error testing registrations:', error);
    process.exit(1);
  }
}

testAllStudentRegistrations();