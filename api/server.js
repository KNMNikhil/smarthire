const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Load students data
let students = [
  {
    id: 1,
    name: "KAAVIYA G",
    email: "220701114@rajalakshmi.edu.in",
    rollNo: "220701114",
    password: "12",
    placedStatus: "Higher Studies",
    cgpa: "8.8",
    tenthPercentage: "95",
    twelfthPercentage: "97",
    arrears: 0,
    department: "CSE",
    batch: "2022-2026"
  },
  {
    id: 2,
    name: "KARUMURY NAGA MADHAVA NIKHIL",
    email: "220701120@rajalakshmi.edu.in",
    rollNo: "220701120",
    password: "12",
    placedStatus: "Higher Studies",
    cgpa: "7.5",
    tenthPercentage: "60",
    twelfthPercentage: "72",
    arrears: 0,
    department: "CSE",
    batch: "2022-2026"
  },
  {
    id: 3,
    name: "KALAISELVI S",
    email: "220701116@rajalakshmi.edu.in",
    rollNo: "220701116",
    password: "12",
    placedStatus: "Placed - Dream",
    cgpa: "8.5",
    tenthPercentage: "97",
    twelfthPercentage: "95",
    arrears: 0,
    department: "CSE",
    batch: "2022-2026"
  },
  {
    id: 4,
    name: "JAYANEE POOBALARAYAN",
    email: "220701102@rajalakshmi.edu.in",
    rollNo: "220701102",
    password: "12",
    placedStatus: "Placed - Super Dream",
    cgpa: "8.5",
    tenthPercentage: "97",
    twelfthPercentage: "97",
    arrears: 0,
    department: "CSE",
    batch: "2022-2026"
  },
  {
    id: 5,
    name: "KEERTHIVASAN S",
    email: "220701128@rajalakshmi.edu.in",
    rollNo: "220701128",
    password: "12",
    placedStatus: "Not Placed",
    cgpa: "7.4",
    tenthPercentage: "86",
    twelfthPercentage: "75",
    arrears: 0,
    department: "CSE",
    batch: "2022-2026"
  },
  {
    id: 6,
    name: "KAILAASH B",
    email: "220701115@rajalakshmi.edu.in",
    rollNo: "220701115",
    password: "12",
    placedStatus: "Not Placed",
    cgpa: "7.1",
    tenthPercentage: "70",
    twelfthPercentage: "73",
    arrears: 0,
    department: "CSE",
    batch: "2022-2026"
  }
];

let nextStudentId = 7;

let companies = [];

// Handle all /api routes
app.use('/api', (req, res, next) => {
  req.url = req.url.replace('/api', '');
  next();
});

// Student registration
app.post('/auth/student/register', (req, res) => {
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
    department: studentData.department || 'CSE',
    placedStatus: 'Not Placed',
    createdAt: new Date()
  };
  
  students.push(newStudent);
  res.status(201).json({ message: 'Student registered successfully' });
});

// Student login
app.post('/auth/student/login', (req, res) => {
  const { email, password } = req.body;
  const student = students.find(s => s.email === email && s.password === password);
  
  if (student) {
    res.json({
      token: `demo_token_student_${student.id}`,
      user: { id: student.id, name: student.name, email: student.email, role: 'student' }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Admin login
app.post('/auth/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    res.json({
      token: 'demo_token_admin',
      user: { id: 1, name: 'System Administrator', username: 'admin', role: 'admin' }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Student dashboard
app.get('/students/dashboard', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !token.startsWith('demo_token_student_')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const studentId = parseInt(token.replace('demo_token_student_', ''));
  const student = students.find(s => s.id === studentId);
  
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }
  
  res.json({
    student,
    eligibleCompanies: companies,
    totalEligible: companies.length
  });
});

// Admin dashboard
app.get('/admin/dashboard', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || token !== 'demo_token_admin') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const totalStudents = students.length;
  const placedStudents = students.filter(s => 
    ['Placed - General', 'Placed - Dream', 'Placed - Super Dream'].includes(s.placedStatus)
  ).length;
  
  res.json({
    totalStudents,
    placedStudents,
    activeCompanies: companies.length,
    studentsWithArrears: students.filter(s => parseInt(s.arrears) > 0).length,
    averageCgpa: '8.15',
    placementPercentage: totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0,
    pendingQueries: 0
  });
});

// Get students
app.get('/students', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || token !== 'demo_token_admin') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  res.json(students.map(s => ({ ...s, password: undefined })));
});

// Student profile
app.get('/students/profile', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !token.startsWith('demo_token_student_')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const studentId = parseInt(token.replace('demo_token_student_', ''));
  const student = students.find(s => s.id === studentId);
  
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }
  
  const { password, ...studentData } = student;
  res.json(studentData);
});

// Student inbox
app.get('/students/inbox', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !token.startsWith('demo_token_student_')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  res.json({
    eligibleCompanies: companies,
    registrations: []
  });
});

// Get companies
app.get('/companies', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || token !== 'demo_token_admin') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  res.json(companies);
});

module.exports = app;