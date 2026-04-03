const { sequelize, Company } = require('./models');

const testCompanyFix = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully\n');
    
    // Get all companies with their eligibility criteria
    const companies = await Company.findAll({
      order: [['name', 'ASC']]
    });
    
    console.log('📊 CURRENT COMPANY DATA:');
    console.log('========================');
    
    if (companies.length === 0) {
      console.log('No companies found in database.');
    } else {
      companies.forEach(company => {
        console.log(`\n🏢 Company: ${company.name}`);
        console.log(`   Job Role: ${company.jobRole}`);
        console.log(`   Package: ${company.package}`);
        console.log(`   Type: ${company.type}`);
        console.log(`   Eligibility Criteria:`);
        
        if (company.eligibilityCriteria) {
          const criteria = company.eligibilityCriteria;
          console.log(`     - Min CGPA: ${criteria.minCgpa || 'N/A'}`);
          console.log(`     - Max Arrears: ${criteria.maxArrears || 'N/A'}`);
          console.log(`     - 10th Min: ${criteria.minTenthPercentage || 'N/A'}%`);
          console.log(`     - 12th Min: ${criteria.minTwelfthPercentage || 'N/A'}%`);
          console.log(`     - Require Internship: ${criteria.requireInternship ? 'Yes' : 'No'}`);
        } else {
          console.log(`     - No eligibility criteria found`);
        }
      });
    }
    
    console.log('\n✅ Company data check complete!');
    console.log('If eligibility criteria are showing as N/A, create a new company to test the fix.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testCompanyFix();