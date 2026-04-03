const { sequelize } = require('../config/database');

async function addBroadcastColumn() {
  try {
    await sequelize.query(`
      ALTER TABLE "Chats" 
      ADD COLUMN IF NOT EXISTS "isBroadcast" BOOLEAN DEFAULT false;
    `);
    console.log('Broadcast column added successfully');
  } catch (error) {
    console.error('Error adding broadcast column:', error);
  } finally {
    await sequelize.close();
  }
}

addBroadcastColumn();
