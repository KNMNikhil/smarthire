const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const { sequelize, Student, Admin, Company, Query, Registration, Alumni, Message, History } = require('./models');
const multer = require('multer');
const path = require('path');
const resumeController = require('./controllers/resumeController');
const learningRoutes = require('./routes/learning');
const seedLearningData = require('./utils/seedLearningData');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.CLIENT_URL, 'https://smarthire-frontend.onrender.com']
      : ['http://localhost:3002', 'http://localhost:3000', 'http://localhost:3001', 'http://192.168.68.114:3000'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Chat message storage
const chatMessages = [];
const connectedUsers = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userData) => {
    socket.join(userData.role);
    socket.userData = userData;
    connectedUsers.set(socket.id, userData);

    // Send chat history to newly connected user
    socket.emit('chatHistory', chatMessages);

    // Notify all users about connected users
    io.emit('userConnected', Array.from(connectedUsers.values()));

    console.log(`${userData.name} (${userData.role}) joined chat`);
  });

  socket.on('sendMessage', (message) => {
    const fullMessage = {
      ...message,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    // Store message
    chatMessages.push(fullMessage);

    // Keep only last 100 messages
    if (chatMessages.length > 100) {
      chatMessages.shift();
    }

    // Broadcast to all connected users
    io.emit('message', fullMessage);

    console.log(`Message from ${message.sender}: ${message.text}`);
  });

  socket.on('messageDelivered', ({ messageId }) => {
    // Update message status
    const message = chatMessages.find(m => m.id === messageId);
    if (message) {
      message.status = 'delivered';
    }
    // Notify sender
    io.emit('messageDelivered', { messageId });
  });

  socket.on('messageRead', ({ messageId }) => {
    // Update message status
    const message = chatMessages.find(m => m.id === messageId);
    if (message) {
      message.status = 'read';
    }
    // Notify sender
    io.emit('messageRead', { messageId });
  });

  socket.on('typing', ({ isTyping }) => {
    // Broadcast typing status to all other users
    socket.broadcast.emit('typing', { isTyping, userId: socket.userData?.userId });
  });

  socket.on('disconnect', () => {
    const userData = connectedUsers.get(socket.id);
    connectedUsers.delete(socket.id);

    // Notify all users about connected users
    io.emit('userConnected', Array.from(connectedUsers.values()));

    console.log('User disconnected:', socket.id, userData?.name);
  });
});

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.CLIENT_URL, 'https://smarthire-frontend.onrender.com']
    : ['http://localhost:3002', 'http://localhost:3000', 'http://localhost:3001', 'http://192.168.68.114:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Handle preflight requests
app.options('*', cors());
app.use(express.json());

// Make io available to routes
app.set('io', io);

// Initialize database connection
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    await sequelize.sync({ alter: true });
    console.log('Database synchronized.');

    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, 'uploads', 'resumes');
    if (!require('fs').existsSync(uploadsDir)) {
      require('fs').mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Created uploads/resumes directory');
    } else {
      console.log('✅ Uploads directory exists');
    }

    // Seed initial learning data
    await seedLearningData();

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

initializeDatabase();

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role || 'student' },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Helper function to verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
  } catch (error) {
    return null;
  }
};

