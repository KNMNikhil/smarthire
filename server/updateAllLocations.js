const { Company, sequelize } = require('./models');

async function updateAllCompanyLocations() {
  try {
    console.log('Updating all company locations...\n');
    
    const updates = [
      { name: 'ZOHO', location: 'Bangalore, Karnataka' },
      { name: 'AMAZON', location: 'Hyderabad, Telangana' },
      { name: 'GOLDMAN SACHS', location: 'Mumbai, Maharashtra' },
      { name: 'GOOGLE', location: 'Bangalore, Karnataka' },
      { name: 'IBM', location: 'Pune, Maharashtra' }
    ];
    
    for (const update of updates) {
      await Company.update(
        { location: update.location },
        { where: { name: update.name } }
      );
      console.log(`✅ Updated ${update.name} → ${update.location}`);
    }
    
    console.log('\n✅ All company locations updated successfully!\n');
    
    // Verify
    const companies = await Company.findAll();
    console.log('Final company list:');
    companies.forEach(company => {
      console.log(`  ${company.name}: ${company.location || 'No location'}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

updateAllCompanyLocations();