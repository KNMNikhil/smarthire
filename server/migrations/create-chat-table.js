const { sequelize } = require('../config/database');
const Chat = require('../models/Chat');

async function createChatTable() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Chat table created successfully');
  } catch (error) {
    console.error('Error creating Chat table:', error);
  } finally {
    await sequelize.close();
  }
}

createChatTable();
