const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: ['http://localhost:3002', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Persistent storage using JSON files
const studentsFile = path.join(__dirname, 'students.json');
const companiesFile = path.join(__dirname, 'companies.json');

// Load existing students from file
let students = [];
let nextStudentId = 1;

// Load existing companies from file
let companies = [];
let nextCompanyId = 1;

const loadStudents = () => {
  try {
    if (fs.existsSync(studentsFile)) {
      const data = fs.readFileSync(studentsFile, 'utf8');
      const parsed = JSON.parse(data);
      students = parsed.students || [];
      nextStudentId = parsed.nextStudentId || 1;
      console.log(`Loaded ${students.length} students from database`);
    }
  } catch (error) {
    console.error('Error loading students:', error);
    students = [];
    nextStudentId = 1;
  }
};

const loadCompanies = () => {
  try {
    if (fs.existsSync(companiesFile)) {
      const data = fs.readFileSync(companiesFile, 'utf8');
      const parsed = JSON.parse(data);
      companies = parsed.companies || [];
      nextCompanyId = parsed.nextCompanyId || 1;
      console.log(`Loaded ${companies.length} companies from database`);
    }
  } catch (error) {
    console.error('Error loading companies:', error);
    companies = [];
    nextCompanyId = 1;
  }
};

const saveStudents = () => {
  try {
    const data = {
      students,
      nextStudentId
    };
    fs.writeFileSync(studentsFile, JSON.stringify(data, null, 2));
    console.log(`Saved ${students.length} students to database`);
  } catch (error) {
    console.error('Error saving students:', error);
  }
};

const saveCompanies = () => {
  try {
    const data = {
      companies,
      nextCompanyId
    };
    fs.writeFileSync(companiesFile, JSON.stringify(data, null, 2));
    console.log(`Saved ${companies.length} companies to database`);
  } catch (error) {
    console.error('Error saving companies:', error);
  }
};

// Load data on startup
loadStudents();
loadCompanies();

// Add empty semester fields to existing students if missing
const addSemesterFieldsToExistingStudents = () => {
  let updated = false;
  students.forEach(student => {
    if (!student.currentSemester) {
      student.currentSemester = '7';
      student.sem1Gpa = student.sem1Gpa || '';
      student.sem2Gpa = student.sem2Gpa || '';
      student.sem3Gpa = student.sem3Gpa || '';
      student.sem4Gpa = student.sem4Gpa || '';
      student.sem5Gpa = student.sem5Gpa || '';
      student.sem6Gpa = student.sem6Gpa || '';
      updated = true;
    }
  });
  if (updated) {
    saveStudents();
    console.log('Added empty semester GPA fields to existing students');
  }
};

addSemesterFieldsToExistingStudents();

// Student registration endpoint
app.post('/api/auth/student/register', (req, res) => {
  try {
    const { password, confirmPassword, ...studentData } = req.body;
    
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingStudent = students.find(s => 
      s.email === studentData.email || s.rollNo === studentData.rollNo
    );
    
    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this email or roll number already exists' });
    }

    const newStudent = {
      id: nextStudentId++,
      ...studentData,
      password: password,
      department: 'CSE',
      createdAt: new Date()
    };
    
    students.push(newStudent);
    saveStudents(); // Save to file
    console.log('Student registered:', newStudent.name);
    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Student login endpoint
app.post('/api/auth/student/login', (req, res) => {
  try {
    console.log('Student login attempt:', req.body);
    const { email, password } = req.body;
    console.log('Looking for student with email:', email);
    console.log('Available students:', students.map(s => ({ email: s.email, name: s.name })));
    
    const student = students.find(s => s.email === email && s.password === password);
    console.log('Found student:', student ? student.name : 'Not found');
    
    if (student) {
      const response = {
        token: `demo_token_student_${student.id}`,
        user: { id: student.id, name: student.name, email: student.email, role: 'student' }
      };
      console.log('Sending response:', response);
      res.json(response);
    } else {
      console.log('Invalid credentials for:', email);
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get student profile
app.get('/api/students/profile', (req, res) => {
  try {
    console.log('Profile request headers:', req.headers.authorization);
    console.log('Current students:', students.length);
    
    const token = req.headers.authorization?.replace('Bearer ', '');
    console.log('Extracted token:', token);
    
    if (!token || !token.startsWith('demo_token_student_')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const studentId = parseInt(token.replace('demo_token_student_', ''));
    console.log('Looking for student ID:', studentId);
    
    const student = students.find(s => s.id === studentId);
    console.log('Found student:', student ? student.name : 'Not found');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const { password, ...studentData } = student;
    console.log('Returning student data:', studentData);
    res.json(studentData);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update student profile
app.put('/api/students/profile', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || !token.startsWith('demo_token_student_')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const studentId = parseInt(token.replace('demo_token_student_', ''));
    const studentIndex = students.findIndex(s => s.id === studentId);
    
    if (studentIndex === -1) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    students[studentIndex] = { ...students[studentIndex], ...req.body };
    saveStudents(); // Save to file
    const { password, ...studentData } = students[studentIndex];
    
    res.json({ message: 'Profile updated successfully', student: studentData });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get student dashboard data
app.get('/api/students/dashboard', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || !token.startsWith('demo_token_student_')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const studentId = parseInt(token.replace('demo_token_student_', ''));
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Filter companies based on student eligibility
    const eligibleCompanies = companies.filter(company => {
      const studentCgpa = parseFloat(student.cgpa) || 0;
      // Calculate last semester GPA from semester data
      const currentSem = parseInt(student.currentSemester) || 8;
      const lastSemGpaField = `sem${currentSem - 1}Gpa`;
      const studentLastSemGpa = parseFloat(student[lastSemGpaField]) || parseFloat(student.lastSemGpa) || 0;
      const studentArrears = parseInt(student.arrears) || 0;
      const studentTenth = parseFloat(student.tenthPercentage) || 0;
      const studentTwelfth = parseFloat(student.twelfthPercentage) || 0;
      
      // Check eligibility criteria
      const cgpaEligible = !company.minCgpa || studentCgpa >= parseFloat(company.minCgpa);
      const lastSemEligible = !company.minLastSemGpa || studentLastSemGpa >= parseFloat(company.minLastSemGpa);
      const arrearsEligible = !company.maxArrears || studentArrears <= parseInt(company.maxArrears);
      const tenthEligible = !company.tenthMin || studentTenth >= parseFloat(company.tenthMin);
      const twelfthEligible = !company.twelfthMin || studentTwelfth >= parseFloat(company.twelfthMin);
      const internshipEligible = !company.requireInternship || student.internship;
      
      return cgpaEligible && lastSemEligible && arrearsEligible && 
             tenthEligible && twelfthEligible && internshipEligible;
    });
    
    const { password, ...studentData } = student;
    
    res.json({
      student: {
        ...studentData,
        placedStatus: studentData.placedStatus || 'Not Placed'
      },
      eligibleCompanies,
      totalEligible: eligibleCompanies.length
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin login endpoint
app.post('/api/auth/admin/login', (req, res) => {
  try {
    console.log('Admin login attempt:', req.body);
    const { username, password } = req.body;
    console.log('Admin credentials check:', { username, password });
    
    if (username === 'admin' && password === 'admin123') {
      const response = {
        token: 'demo_token_admin',
        user: { id: 1, name: 'System Administrator', username: 'admin', role: 'admin' }
      };
      console.log('Admin login successful, sending:', response);
      res.json(response);
    } else {
      console.log('Invalid admin credentials');
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin dashboard endpoint
app.get('/api/admin/dashboard', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || token !== 'demo_token_admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    console.log('Calculating dashboard stats...');
    console.log('Total students in database:', students.length);
    
    const totalStudents = students.length;
    const placedStudents = students.filter(s => s.placedStatus && s.placedStatus !== 'Not Placed').length;
    const activeCompanies = companies.length;
    const studentsWithArrears = students.filter(s => parseInt(s.arrears) > 0).length;
    
    console.log('Placed students:', placedStudents);
    console.log('Students with arrears:', studentsWithArrears);
    console.log('Active companies:', activeCompanies);
    
    // Calculate average CGPA
    const validCgpas = students.filter(s => s.cgpa && !isNaN(parseFloat(s.cgpa))).map(s => parseFloat(s.cgpa));
    const averageCgpa = validCgpas.length > 0 ? (validCgpas.reduce((a, b) => a + b, 0) / validCgpas.length).toFixed(2) : '0.00';
    
    console.log('Valid CGPAs:', validCgpas);
    console.log('Average CGPA:', averageCgpa);
    
    const placementPercentage = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;
    
    const dashboardData = {
      totalStudents,
      placedStudents,
      activeCompanies,
      studentsWithArrears,
      averageCgpa,
      placementPercentage,
      pendingQueries: 0
    };
    
    console.log('Dashboard data being sent:', dashboardData);
    res.json(dashboardData);
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



// Get student inbox (eligible companies)
app.get('/api/students/inbox', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || !token.startsWith('demo_token_student_')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const studentId = parseInt(token.replace('demo_token_student_', ''));
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Filter companies based on student eligibility (same logic as dashboard)
    const eligibleCompanies = companies.filter(company => {
      const studentCgpa = parseFloat(student.cgpa) || 0;
      // Calculate last semester GPA from semester data
      const currentSem = parseInt(student.currentSemester) || 8;
      const lastSemGpaField = `sem${currentSem - 1}Gpa`;
      const studentLastSemGpa = parseFloat(student[lastSemGpaField]) || parseFloat(student.lastSemGpa) || 0;
      const studentArrears = parseInt(student.arrears) || 0;
      const studentTenth = parseFloat(student.tenthPercentage) || 0;
      const studentTwelfth = parseFloat(student.twelfthPercentage) || 0;
      
      const cgpaEligible = !company.minCgpa || studentCgpa >= parseFloat(company.minCgpa);
      const lastSemEligible = !company.minLastSemGpa || studentLastSemGpa >= parseFloat(company.minLastSemGpa);
      const arrearsEligible = !company.maxArrears || studentArrears <= parseInt(company.maxArrears);
      const tenthEligible = !company.tenthMin || studentTenth >= parseFloat(company.tenthMin);
      const twelfthEligible = !company.twelfthMin || studentTwelfth >= parseFloat(company.twelfthMin);
      const internshipEligible = !company.requireInternship || student.internship;
      
      return cgpaEligible && lastSemEligible && arrearsEligible && 
             tenthEligible && twelfthEligible && internshipEligible;
    }).map(company => ({
      ...company,
      registrationLink: `https://${company.name.toLowerCase().replace(/\s+/g, '')}.com/register`,
      registrationDeadline: new Date(new Date(company.visitDate).getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: `Join ${company.name} as ${company.jobRole}`,
      location: 'Bangalore, India',
      eligibilityCriteria: {
        minCgpa: company.minCgpa,
        maxArrears: company.maxArrears,
        minTenthPercentage: company.tenthMin,
        minTwelfthPercentage: company.twelfthMin
      }
    }));
    
    res.json({
      eligibleCompanies,
      registrations: []
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get student queries
app.get('/api/students/queries', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || !token.startsWith('demo_token_student_')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const mockQueries = [
      {
        id: 1,
        subject: 'Placement Process Query',
        message: 'When will the next placement drive start?',
        status: 'Replied',
        reply: 'The next placement drive will start on February 15th, 2024.',
        createdAt: '2024-01-20',
        repliedAt: '2024-01-21'
      }
    ];
    
    res.json(mockQueries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get alumni data
app.get('/api/students/alumni', (req, res) => {
  try {
    const mockAlumni = [
      {
        id: 1,
        name: 'John Doe',
        batch: '2023',
        company: 'Google',
        position: 'Software Engineer',
        package: '25 LPA',
        email: 'john.doe@gmail.com'
      },
      {
        id: 2,
        name: 'Jane Smith',
        batch: '2022',
        company: 'Microsoft',
        position: 'Product Manager',
        package: '30 LPA',
        email: 'jane.smith@outlook.com'
      }
    ];
    
    res.json(mockAlumni);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin endpoint to get all students
app.get('/api/students', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || token !== 'demo_token_admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    console.log('Fetching students for admin - Total:', students.length);
    
    const studentsData = students.map(s => {
      const { password, ...studentData } = s;
      return studentData;
    });
    
    console.log('Returning students data:', studentsData.length, 'students');
    res.json(studentsData);
  } catch (error) {
    console.error('Students fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin endpoint to get all students (alternative route)
app.get('/api/admin/students', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || token !== 'demo_token_admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { all } = req.query;
    
    const studentsData = students.map(s => {
      const { password, ...studentData } = s;
      return studentData;
    });
    
    // If 'all' parameter is provided, return all students directly
    if (all === 'true') {
      return res.json(studentsData);
    }
    
    // Otherwise return paginated format for compatibility
    res.json({
      students: studentsData,
      total: studentsData.length,
      totalPages: 1,
      currentPage: 1
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin endpoint to update student
app.put('/api/admin/students/:id', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || token !== 'demo_token_admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const studentId = parseInt(req.params.id);
    const studentIndex = students.findIndex(s => s.id === studentId);
    
    if (studentIndex === -1) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    students[studentIndex] = { ...students[studentIndex], ...req.body };
    saveStudents();
    
    const { password, ...studentData } = students[studentIndex];
    res.json({ message: 'Student updated successfully', student: studentData });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin endpoint to update student (alternative route)
app.put('/api/students/:id', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || token !== 'demo_token_admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const studentId = parseInt(req.params.id);
    const studentIndex = students.findIndex(s => s.id === studentId);
    
    if (studentIndex === -1) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    students[studentIndex] = { ...students[studentIndex], ...req.body };
    saveStudents();
    
    const { password, ...studentData } = students[studentIndex];
    res.json({ message: 'Student updated successfully', student: studentData });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin endpoint to delete student
app.delete('/api/admin/students/:id', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || token !== 'demo_token_admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const studentId = parseInt(req.params.id);
    const studentIndex = students.findIndex(s => s.id === studentId);
    
    if (studentIndex === -1) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    students.splice(studentIndex, 1);
    saveStudents();
    
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin endpoint to delete student (alternative route)
app.delete('/api/students/:id', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || token !== 'demo_token_admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const studentId = parseInt(req.params.id);
    const studentIndex = students.findIndex(s => s.id === studentId);
    
    if (studentIndex === -1) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    students.splice(studentIndex, 1);
    saveStudents();
    
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin endpoint to add new student
app.post('/api/admin/students', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || token !== 'demo_token_admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const newStudent = {
      id: nextStudentId++,
      ...req.body,
      password: req.body.password || '123456', // Default password
      department: req.body.department || 'CSE',
      createdAt: new Date()
    };
    
    students.push(newStudent);
    saveStudents();
    
    const { password, ...studentData } = newStudent;
    res.status(201).json({ message: 'Student added successfully', student: studentData });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin endpoint to add new student (alternative route)
app.post('/api/students', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || token !== 'demo_token_admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const newStudent = {
      id: nextStudentId++,
      ...req.body,
      password: req.body.password || '123456', // Default password
      department: req.body.department || 'CSE',
      createdAt: new Date()
    };
    
    students.push(newStudent);
    saveStudents();
    
    const { password, ...studentData } = newStudent;
    res.status(201).json({ message: 'Student added successfully', student: studentData });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Test endpoint to see all students
app.get('/api/test/students', (req, res) => {
  res.json({ count: students.length, students: students.map(s => ({ id: s.id, name: s.name, email: s.email })) });
});

// Company management endpoints
app.get('/api/companies', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || token !== 'demo_token_admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    console.log('Fetching companies for admin - Total:', companies.length);
    console.log('Companies data:', companies);
    res.json(companies);
  } catch (error) {
    console.error('Companies fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/companies', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || token !== 'demo_token_admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const newCompany = {
      id: nextCompanyId++,
      ...req.body,
      createdAt: new Date()
    };
    
    companies.push(newCompany);
    saveCompanies();
    console.log('Company added:', newCompany.name);
    res.status(201).json({ message: 'Company added successfully', company: newCompany });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/companies/:id', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || token !== 'demo_token_admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const companyId = parseInt(req.params.id);
    const companyIndex = companies.findIndex(c => c.id === companyId);
    
    if (companyIndex === -1) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    companies[companyIndex] = { ...companies[companyIndex], ...req.body };
    saveCompanies();
    res.json({ message: 'Company updated successfully', company: companies[companyIndex] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/companies/:id', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || token !== 'demo_token_admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const companyId = parseInt(req.params.id);
    const companyIndex = companies.findIndex(c => c.id === companyId);
    
    if (companyIndex === -1) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    companies.splice(companyIndex, 1);
    saveCompanies();
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Calendar routes
const calendarRoutes = require('./routes/calendar');
app.use('/api/calendar', calendarRoutes);

app.get('/', (req, res) => res.json({ message: 'SmartHire Backend - Full Featured' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));