// Student registration endpoint
app.post('/api/auth/student/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { password, confirmPassword, ...studentData } = req.body;

    // Basic validation
    if (!password || !confirmPassword) {
      return res.status(400).json({ message: 'Password and confirm password are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (!studentData.name || !studentData.email || !studentData.rollNo) {
      return res.status(400).json({ message: 'Name, email, and roll number are required' });
    }

    // Validate email format
    if (!studentData.email.endsWith('@rajalakshmi.edu.in')) {
      return res.status(400).json({ message: 'Email must end with @rajalakshmi.edu.in' });
    }

    // Validate roll number format (9 digits)
    if (!/^\d{9}$/.test(studentData.rollNo.trim())) {
      return res.status(400).json({ message: 'Roll number must be exactly 9 digits' });
    }

    // Validate required fields
    if (!studentData.department) {
      return res.status(400).json({ message: 'Department is required' });
    }

    if (!studentData.dob) {
      return res.status(400).json({ message: 'Date of birth is required' });
    }

    if (!studentData.cgpa) {
      return res.status(400).json({ message: 'CGPA is required' });
    }

    if (!studentData.tenthPercentage) {
      return res.status(400).json({ message: '10th percentage is required' });
    }

    if (!studentData.twelfthPercentage) {
      return res.status(400).json({ message: '12th percentage is required' });
    }

    if (!studentData.age) {
      return res.status(400).json({ message: 'Age is required' });
    }

    if (!studentData.currentSemester) {
      return res.status(400).json({ message: 'Current semester is required' });
    }

    if (!studentData.batch) {
      return res.status(400).json({ message: 'Batch is required' });
    }

    // Check for existing student
    const existingStudent = await Student.findOne({
      where: {
        [sequelize.Sequelize.Op.or]: [
          { email: studentData.email.toLowerCase().trim() },
          { rollNo: studentData.rollNo.trim() }
        ]
      }
    });

    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this email or roll number already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Prepare student record with proper data types and defaults
    const studentRecord = {
      name: studentData.name.trim(),
      email: studentData.email.toLowerCase().trim(),
      rollNo: studentData.rollNo.trim(),
      password: hashedPassword,
      department: studentData.department,
      placedStatus: 'Not Placed',
      higherStudies: Boolean(studentData.higherStudies),
      internship: Boolean(studentData.internship),
      arrears: studentData.arrears ? parseInt(studentData.arrears) : 0,
      batch: studentData.batch,
      dob: studentData.dob,
      age: parseInt(studentData.age),
      currentSemester: parseInt(studentData.currentSemester),
      cgpa: parseFloat(studentData.cgpa),
      tenthPercentage: parseFloat(studentData.tenthPercentage),
      twelfthPercentage: parseFloat(studentData.twelfthPercentage),
      sem1Gpa: studentData.sem1Gpa ? parseFloat(studentData.sem1Gpa) : null,
      sem2Gpa: studentData.sem2Gpa ? parseFloat(studentData.sem2Gpa) : null,
      sem3Gpa: studentData.sem3Gpa ? parseFloat(studentData.sem3Gpa) : null,
      sem4Gpa: studentData.sem4Gpa ? parseFloat(studentData.sem4Gpa) : null,
      sem5Gpa: studentData.sem5Gpa ? parseFloat(studentData.sem5Gpa) : null,
      sem6Gpa: studentData.sem6Gpa ? parseFloat(studentData.sem6Gpa) : null,
      sem7Gpa: studentData.sem7Gpa ? parseFloat(studentData.sem7Gpa) : null
    };

    console.log('Creating student with data:', studentRecord);
    const newStudent = await Student.create(studentRecord);

    console.log('Student registered successfully:', newStudent.name);

    // Emit real-time update to admin dashboard
    emitDashboardUpdate();

    res.status(201).json({
      message: 'Student registered successfully',
      student: { id: newStudent.id, name: newStudent.name, email: newStudent.email }
    });
  } catch (error) {
    console.error('Registration error:', error);

    // Handle specific database errors
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      return res.status(400).json({ message: 'Validation failed: ' + validationErrors.join(', ') });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Email or roll number already exists' });
    }

    if (error.name === 'SequelizeConnectionError') {
      return res.status(500).json({ message: 'Database connection error. Please try again later.' });
    }

    if (error.name === 'SequelizeDatabaseError') {
      return res.status(500).json({ message: 'Database error: ' + error.message });
    }

    res.status(500).json({ message: 'Registration failed: ' + error.message });
  }
});

