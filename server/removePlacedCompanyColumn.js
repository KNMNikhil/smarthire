const { sequelize } = require('./config/database');

async function removePlacedCompanyColumn() {
  try {
    console.log('Removing placedCompany column from Students table...');
    
    // Remove the column
    await sequelize.query(`
      ALTER TABLE "Students" 
      DROP COLUMN IF EXISTS "placedCompany";
    `);
    
    console.log('✅ Successfully removed placedCompany column');
    
    // Close the connection
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Error removing placedCompany column:', error);
    process.exit(1);
  }
}

// Run the migration
removePlacedCompanyColumn();