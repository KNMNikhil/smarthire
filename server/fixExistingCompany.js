const { sequelize, Company } = require('./models');

const fixExistingCompany = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully\n');
    
    // Update the ZOHO company with proper eligibility criteria
    const company = await Company.findOne({ where: { name: 'ZOHO' } });
    
    if (company) {
      await company.update({
        eligibilityCriteria: {
          minCgpa: 7.5,
          minLastSemGpa: 0,
          maxArrears: 0,
          minTenthPercentage: 60,
          minTwelfthPercentage: 60,
          requireInternship: false
        }
      });
      
      console.log('✅ Updated ZOHO company with eligibility criteria');
      
      // Verify the update
      const updatedCompany = await Company.findOne({ where: { name: 'ZOHO' } });
      console.log('\n📊 Updated Company Data:');
      console.log('========================');
      console.log(`Company: ${updatedCompany.name}`);
      console.log(`Min CGPA: ${updatedCompany.eligibilityCriteria.minCgpa}`);
      console.log(`Max Arrears: ${updatedCompany.eligibilityCriteria.maxArrears}`);
      console.log(`10th Min: ${updatedCompany.eligibilityCriteria.minTenthPercentage}%`);
      console.log(`12th Min: ${updatedCompany.eligibilityCriteria.minTwelfthPercentage}%`);
    } else {
      console.log('❌ ZOHO company not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixExistingCompany();