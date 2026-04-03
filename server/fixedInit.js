const { sequelize, Student, Admin, Company, Alumni, Query } = require('./models');
const bcrypt = require('bcryptjs');

const initializeDatabase = async () => {
  try {
    console.log('🔄 Starting database initialization...');
    
    // Test connection first
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized.');

    // Create default admin
    const existingAdmin = await Admin.findOne({ where: { username: 'admin' } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await Admin.create({
        username: 'admin',
        email: 'admin@smarthire.edu',
        password: hashedPassword,
        name: 'System Administrator'
      });
      console.log('✅ Default admin created');
    } else {
      console.log('ℹ️  Admin already exists');
    }

    // Create sample students
    const studentCount = await Student.count();
    if (studentCount === 0) {
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
          sem7Gpa: 8.7,
          placedStatus: 'Not Placed'
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
          sem7Gpa: 9.2,
          placedStatus: 'General'
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
          sem6Gpa: 7.9,
          placedStatus: 'Not Placed'
        }
      ];

      await Student.bulkCreate(sampleStudents);
      console.log('✅ Sample students created');
    } else {
      console.log('ℹ️  Students already exist');
    }

    // Create sample companies
    const companyCount = await Company.count();
    if (companyCount === 0) {
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
      console.log('✅ Sample companies created');
    } else {
      console.log('ℹ️  Companies already exist');
    }

    // Create sample alumni
    const alumniCount = await Alumni.count();
    if (alumniCount === 0) {
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
      console.log('✅ Sample alumni created');
    } else {
      console.log('ℹ️  Alumni already exist');
    }

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n=== Login Credentials ===');
    console.log('👨‍💼 Admin Login:');
    console.log('  Username: admin');
    console.log('  Password: admin123');
    console.log('\n👨‍🎓 Student Login:');
    console.log('  Email: john.doe@student.edu');
    console.log('  Password: student123');
    console.log('========================\n');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    console.log('\n🔧 Error Details:');
    console.log('Message:', error.message);
    if (error.original) {
      console.log('Original Error:', error.original.message);
    }
  } finally {
    await sequelize.close();
    console.log('🔌 Database connection closed');
  }
};

// Run initialization
initializeDatabase();