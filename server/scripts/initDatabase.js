const bcrypt = require('bcryptjs');
const { sequelize, Admin, Student, Alumni } = require('../models');

const initializeDatabase = async () => {
  try {
    // Sync database
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');

    // Create default admin
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await Admin.create({
      username: 'admin',
      email: 'admin@smarthire.edu',
      password: hashedPassword,
      name: 'System Administrator'
    });
    console.log('Default admin created');

    // Create sample students
    const sampleStudents = [
      {
        name: 'John Doe',
        email: 'john.doe@student.edu',
        password: await bcrypt.hash('student123', 12),
        rollNo: 'CS2021001',
        dob: '2000-05-15',
        age: 23,
        tenthPercentage: 85.5,
        twelfthPercentage: 88.2,
        cgpa: 8.5,
        lastSemGpa: 8.7,
        arrears: 0,
        batch: '2021-2025'
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@student.edu',
        password: await bcrypt.hash('student123', 12),
        rollNo: 'CS2021002',
        dob: '2000-08-22',
        age: 23,
        tenthPercentage: 92.0,
        twelfthPercentage: 89.5,
        cgpa: 9.1,
        lastSemGpa: 9.2,
        arrears: 0,
        batch: '2021-2025'
      },
      {
        name: 'Mike Johnson',
        email: 'mike.johnson@student.edu',
        password: await bcrypt.hash('student123', 12),
        rollNo: 'CS2021003',
        dob: '2001-01-10',
        age: 22,
        tenthPercentage: 78.5,
        twelfthPercentage: 82.1,
        cgpa: 7.8,
        lastSemGpa: 8.0,
        arrears: 1,
        batch: '2021-2025'
      }
    ];

    await Student.bulkCreate(sampleStudents);
    console.log('Sample students created');

    // Create sample alumni
    const sampleAlumni = [
      {
        name: 'Sarah Wilson',
        batch: '2020-2024',
        company: 'Google',
        position: 'Software Engineer',
        linkedin: 'https://linkedin.com/in/sarahwilson',
        email: 'sarah.wilson@gmail.com',
        achievements: 'Placed in Google with 25 LPA package'
      },
      {
        name: 'David Brown',
        batch: '2019-2023',
        company: 'Microsoft',
        position: 'Product Manager',
        linkedin: 'https://linkedin.com/in/davidbrown',
        email: 'david.brown@outlook.com',
        achievements: 'Product Manager at Microsoft, MBA from IIM'
      },
      {
        name: 'Emily Davis',
        batch: '2018-2022',
        company: 'Amazon',
        position: 'Senior Developer',
        linkedin: 'https://linkedin.com/in/emilydavis',
        email: 'emily.davis@amazon.com',
        achievements: 'Senior Developer at Amazon Web Services'
      }
    ];

    await Alumni.bulkCreate(sampleAlumni);
    console.log('Sample alumni created');

    console.log('\n=== Database Initialization Complete ===');
    console.log('Default Admin Credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('\nSample Student Credentials:');
    console.log('Email: john.doe@student.edu');
    console.log('Password: student123');
    console.log('========================================\n');

  } catch (error) {
    console.error('Database initialization failed:', error);
  } finally {
    await sequelize.close();
  }
};

// Run initialization
initializeDatabase();