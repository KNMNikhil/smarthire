const { Registration, sequelize } = require('./models');

async function clearAllRegistrations() {
  try {
    console.log('Clearing all student registrations...');
    
    const deletedCount = await Registration.destroy({
      where: {},
      truncate: true
    });
    
    console.log(`✅ Successfully cleared all registrations. Deleted ${deletedCount} records.`);
    
  } catch (error) {
    console.error('❌ Error clearing registrations:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

clearAllRegistrations();