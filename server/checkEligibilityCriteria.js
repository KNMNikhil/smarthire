const { sequelize } = require('./config/database');
const { Student, Company } = require('./models');

async function checkEligibilityCriteria() {
  try {
    console.log('🔍 Checking eligibility criteria...');
    
    // Get all companies and their criteria
    const companies = await Company.findAll({
      attributes: ['id', 'name', 'type', 'eligibilityCriteria', 'registrationDeadline']
    });
    
    console.log('\\n📋 Company Eligibility Criteria:');
    companies.forEach(company => {
      console.log(`\\n🏢 ${company.name} (${company.type}):`);
      console.log(`   Deadline: ${company.registrationDeadline}`);
      console.log(`   Criteria:`, company.eligibilityCriteria);
    });
    
    // Get student who should be eligible
    const student = await Student.findOne({ 
      where: { rollNo: '220701115' },
      attributes: ['name', 'rollNo', 'cgpa', 'arrears', 'tenthPercentage', 'twelfthPercentage', 'age']
    });
    
    console.log(`\\n👤 Student Details: ${student.name}`);
    console.log(`   CGPA: ${student.cgpa}`);
    console.log(`   Arrears: ${student.arrears}`);
    console.log(`   10th %: ${student.tenthPercentage}`);
    console.log(`   12th %: ${student.twelfthPercentage}`);
    console.log(`   Age: ${student.age}`);
    
    // Check eligibility for each company
    console.log('\\n✅ Eligibility Check:');
    companies.forEach(company => {
      const criteria = company.eligibilityCriteria || {};
      const eligible = (
        (student.cgpa || 0) >= (criteria.minCgpa || 0) &&
        (student.arrears || 0) <= (criteria.maxArrears || 999) &&
        (student.tenthPercentage || 0) >= (criteria.minTenthPercentage || 0) &&
        (student.twelfthPercentage || 0) >= (criteria.minTwelfthPercentage || 0) &&
        (student.age || 0) >= (criteria.minAge || 0) &&
        (student.age || 100) <= (criteria.maxAge || 100)
      );
      
      console.log(`   ${company.name}: ${eligible ? '✅ ELIGIBLE' : '❌ NOT ELIGIBLE'}`);
      if (!eligible) {
        console.log(`     Reasons:`);
        if ((student.cgpa || 0) < (criteria.minCgpa || 0)) {
          console.log(`       - CGPA too low: ${student.cgpa} < ${criteria.minCgpa}`);
        }
        if ((student.arrears || 0) > (criteria.maxArrears || 999)) {
          console.log(`       - Too many arrears: ${student.arrears} > ${criteria.maxArrears}`);
        }
        if ((student.tenthPercentage || 0) < (criteria.minTenthPercentage || 0)) {
          console.log(`       - 10th % too low: ${student.tenthPercentage} < ${criteria.minTenthPercentage}`);
        }
        if ((student.twelfthPercentage || 0) < (criteria.minTwelfthPercentage || 0)) {
          console.log(`       - 12th % too low: ${student.twelfthPercentage} < ${criteria.minTwelfthPercentage}`);
        }
      }
    });
    
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Error checking eligibility:', error);
    process.exit(1);
  }
}

checkEligibilityCriteria();