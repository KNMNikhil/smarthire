const { sequelize, Student, Company } = require('./models');
const { checkStudentEligibility, getEligibleCompaniesForStudent } = require('./utils/eligibilityChecker');

const testEligibility = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully\n');
    
    // Get all students and companies
    const students = await Student.findAll();
    const companies = await Company.findAll();
    
    console.log('📊 ELIGIBILITY TEST RESULTS:');
    console.log('============================\n');
    
    if (students.length === 0) {
      console.log('❌ No students found in database');
      return;
    }
    
    if (companies.length === 0) {
      console.log('❌ No companies found in database');
      return;
    }
    
    // Test each student against each company
    students.forEach(student => {
      console.log(`🎓 STUDENT: ${student.name} (${student.rollNo})`);
      console.log(`   CGPA: ${student.cgpa || 'N/A'}`);
      console.log(`   10th: ${student.tenthPercentage || 'N/A'}%`);
      console.log(`   12th: ${student.twelfthPercentage || 'N/A'}%`);
      console.log(`   Arrears: ${student.arrears || 0}`);
      console.log(`   Internship: ${student.internship ? 'Yes' : 'No'}`);
      console.log(`   Status: ${student.placedStatus || 'Not Placed'}`);
      
      const eligibleCompanies = getEligibleCompaniesForStudent(student, companies);
      
      console.log(`\n   📋 ELIGIBLE COMPANIES (${eligibleCompanies.length}/${companies.length}):`);
      
      if (eligibleCompanies.length === 0) {
        console.log('   ❌ No eligible companies found');
        
        // Show why not eligible for each company
        companies.forEach(company => {
          const result = checkStudentEligibility(student, company);
          if (!result.isEligible) {
            console.log(`\n   🏢 ${company.name} - NOT ELIGIBLE:`);
            result.summary.failedCriteria.forEach(failed => {
              console.log(`      ❌ ${failed.criteria}: ${failed.reason}`);
            });
          }
        });
      } else {
        eligibleCompanies.forEach(company => {
          console.log(`   ✅ ${company.name} - ${company.jobRole} (${company.type})`);
        });
      }
      
      console.log('\n' + '='.repeat(60) + '\n');
    });
    
    // Summary
    console.log('📈 SUMMARY:');
    console.log('===========');
    students.forEach(student => {
      const eligibleCount = getEligibleCompaniesForStudent(student, companies).length;
      console.log(`${student.name}: ${eligibleCount}/${companies.length} companies`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testEligibility();