const { sequelize, Company } = require('./models');

const verifyCompanyData = async () => {
  try {
    await sequelize.authenticate();
    
    const companies = await Company.findAll({
      attributes: ['id', 'name', 'location', 'package', 'eligibilityCriteria']
    });
    
    console.log('Current companies in database:');
    console.table(companies.map(c => ({
      id: c.id,
      name: c.name,
      location: c.location,
      package: c.package,
      eligibility: JSON.stringify(c.eligibilityCriteria)
    })));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

verifyCompanyData();