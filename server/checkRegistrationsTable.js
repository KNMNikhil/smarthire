const { Registration, Student, Company, sequelize } = require('./models');

async function checkRegistrationsTable() {
  try {
    console.log('Checking Registrations table...');
    
    // Sync the table to ensure it exists
    await Registration.sync();
    
    // Get table structure
    const tableInfo = await sequelize.getQueryInterface().describeTable('Registrations');
    console.log('\n📋 Registrations Table Structure:');
    console.table(tableInfo);
    
    // Check current registrations
    const registrations = await Registration.findAll({
      include: [
        { model: Student, attributes: ['name', 'rollNo'] },
        { model: Company, attributes: ['name', 'jobRole'] }
      ]
    });
    
    console.log(`\n📊 Current Registrations: ${registrations.length}`);
    if (registrations.length > 0) {
      registrations.forEach(reg => {
        console.log(`- ${reg.Student?.name} (${reg.Student?.rollNo}) → ${reg.Company?.name} [${reg.status}]`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkRegistrationsTable();