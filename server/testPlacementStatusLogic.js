const { sequelize } = require('./config/database');
const { Student, Company } = require('./models');
const { Op } = require('sequelize');

async function testPlacementStatusLogic() {
  try {
    console.log('Testing placement status logic...');
    
    // Get all companies by type
    const companies = await Company.findAll({
      attributes: ['name', 'type'],
      order: [['type', 'ASC'], ['name', 'ASC']]
    });
    
    console.log('Available companies:');
    companies.forEach(company => {
      console.log(`- ${company.name} (${company.type})`);
    });
    
    // Test different placement statuses
    const testCases = [
      { status: 'Not Placed', expectedTypes: ['General', 'Dream', 'Super Dream'] },
      { status: 'Placed - General', expectedTypes: ['Dream', 'Super Dream'] },
      { status: 'Placed - Dream', expectedTypes: ['General', 'Super Dream'] },
      { status: 'Placed - Super Dream', expectedTypes: ['General', 'Dream'] },
      { status: 'Higher Studies', expectedTypes: [] }
    ];
    
    for (const testCase of testCases) {
      console.log(`\\n📋 Testing ${testCase.status}:`);
      console.log(`Expected company types: ${testCase.expectedTypes.join(', ')}`);
      
      const filteredCompanies = await Company.findAll({
        where: {
          status: 'Active',
          type: { [Op.in]: testCase.expectedTypes }
        },
        attributes: ['name', 'type']
      });
      
      console.log(`Companies shown (${filteredCompanies.length}):`);
      filteredCompanies.forEach(company => {
        console.log(`  - ${company.name} (${company.type})`);
      });
    }
    
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Error testing placement status logic:', error);
    process.exit(1);
  }
}

testPlacementStatusLogic();