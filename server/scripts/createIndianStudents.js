const bcrypt = require('bcryptjs');
const { sequelize, Student } = require('../models');

const createIndianStudents = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Create Indian students
    const indianStudents = [
      {
        name: 'Nikhil Sharma',
        email: 'nikhil@student.edu',
        password: await bcrypt.hash('student123', 12),
        rollNo: 'CS2021101',
        dob: '2000-03-15',
        age: 24,
        tenthPercentage: 87.5,
        twelfthPercentage: 89.2,
        cgpa: 8.7,
        lastSemGpa: 8.9,
        arrears: 0,
        batch: '2021-2025'
      },
      {
        name: 'Priya Patel',
        email: 'priya@student.edu',
        password: await bcrypt.hash('student123', 12),
        rollNo: 'CS2021102',
        dob: '2000-07-22',
        age: 24,
        tenthPercentage: 92.0,
        twelfthPercentage: 91.5,
        cgpa: 9.2,
        lastSemGpa: 9.4,
        arrears: 0,
        batch: '2021-2025'
      },
      {
        name: 'Rahul Kumar',
        email: 'rahul@student.edu',
        password: await bcrypt.hash('student123', 12),
        rollNo: 'CS2021103',
        dob: '2001-01-10',
        age: 23,
        tenthPercentage: 79.5,
        twelfthPercentage: 83.1,
        cgpa: 7.9,
        lastSemGpa: 8.1,
        arrears: 1,
        batch: '2021-2025'
      },
      {
        name: 'Ananya Singh',
        email: 'ananya@student.edu',
        password: await bcrypt.hash('student123', 12),
        rollNo: 'CS2021104',
        dob: '2000-11-05',
        age: 24,
        tenthPercentage: 88.7,
        twelfthPercentage: 87.9,
        cgpa: 8.4,
        lastSemGpa: 8.6,
        arrears: 0,
        batch: '2021-2025'
      }
    ];

    await Student.bulkCreate(indianStudents);
    console.log('Indian students created successfully');

    console.log('\n=== Student Login Credentials ===');
    indianStudents.forEach(student => {
      console.log(`Name: ${student.name}`);
      console.log(`Email: ${student.email}`);
      console.log(`Password: student123`);
      console.log('---');
    });

  } catch (error) {
    console.error('Error creating students:', error);
  } finally {
    await sequelize.close();
  }
};

createIndianStudents();