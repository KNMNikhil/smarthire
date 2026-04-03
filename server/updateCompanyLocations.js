const { Company, sequelize } = require('./models');

async function updateCompanyLocations() {
  try {
    console.log('Checking companies...\n');
    
    const companies = await Company.findAll();
    
    console.log(`Found ${companies.length} companies:\n`);
    
    companies.forEach(company => {
      console.log(`- ${company.name}: Location = "${company.location || 'NULL'}"`);
    });
    
    // Update companies with locations
    console.log('\nUpdating company locations...\n');
    
    await Company.update(
      { location: 'Bangalore, Karnataka' },
      { where: { name: 'ZOHO' } }
    );
    
    await Company.update(
      { location: 'Hyderabad, Telangana' },
      { where: { name: 'AMAZON' } }
    );
    
    console.log('✅ Company locations updated!\n');
    
    // Verify updates
    const updatedCompanies = await Company.findAll();
    console.log('Updated companies:');
    updatedCompanies.forEach(company => {
      console.log(`- ${company.name}: ${company.location}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

updateCompanyLocations();