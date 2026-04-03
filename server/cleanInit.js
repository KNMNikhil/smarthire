const { sequelize, Student, Admin, Company, Alumni } = require('./models');
const bcrypt = require('bcryptjs');

const cleanInitialize = async () => {
  try {
    console.log('🔄 Starting clean database initialization...');
    
    // Test connection first
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Drop and recreate all tables
    await sequelize.sync({ force: true });
    console.log('✅ Database tables recreated.');

    // Create default admin
    const hashedAdminPassword = await bcrypt.hash('admin123', 12);
    const admin = await Admin.create({
      username: 'admin',
      email: 'admin@smarthire.edu',
      password: hashedAdminPassword,
      name: 'System Administrator'
    });
    console.log('✅ Default admin created:', admin.username);

    // Create sample students with correct enum values
    const hashedStudentPassword = await bcrypt.hash('student123', 12);
    
    const student1 = await Student.create({
      name: 'John Doe',
      email: 'john.doe@student.edu',
      password: hashedStudentPassword,
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
      sem7Gpa: 8.7,
      placedStatus: 'Not Placed'
    });

    const student2 = await Student.create({
      name: 'Jane Smith',
      email: 'jane.smith@student.edu',
      password: hashedStudentPassword,
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
      sem7Gpa: 9.2,
      placedStatus: 'General'
    });

    const student3 = await Student.create({
      name: 'Mike Johnson',
      email: 'mike.johnson@student.edu',
      password: hashedStudentPassword,
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
      sem6Gpa: 7.9,
      placedStatus: 'Not Placed'
    });

    console.log('✅ Sample students created:', [student1.name, student2.name, student3.name]);

    // Create sample companies
    const company1 = await Company.create({
      name: 'TechCorp Solutions',
      description: 'Leading technology solutions provider',
      jobRole: 'Software Engineer',
      package: '12 LPA',
      location: 'Bangalore',
      visitDate: '2024-02-15',
      registrationDeadline: '2024-02-10',
      eligibilityCriteria: {
        minCgpa: 7.5,
        maxArrears: 0,
        minTenthPercentage: 75,
        minTwelfthPercentage: 75,
        requireInternship: false
      },
      status: 'Active',
      type: 'General'
    });

    const company2 = await Company.create({
      name: 'InnovateTech',
      description: 'Innovation-driven technology company',
      jobRole: 'Full Stack Developer',
      package: '15 LPA',
      location: 'Hyderabad',
      visitDate: '2024-02-20',
      registrationDeadline: '2024-02-15',
      eligibilityCriteria: {
        minCgpa: 8.0,
        maxArrears: 0,
        minTenthPercentage: 80,
        minTwelfthPercentage: 80,
        requireInternship: true
      },
      status: 'Active',
      type: 'Dream'
    });

    const company3 = await Company.create({
      name: 'DataSoft Systems',
      description: 'Data analytics and software solutions',
      jobRole: 'Data Analyst',
      package: '10 LPA',
      location: 'Chennai',
      visitDate: '2024-02-25',
      registrationDeadline: '2024-02-20',
      eligibilityCriteria: {
        minCgpa: 7.0,
        maxArrears: 1,
        minTenthPercentage: 70,
        minTwelfthPercentage: 70,
        requireInternship: false
      },
      status: 'Active',
      type: 'General'
    });

    console.log('✅ Sample companies created:', [company1.name, company2.name, company3.name]);

    // Create sample alumni
    const alumni1 = await Alumni.create({
      name: 'Sarah Wilson',
      batch: '2020-2024',
      company: 'Google',
      position: 'Software Engineer',
      linkedin: 'https://linkedin.com/in/sarahwilson',
      email: 'sarah.wilson@gmail.com',
      achievements: 'Placed in Google with 25 LPA package'
    });

    const alumni2 = await Alumni.create({
      name: 'David Brown',
      batch: '2019-2023',
      company: 'Microsoft',
      position: 'Product Manager',
      linkedin: 'https://linkedin.com/in/davidbrown',
      email: 'david.brown@outlook.com',
      achievements: 'Product Manager at Microsoft, MBA from IIM'
    });

    const alumni3 = await Alumni.create({
      name: 'Emily Davis',
      batch: '2018-2022',
      company: 'Amazon',
      position: 'Senior Developer',
      linkedin: 'https://linkedin.com/in/emilydavis',
      email: 'emily.davis@amazon.com',
      achievements: 'Senior Developer at Amazon Web Services'
    });

    console.log('✅ Sample alumni created:', [alumni1.name, alumni2.name, alumni3.name]);

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n=== Login Credentials ===');
    console.log('👨💼 Admin Login:');
    console.log('  Username: admin');
    console.log('  Password: admin123');
    console.log('\n👨🎓 Student Login:');
    console.log('  Email: john.doe@student.edu');
    console.log('  Password: student123');
    console.log('\n👩🎓 Another Student:');
    console.log('  Email: jane.smith@student.edu');
    console.log('  Password: student123');
    console.log('========================\n');

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    if (error.original) {
      console.log('Original Error:', error.original.message);
    }
  } finally {
    await sequelize.close();
    console.log('🔌 Database connection closed');
  }
};

// Run initialization
cleanInitialize();