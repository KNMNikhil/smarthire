const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Student, Admin } = require('../models');
const { sendEmail } = require('../utils/emailService');
const { validateStudentData } = require('../utils/studentDataService');
const router = express.Router();

// Student Registration
router.post('/student/register', async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    const { password, confirmPassword, ...studentData } = req.body;
    
    // Password validation
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Validate student data
    const validationErrors = validateStudentData(studentData);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }

    // Check for existing student
    const existingStudent = await Student.findOne({ 
      where: { 
        [require('sequelize').Op.or]: [
          { email: studentData.email },
          { rollNo: studentData.rollNo }
        ]
      }
    });
    
    if (existingStudent) {
      return res.status(400).json({ 
        message: 'Student with this email or roll number already exists' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Clean and process data
    const cleanData = {
      name: studentData.name.trim(),
      email: studentData.email.toLowerCase().trim(),
      rollNo: studentData.rollNo.trim(),
      dob: studentData.dob || null,
      age: studentData.age ? parseInt(studentData.age) : null,
      tenthPercentage: studentData.tenthPercentage ? parseFloat(studentData.tenthPercentage) : null,
      twelfthPercentage: studentData.twelfthPercentage ? parseFloat(studentData.twelfthPercentage) : null,
      cgpa: studentData.cgpa ? parseFloat(studentData.cgpa) : null,
      lastSemGpa: studentData.lastSemGpa ? parseFloat(studentData.lastSemGpa) : null,
      arrears: studentData.arrears ? parseInt(studentData.arrears) : 0,
      higherStudies: Boolean(studentData.higherStudies),
      internship: Boolean(studentData.internship),
      batch: studentData.batch || '2025-2026',
      placedStatus: 'Not Placed',
      password: hashedPassword
    };
    
    console.log('Clean data for creation:', cleanData);
    
    const student = await Student.create(cleanData);
    console.log('Student created successfully:', student.id);

    // Send welcome email
    try {
      await sendEmail({
        to: student.email,
        subject: 'Welcome to SmartHire - Registration Successful',
        html: `
          <h2>Welcome to SmartHire, ${student.name}!</h2>
          <p>Your registration has been completed successfully.</p>
          <p><strong>Roll Number:</strong> ${student.rollNo}</p>
          <p>You can now log in to access placement opportunities and track your progress.</p>
          <p>Best of luck with your placements!</p>
        `
      });
    } catch (emailError) {
      console.log('Welcome email failed:', emailError.message);
    }

    res.status(201).json({ 
      message: 'Student registered successfully',
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        rollNo: student.rollNo
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Student Login
router.post('/student/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const student = await Student.findOne({ where: { email } });
    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, student.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: student.id, role: 'student', email: student.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      token,
      user: {
        id: student.id,
        name: student.name,
        email: student.email,
        role: 'student'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, role: 'admin', username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      token,
      user: {
        id: admin.id,
        name: admin.name,
        username: admin.username,
        role: 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, userType } = req.body;
    
    const Model = userType === 'student' ? Student : Admin;
    const user = await Model.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await user.update({
      resetToken,
      resetTokenExpiry
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&type=${userType}`;
    
    await sendEmail({
      to: email,
      subject: 'SmartHire - Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `
    });

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password, userType } = req.body;
    
    const Model = userType === 'student' ? Student : Admin;
    const user = await Model.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: { [require('sequelize').Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    await user.update({
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;