const { sequelize, Student, Admin, Company } = require('./models');
const bcrypt = require('bcryptjs');

const initializeDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    console.log('Synchronizing database...');
    await sequelize.sync({ force: false, alter: true });
    console.log('Database synchronized successfully.');
    
    // Create default admin if not exists
    const adminExists = await Admin.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await Admin.create({
        username: 'admin',
        email: 'admin@college.edu',
        password: hashedPassword,
        name: 'System Admin'
      });
      console.log('Default admin created: username=admin, password=admin123');
    }
    
    console.log('Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

initializeDatabase();