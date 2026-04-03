const { sequelize, Student, Company } = require('./models');
const { getEligibleCompaniesForStudent } = require('./utils/eligibilityChecker');

const testInboxData = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully\n');
    
    // Get a student (NIKHIL who should be eligible)
    const student = await Student.findOne({ where: { rollNo: '220701120' } });
    if (!student) {
      console.log('❌ Student not found');
      return;
    }
    
    // Get all companies
    const companies = await Company.findAll();
    const eligibleCompanies = getEligibleCompaniesForStudent(student, companies);
    
    console.log('📧 STUDENT INBOX DATA SIMULATION:');
    console.log('=================================\n');
    
    console.log(`Student: ${student.name} (${student.rollNo})`);
    console.log(`Eligible Companies: ${eligibleCompanies.length}\n`);
    
    eligibleCompanies.forEach(company => {
      const criteria = company.eligibilityCriteria || {};
      
      console.log(`🏢 ${company.name}`);
      console.log(`   Package: ${company.package || 'N/A'}`);
      console.log(`   Location: ${company.location || 'N/A'}`);
      console.log(`   Drive Date: ${company.visitDate ? new Date(company.visitDate).toLocaleDateString() : 'TBA'}`);
      console.log(`   Last Date: ${company.registrationDeadline ? new Date(company.registrationDeadline).toLocaleDateString() : 'TBA'}`);
      console.log(`   Requirements:`);
      console.log(`     CGPA: ${criteria.minCgpa ?? 0}+ | Last Sem GPA: ${criteria.minLastSemGpa ?? 0}+`);
      console.log(`     10th: ${criteria.minTenthPercentage ?? 0}%+ | 12th: ${criteria.minTwelfthPercentage ?? 0}%+`);
      console.log(`     Max Arrears: ${criteria.maxArrears ?? 0} | Internship: ${criteria.requireInternship ? 'Required' : 'Not Required'}`);
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testInboxData();