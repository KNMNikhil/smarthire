const { sequelize, Student, Company } = require('./models');

const debugKalaiselvi = async () => {
  try {
    await sequelize.authenticate();
    
    const student = await Student.findOne({
      where: { rollNo: '220701116' }
    });
    
    if (!student) {
      console.log('Student not found');
      return;
    }
    
    console.log('Student Details:');
    console.log('Name:', student.name);
    console.log('Placement Status:', student.placedStatus);
    console.log('CGPA:', student.cgpa);
    console.log('Arrears:', student.arrears);
    console.log('Tenth %:', student.tenthPercentage);
    console.log('Twelfth %:', student.twelfthPercentage);
    console.log('Internship:', student.internship);
    
    const companies = await Company.findAll();
    console.log('\nAvailable Companies:');
    companies.forEach(company => {
      console.log(`\nCompany: ${company.name}`);
      console.log('Type:', company.type);
      console.log('Criteria:', JSON.stringify(company.eligibilityCriteria, null, 2));
    });
    
    // Check eligibility
    const { getEligibleCompaniesForStudent } = require('./utils/eligibilityChecker');
    const eligibleCompanies = getEligibleCompaniesForStudent(student, companies);
    
    console.log('\nEligible Companies:', eligibleCompanies.length);
    eligibleCompanies.forEach(company => {
      console.log('- ' + company.name);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

debugKalaiselvi();