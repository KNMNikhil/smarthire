const { sequelize, Company } = require('./models');

const debugCompany = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully\n');
    
    // Get raw company data to see exact structure
    const companies = await sequelize.query('SELECT * FROM "Companies" ORDER BY "createdAt" DESC LIMIT 1', {
      type: sequelize.QueryTypes.SELECT
    });
    
    console.log('📊 RAW COMPANY DATA FROM DATABASE:');
    console.log('==================================');
    console.log(JSON.stringify(companies[0], null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

debugCompany();