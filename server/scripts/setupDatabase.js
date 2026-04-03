const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const setupDatabase = async () => {
  // First connect to postgres database to create our database
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || 'nikhil@2005',
    database: 'postgres' // Connect to default postgres database first
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Create database if it doesn't exist
    try {
      await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`Database ${process.env.DB_NAME} created successfully`);
    } catch (error) {
      if (error.code === '42P04') {
        console.log(`Database ${process.env.DB_NAME} already exists`);
      } else {
        throw error;
      }
    }

    await client.end();

    // Now initialize the database with tables and data
    const { sequelize, Admin, Student, Company, Alumni } = require('../models');
    
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    await sequelize.sync({ force: true });
    console.log('Database synchronized.');

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
        batch: '2021-2025',
        department: 'CSE',
        currentSemester: 8,
        sem1Gpa: 8.2,
        sem2Gpa: 8.4,
        sem3Gpa: 8.6,
        sem4Gpa: 8.3,
        sem5Gpa: 8.8,
        sem6Gpa: 8.5,
        sem7Gpa: 8.7
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
        batch: '2021-2025',
        department: 'ECE',
        currentSemester: 8,
        sem1Gpa: 9.0,
        sem2Gpa: 9.1,
        sem3Gpa: 9.2,
        sem4Gpa: 8.9,
        sem5Gpa: 9.3,
        sem6Gpa: 9.0,
        sem7Gpa: 9.2
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
        batch: '2021-2025',
        department: 'AIML',
        currentSemester: 7,
        sem1Gpa: 7.5,
        sem2Gpa: 7.8,
        sem3Gpa: 8.0,
        sem4Gpa: 7.6,
        sem5Gpa: 8.2,
        sem6Gpa: 7.9
      }
    ];

    await Student.bulkCreate(sampleStudents);
    console.log('Sample students created');

    // Create sample companies
    const sampleCompanies = [
      {
        name: 'TechCorp Solutions',
        jobRole: 'Software Engineer',
        package: '12 LPA',
        visitDate: '2024-02-15',
        minCgpa: 7.5,
        maxArrears: 0,
        tenthMin: 75,
        twelfthMin: 75,
        requireInternship: false
      },
      {
        name: 'InnovateTech',
        jobRole: 'Full Stack Developer',
        package: '15 LPA',
        visitDate: '2024-02-20',
        minCgpa: 8.0,
        maxArrears: 0,
        tenthMin: 80,
        twelfthMin: 80,
        requireInternship: true
      },
      {
        name: 'DataSoft Systems',
        jobRole: 'Data Analyst',
        package: '10 LPA',
        visitDate: '2024-02-25',
        minCgpa: 7.0,
        maxArrears: 1,
        tenthMin: 70,
        twelfthMin: 70,
        requireInternship: false
      }
    ];

    await Company.bulkCreate(sampleCompanies);
    console.log('Sample companies created');

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

    console.log('\n=== Database Setup Complete ===');
    console.log('Default Admin Credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('\nSample Student Credentials:');
    console.log('Email: john.doe@student.edu');
    console.log('Password: student123');
    console.log('===============================\n');

    await sequelize.close();

  } catch (error) {
    console.error('Database setup failed:', error);
  }
};

setupDatabase();