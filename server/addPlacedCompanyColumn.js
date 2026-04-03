const { sequelize } = require('./config/database');

async function addPlacedCompanyColumn() {
  try {
    console.log('Adding placedCompany column to Students table...');
    
    // Add the new column
    await sequelize.query(`
      ALTER TABLE "Students" 
      ADD COLUMN IF NOT EXISTS "placedCompany" VARCHAR(255);
    `);
    
    console.log('✅ Successfully added placedCompany column');
    
    // Close the connection
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Error adding placedCompany column:', error);
    process.exit(1);
  }
}

// Run the migration
addPlacedCompanyColumn();