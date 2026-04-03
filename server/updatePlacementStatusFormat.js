const { sequelize } = require('./config/database');

async function updatePlacementStatusFormat() {
  try {
    console.log('Updating placement status format...');
    
    // First, update existing data
    await sequelize.query(`
      UPDATE "Students" 
      SET "placedStatus" = 'Placed - General' 
      WHERE "placedStatus" IN ('General', 'Placed (General)');
    `);
    
    await sequelize.query(`
      UPDATE "Students" 
      SET "placedStatus" = 'Placed - Dream' 
      WHERE "placedStatus" IN ('Dream', 'Placed (Dream)');
    `);
    
    await sequelize.query(`
      UPDATE "Students" 
      SET "placedStatus" = 'Placed - Super Dream' 
      WHERE "placedStatus" IN ('Super Dream', 'Placed (Super Dream)');
    `);
    
    // Then update enum constraint
    await sequelize.query(`
      ALTER TABLE "Students" 
      DROP CONSTRAINT IF EXISTS "Students_placedStatus_check";
    `);
    
    await sequelize.query(`
      ALTER TABLE "Students" 
      ADD CONSTRAINT "Students_placedStatus_check" 
      CHECK ("placedStatus" IN ('Not Placed', 'Placed - General', 'Placed - Dream', 'Placed - Super Dream', 'Higher Studies'));
    `);
    
    console.log('✅ Successfully updated placement status format');
    
    // Verify the changes
    const result = await sequelize.query(`
      SELECT "placedStatus", COUNT(*) as count 
      FROM "Students" 
      GROUP BY "placedStatus";
    `);
    
    console.log('Current placement status distribution:');
    result[0].forEach(row => {
      console.log(`- ${row.placedStatus}: ${row.count}`);
    });
    
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Error updating placement status format:', error);
    process.exit(1);
  }
}

updatePlacementStatusFormat();