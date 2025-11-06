const bcrypt = require('bcryptjs');
const { Student } = require('./models');

const addTestStudent = async () => {
  try {
    const hashedPassword = await bcrypt.hash('123456', 12);
    
    const student = await Student.create({
      name: 'Nikhil Sharma',
      email: 'nikhil@test.com',
      password: hashedPassword,
      rollNo: 'CS2021001',
      dob: '2000-01-01',
      age: 24,
      tenthPercentage: 85.0,
      twelfthPercentage: 87.0,
      cgpa: 8.5,
      lastSemGpa: 8.7,
      arrears: 0,
      batch: '2021-2025',
      placedStatus: 'Not Placed'
    });

    console.log('Test student created:');
    console.log('Email: nikhil@test.com');
    console.log('Password: 123456');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit();
};

addTestStudent();