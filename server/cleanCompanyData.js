const { sequelize, Company } = require('./models');

const cleanCompanyData = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    
    // Find ZOHO company to keep
    const zohoCompany = await Company.findOne({
      where: {
        name: {
          [sequelize.Sequelize.Op.iLike]: '%zoho%'
        }
      }
    });
    
    if (!zohoCompany) {
      console.log('ZOHO company not found!');
      console.log('Available companies:');
      const allCompanies = await Company.findAll({
        attributes: ['id', 'name', 'location']
      });
      console.table(allCompanies.map(c => c.toJSON()));
      process.exit(1);
    }
    
    console.log('Found ZOHO company to keep:', zohoCompany.name);
    
    // Delete all other companies
    const deletedCount = await Company.destroy({
      where: {
        id: {
          [sequelize.Sequelize.Op.ne]: zohoCompany.id
        }
      }
    });
    
    console.log(`Deleted ${deletedCount} dummy company records.`);
    console.log('Remaining company:', zohoCompany.name);
    
    // Verify final count
    const finalCount = await Company.count();
    console.log(`Total companies remaining: ${finalCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error cleaning company data:', error);
    process.exit(1);
  }
};

cleanCompanyData();