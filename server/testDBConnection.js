const { sequelize, Student } = require('./models');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Test Student model
    const studentCount = await Student.count();
    console.log(`✅ Student model working. Current count: ${studentCount}`);
    
    // Test creating a sample student (will rollback)
    const transaction = await sequelize.transaction();
    try {
      const testStudent = await Student.create({
        name: 'Test Student',
        email: 'test@rajalakshmi.edu.in',
        rollNo: '123456789',
        password: 'hashedpassword',
        department: 'CSE',
        cgpa: 8.5,
        tenthPercentage: 85.0,
        twelfthPercentage: 87.0,
        age: 21,
        currentSemester: 7,
        batch: '2025-2026',
        dob: '2003-01-01'
      }, { transaction });
      
      console.log('✅ Student creation test successful');
      
      // Rollback the test
      await transaction.rollback();
      console.log('✅ Test data rolled back');
      
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Student creation test failed:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

testConnection();