// Student login endpoint
app.post('/api/auth/student/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ where: { email } });

    if (!student || !await bcrypt.compare(password, student.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: student.id, role: 'student' });
    res.json({
      token,
      user: { id: student.id, name: student.name, email: student.email, role: 'student' }
    });
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get student profile
app.get('/api/students/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'student') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const student = await Student.findByPk(decoded.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const { password, ...studentData } = student.toJSON();
    if (studentData.higherStudies && studentData.placedStatus === 'Not Placed') {
      studentData.placedStatus = 'Higher Studies';
    }
    res.json(studentData);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update student profile
app.put('/api/students/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'student') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const student = await Student.findByPk(decoded.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Use raw SQL update to bypass enum constraints
    const updateData = { ...req.body };
    delete updateData.password;
    delete updateData.id;

    // Build SET clause for SQL update
    const updates = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        updates.push(`"${key}" = $${paramIndex}`);
        values.push(updateData[key]);
        paramIndex++;
      }
    });

    if (updates.length > 0) {
      const sql = `UPDATE "Students" SET ${updates.join(', ')} WHERE id = $${paramIndex}`;
      values.push(decoded.id);

      await sequelize.query(sql, {
        bind: values,
        type: sequelize.QueryTypes.UPDATE
      });
    }

    // Fetch updated student
    const updatedStudent = await Student.findByPk(decoded.id);
    const { password, ...studentData } = updatedStudent.toJSON();

    // Emit real-time update to admin dashboard
    emitDashboardUpdate();

    res.json({ message: 'Profile updated successfully', student: studentData });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Configure Multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes/');
  },
  filename: (req, file, cb) => {
    cb(null, `resume-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Enhance resume data with AI
app.post('/api/students/resume/enhance', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'student') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = decoded;
    await resumeController.enhanceResume(req, res);
  } catch (error) {
    console.error('Enhance route error:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
});

// Resume generation endpoint
app.post('/api/students/resume', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'student') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = decoded;
    // No file upload needed, just JSON body
    await resumeController.generateResume(req, res);
  } catch (error) {
    console.error('Resume route error:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
});

// Learning Routes
app.use('/api/learning', learningRoutes);

// Generate Word resume
app.post('/api/students/resume-word', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'student') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = decoded;
    await resumeController.generateWordResume(req, res);
  } catch (error) {
    console.error('Word resume route error:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
});

// Get student dashboard data
app.get('/api/students/dashboard', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'student') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const student = await Student.findByPk(decoded.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const companies = await Company.findAll();

    // Filter companies based on student eligibility and placement hierarchy
    const eligibleCompanies = companies.filter(company => {
      const studentCgpa = parseFloat(student.cgpa) || 0;
      const currentSem = parseInt(student.currentSemester) || 8;
      const lastSemGpaField = `sem${currentSem - 1}Gpa`;
      const studentLastSemGpa = parseFloat(student[lastSemGpaField]) || parseFloat(student.lastSemGpa) || 0;
      const studentArrears = parseInt(student.arrears) || 0;
      const studentTenth = parseFloat(student.tenthPercentage) || 0;
      const studentTwelfth = parseFloat(student.twelfthPercentage) || 0;

      // Check placement hierarchy - students can only apply to higher categories
      const studentPlacementStatus = student.placedStatus;
      const companyType = company.type || 'General';

      let canApply = true;
      if (studentPlacementStatus === 'Placed (General)') {
        canApply = companyType === 'Dream' || companyType === 'Super Dream';
      } else if (studentPlacementStatus === 'Placed (Dream)') {
        canApply = companyType === 'Super Dream';
      } else if (studentPlacementStatus === 'Placed (Super Dream)' || studentPlacementStatus === 'Higher Studies') {
        canApply = false;
      }

      if (!canApply) return false;

      const criteria = company.eligibilityCriteria || {};
      const cgpaEligible = !criteria.minCgpa || studentCgpa >= parseFloat(criteria.minCgpa);
      const lastSemEligible = !criteria.minLastSemGpa || studentLastSemGpa >= parseFloat(criteria.minLastSemGpa);
      const arrearsEligible = criteria.maxArrears === undefined || studentArrears <= parseInt(criteria.maxArrears);
      const tenthEligible = !criteria.minTenthPercentage || studentTenth >= parseFloat(criteria.minTenthPercentage);
      const twelfthEligible = !criteria.minTwelfthPercentage || studentTwelfth >= parseFloat(criteria.minTwelfthPercentage);
      const internshipEligible = !criteria.requireInternship || student.internship;

      return cgpaEligible && lastSemEligible && arrearsEligible &&
        tenthEligible && twelfthEligible && internshipEligible;
    });

    const { password, ...studentData } = student.toJSON();

    let displayStatus = studentData.placedStatus || 'Not Placed';
    if (studentData.higherStudies && displayStatus === 'Not Placed') {
      displayStatus = 'Higher Studies';
    }

    console.log('Student Dashboard Debug:');
    console.log('Student Name:', studentData.name);
    console.log('Placement Status:', displayStatus);
    console.log('Total Companies:', companies.length);
    console.log('Eligible Companies:', eligibleCompanies.length);
    console.log('Companies:', eligibleCompanies.map(c => ({ name: c.name, type: c.type })));

    res.json({
      student: {
        ...studentData,
        placedStatus: displayStatus
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
app.post('/api/auth/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ where: { username } });

    if (!admin || !await bcrypt.compare(password, admin.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: admin.id, role: 'admin' });
    res.json({
      token,
      user: { id: admin.id, name: admin.name, username: admin.username, role: 'admin' }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin dashboard endpoint
app.get('/api/admin/dashboard', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const totalStudents = await Student.count();
    const placedStudents = await Student.count({
      where: {
        placedStatus: {
          [sequelize.Sequelize.Op.in]: ['Placed - General', 'Placed - Dream', 'Placed - Super Dream']
        }
      }
    });
    const higherStudiesStudents = await Student.count({
      where: {
        placedStatus: 'Higher Studies'
      }
    });
    const activeCompanies = await Company.count();
    const studentsWithArrears = await Student.count({
      where: {
        arrears: { [sequelize.Sequelize.Op.gt]: 0 }
      }
    });

    // Calculate average CGPA
    const students = await Student.findAll({
      attributes: ['cgpa'],
      where: {
        cgpa: { [sequelize.Sequelize.Op.ne]: null }
      }
    });

    const validCgpas = students.map(s => parseFloat(s.cgpa)).filter(cgpa => !isNaN(cgpa));
    const averageCgpa = validCgpas.length > 0 ? (validCgpas.reduce((a, b) => a + b, 0) / validCgpas.length).toFixed(2) : '0.00';

    const placementPercentage = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;

    const dashboardData = {
      totalStudents,
      placedStudents,
      higherStudiesStudents,
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

// Student registration for company
app.post('/api/students/register/:companyId', async (req, res) => {
  try {
    console.log('Registration request:', { companyId: req.params.companyId, headers: req.headers.authorization });

    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'student') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { companyId } = req.params;
    const studentId = decoded.id;

    console.log('Processing registration for student:', studentId, 'company:', companyId);

    const company = await Company.findByPk(companyId);
    console.log('Found company:', company ? { id: company.id, name: company.name, deadline: company.registrationDeadline } : 'Not found');

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    if (company.registrationDeadline < new Date()) {
      return res.status(400).json({ message: 'Registration deadline has passed' });
    }

    let registration = await Registration.findOne({
      where: { studentId, companyId }
    });

    if (registration) {
      if (registration.status === 'Registered') {
        return res.status(400).json({ message: 'Already registered for this company' });
      }
      // Update existing record
      await registration.update({
        status: 'Registered',
        registeredAt: new Date()
      });
    } else {
      // Create new registration
      registration = await Registration.create({
        studentId,
        companyId,
        status: 'Registered',
        registeredAt: new Date()
      });
    }

    console.log('Registration successful:', { studentId, companyId, status: registration.status });
    res.json({ message: 'Registration successful', registration });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Get student inbox (eligible companies)
app.get('/api/students/inbox', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'student') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const student = await Student.findByPk(decoded.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const companies = await Company.findAll();

    // Filter companies based on student eligibility and placement hierarchy
    const eligibleCompaniesRaw = companies.filter(company => {
      const studentCgpa = parseFloat(student.cgpa) || 0;
      const currentSem = parseInt(student.currentSemester) || 8;
      const lastSemGpaField = `sem${currentSem - 1}Gpa`;
      const studentLastSemGpa = parseFloat(student[lastSemGpaField]) || parseFloat(student.lastSemGpa) || 0;
      const studentArrears = parseInt(student.arrears) || 0;
      const studentTenth = parseFloat(student.tenthPercentage) || 0;
      const studentTwelfth = parseFloat(student.twelfthPercentage) || 0;

      // Check placement hierarchy
      const studentPlacementStatus = student.placedStatus;
      const companyType = company.type || 'General';

      let canApply = true;
      if (studentPlacementStatus === 'Placed (General)') {
        canApply = companyType === 'Dream' || companyType === 'Super Dream';
      } else if (studentPlacementStatus === 'Placed (Dream)') {
        canApply = companyType === 'Super Dream';
      } else if (studentPlacementStatus === 'Placed (Super Dream)' || studentPlacementStatus === 'Higher Studies') {
        canApply = false;
      }

      if (!canApply) return false;

      const criteria = company.eligibilityCriteria || {};
      const cgpaEligible = !criteria.minCgpa || studentCgpa >= parseFloat(criteria.minCgpa);
      const lastSemEligible = !criteria.minLastSemGpa || studentLastSemGpa >= parseFloat(criteria.minLastSemGpa);
      const arrearsEligible = criteria.maxArrears === undefined || studentArrears <= parseInt(criteria.maxArrears);
      const tenthEligible = !criteria.minTenthPercentage || studentTenth >= parseFloat(criteria.minTenthPercentage);
      const twelfthEligible = !criteria.minTwelfthPercentage || studentTwelfth >= parseFloat(criteria.minTwelfthPercentage);
      const internshipEligible = !criteria.requireInternship || student.internship;

      return cgpaEligible && lastSemEligible && arrearsEligible &&
        tenthEligible && twelfthEligible && internshipEligible;
    });

    const eligibleCompanies = eligibleCompaniesRaw.map(company => ({
      ...company.toJSON(),
      registrationLink: `https://${company.name.toLowerCase().replace(/\s+/g, '')}.com/register`
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
app.get('/api/students/queries', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'student') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const queries = await Query.findAll({
      where: { studentId: decoded.id },
      order: [['createdAt', 'DESC']]
    });

    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get alumni data
app.get('/api/students/alumni', async (req, res) => {
  try {
    const alumni = await Alumni.findAll({
      order: [['batch', 'DESC']]
    });

    res.json(alumni);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin endpoint to get all students
app.get('/api/students', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const students = await Student.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    const studentsWithCorrectStatus = students.map(student => {
      const studentData = student.toJSON();
      if (studentData.higherStudies && studentData.placedStatus === 'Not Placed') {
        studentData.placedStatus = 'Higher Studies';
      }
      return studentData;
    });

    res.json(studentsWithCorrectStatus);
  } catch (error) {
    console.error('Students fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin endpoint to get all students (alternative route)
app.get('/api/admin/students', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { all } = req.query;

    const students = await Student.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    const studentsWithCorrectStatus = students.map(student => {
      const studentData = student.toJSON();
      if (studentData.higherStudies && studentData.placedStatus === 'Not Placed') {
        studentData.placedStatus = 'Higher Studies';
      }
      return studentData;
    });

    if (all === 'true') {
      return res.json(studentsWithCorrectStatus);
    }

    res.json({
      students: studentsWithCorrectStatus,
      total: studentsWithCorrectStatus.length,
      totalPages: 1,
      currentPage: 1
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin endpoint to update student
app.put('/api/admin/students/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.update(req.body);
    const { password, ...studentData } = student.toJSON();

    // Emit real-time update to admin dashboard
    emitDashboardUpdate();

    res.json({ message: 'Student updated successfully', student: studentData });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin endpoint to update student (alternative route)
app.put('/api/students/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.update(req.body);
    const { password, ...studentData } = student.toJSON();
    res.json({ message: 'Student updated successfully', student: studentData });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin endpoint to delete student
app.delete('/api/admin/students/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.destroy();

    // Emit real-time update to admin dashboard
    emitDashboardUpdate();

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin endpoint to delete student (alternative route)
app.delete('/api/students/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.destroy();
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin endpoint to auto-match candidates based on skills
app.post('/api/admin/match-candidates', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await resumeController.findMatches(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin endpoint to add new student
app.post('/api/admin/students', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password || '123456', 12);
    const newStudent = await Student.create({
      ...req.body,
      password: hashedPassword,
      department: req.body.department || 'CSE'
    });

    const { password, ...studentData } = newStudent.toJSON();

    // Emit real-time update to admin dashboard
    emitDashboardUpdate();

    res.status(201).json({ message: 'Student added successfully', student: studentData });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin endpoint to add new student (alternative route)
app.post('/api/students', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password || '123456', 12);
    const newStudent = await Student.create({
      ...req.body,
      password: hashedPassword,
      department: req.body.department || 'CSE'
    });

    const { password, ...studentData } = newStudent.toJSON();
    res.status(201).json({ message: 'Student added successfully', student: studentData });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Test endpoint to see all students
app.get('/api/test/students', async (req, res) => {
  try {
    const students = await Student.findAll({
      attributes: ['id', 'name', 'email']
    });
    res.json({ count: students.length, students });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Company management endpoints
app.get('/api/companies', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const companies = await Company.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json(companies);
  } catch (error) {
    console.error('Companies fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/companies', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log('Received company data:', req.body);

    // Transform form data to match Company model structure
    const eligibilityCriteria = {
      minCgpa: parseFloat(req.body.minCgpa) || 0,
      minLastSemGpa: parseFloat(req.body.minLastSemGpa) || 0,
      maxArrears: parseInt(req.body.maxArrears) || 0,
      minTenthPercentage: parseFloat(req.body.tenthMin) || 0,
      minTwelfthPercentage: parseFloat(req.body.twelfthMin) || 0,
      requireInternship: Boolean(req.body.requireInternship)
    };

    console.log('Processed eligibility criteria:', eligibilityCriteria);

    const companyData = {
      name: req.body.name,
      jobRole: req.body.jobRole,
      package: req.body.package,
      visitDate: req.body.visitDate,
      registrationDeadline: req.body.registrationDeadline,
      registrationLink: req.body.registrationLink,
      type: req.body.type,
      eligibilityCriteria
    };

    const newCompany = await Company.create(companyData);

    console.log('Company added:', newCompany.name);
    res.status(201).json({ message: 'Company added successfully', company: newCompany });
  } catch (error) {
    console.error('Company creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/companies/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    console.log('Received update data:', req.body);

    // Transform form data to match Company model structure
    const eligibilityCriteria = {
      minCgpa: parseFloat(req.body.minCgpa) || 0,
      minLastSemGpa: parseFloat(req.body.minLastSemGpa) || 0,
      maxArrears: parseInt(req.body.maxArrears) || 0,
      minTenthPercentage: parseFloat(req.body.tenthMin) || 0,
      minTwelfthPercentage: parseFloat(req.body.twelfthMin) || 0,
      requireInternship: Boolean(req.body.requireInternship)
    };

    console.log('Processed eligibility criteria:', eligibilityCriteria);

    const updateData = {
      name: req.body.name,
      jobRole: req.body.jobRole,
      package: req.body.package,
      visitDate: req.body.visitDate,
      registrationDeadline: req.body.registrationDeadline,
      registrationLink: req.body.registrationLink,
      type: req.body.type,
      eligibilityCriteria
    };

    await company.update(updateData);

    res.json({ message: 'Company updated successfully', company });
  } catch (error) {
    console.error('Company update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/companies/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    await company.destroy();
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get company registrations for admin
app.get('/api/students/company/:companyId/registrations', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { companyId } = req.params;
    const registrations = await Registration.findAll({
      where: { companyId },
      include: [{
        model: Student,
        attributes: ['id', 'name', 'rollNo', 'email']
      }],
      order: [['registeredAt', 'DESC']]
    });

    res.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin endpoint to check company eligibility
app.get('/api/admin/companies/:id/eligibility', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const students = await Student.findAll();
    const { getEligibleStudentsForCompany, checkStudentEligibility } = require('./utils/eligibilityChecker');

    const eligibleStudents = getEligibleStudentsForCompany(company, students);
    const detailedResults = students.map(student => ({
      student: {
        id: student.id,
        name: student.name,
        rollNo: student.rollNo,
        cgpa: student.cgpa,
        tenthPercentage: student.tenthPercentage,
        twelfthPercentage: student.twelfthPercentage,
        arrears: student.arrears,
        internship: student.internship,
        placedStatus: student.placedStatus
      },
      eligibilityResult: checkStudentEligibility(student, company)
    }));

    res.json({
      company: {
        id: company.id,
        name: company.name,
        jobRole: company.jobRole,
        eligibilityCriteria: company.eligibilityCriteria
      },
      totalStudents: students.length,
      eligibleStudents: eligibleStudents.length,
      eligibilityRate: ((eligibleStudents.length / students.length) * 100).toFixed(2),
      detailedResults
    });
  } catch (error) {
    console.error('Eligibility check error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Import route files
const studentRoutes = require('./routes/students');
const adminRoutes = require('./routes/admin');
const companyRoutes = require('./routes/companies');
const calendarRoutes = require('./routes/calendar');

// Use route files
app.use('/api/students', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/calendar', calendarRoutes);

app.get('/', (req, res) => res.json({ message: 'SmartHire Backend - PostgreSQL Integrated' }));

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://0.0.0.0:${PORT}`));

// Helper function to emit dashboard updates
const emitDashboardUpdate = async () => {
  try {
    const totalStudents = await Student.count();
    const placedStudents = await Student.count({
      where: {
        placedStatus: {
          [sequelize.Sequelize.Op.in]: ['Placed - General', 'Placed - Dream', 'Placed - Super Dream']
        }
      }
    });
    const higherStudiesStudents = await Student.count({
      where: {
        placedStatus: 'Higher Studies'
      }
    });
    const activeCompanies = await Company.count();
    const placementPercentage = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;

    io.to('admin').emit('dashboardUpdate', {
      totalStudents,
      placedStudents,
      higherStudiesStudents,
      activeCompanies,
      placementPercentage
    });
  } catch (error) {
    console.error('Error emitting dashboard update:', error);
  }
};