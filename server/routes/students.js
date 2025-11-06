const express = require('express');
const { Student, Company, Registration, Query, Alumni, Message } = require('../models');
const { authenticateToken, authorizeStudent } = require('../middlewares/auth');
const { getEligibilityReport, checkCompanyEligibility, getPlacementStats } = require('../controllers/eligibilityController');
const { getStudentEligibilitySummary } = require('../utils/studentDataService');
const { Op } = require('sequelize');
const router = express.Router();

// Get student dashboard data
router.get('/dashboard', authenticateToken, authorizeStudent, async (req, res) => {
  try {
    console.log('Dashboard request - User ID:', req.user.id);
    
    const student = await Student.findOne({
      where: {
        [Op.or]: [
          { id: req.user.id },
          { email: req.user.email }
        ]
      }
    });
    
    console.log('Found student:', student ? { id: student.id, name: student.name, rollNo: student.rollNo } : 'Not found');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const eligibleCompanies = await Company.findAll({
      where: {
        status: 'Active',
        registrationDeadline: { [Op.gt]: new Date() }
      }
    });

    // Filter companies based on eligibility
    const eligible = eligibleCompanies.filter(company => {
      const criteria = company.eligibilityCriteria;
      return (
        (student.cgpa || 0) >= (criteria.minCgpa || 0) &&
        (student.lastSemGpa || 0) >= (criteria.minLastSemGpa || 0) &&
        (student.arrears || 0) <= (criteria.maxArrears || 0) &&
        (student.tenthPercentage || 0) >= (criteria.minTenthPercentage || 0) &&
        (student.twelfthPercentage || 0) >= (criteria.minTwelfthPercentage || 0) &&
        (student.age || 0) >= (criteria.minAge || 0) &&
        (student.age || 100) <= (criteria.maxAge || 100) &&
        (criteria.allowHigherStudies || !student.higherStudies) &&
        (!criteria.requireInternship || student.internship)
      );
    });

    const responseData = {
      student: {
        id: student.id,
        name: student.name || 'N/A',
        rollNo: student.rollNo || 'N/A',
        email: student.email,
        cgpa: student.cgpa,
        placedStatus: student.placedStatus || 'Not Placed',
        batch: student.batch
      },
      eligibleCompanies: eligible,
      totalEligible: eligible.length
    };
    
    console.log('Sending response:', responseData.student);
    res.json(responseData);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get student inbox
router.get('/inbox', authenticateToken, authorizeStudent, async (req, res) => {
  try {
    const student = await Student.findByPk(req.user.id);
    const companies = await Company.findAll({
      where: {
        status: 'Active',
        registrationDeadline: { [Op.gt]: new Date() }
      }
    });

    const eligibleCompanies = companies.filter(company => {
      const criteria = company.eligibilityCriteria;
      return (
        (student.cgpa || 0) >= (criteria.minCgpa || 0) &&
        (student.lastSemGpa || 0) >= (criteria.minLastSemGpa || 0) &&
        (student.arrears || 0) <= (criteria.maxArrears || 0) &&
        (student.tenthPercentage || 0) >= (criteria.minTenthPercentage || 0) &&
        (student.twelfthPercentage || 0) >= (criteria.minTwelfthPercentage || 0) &&
        (student.age || 0) >= (criteria.minAge || 0) &&
        (student.age || 100) <= (criteria.maxAge || 100) &&
        (criteria.allowHigherStudies || !student.higherStudies) &&
        (!criteria.requireInternship || student.internship)
      );
    });

    const registrations = await Registration.findAll({
      where: { studentId: req.user.id },
      include: [Company]
    });

    res.json({
      eligibleCompanies,
      registrations
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Register for company
router.post('/register/:companyId', authenticateToken, authorizeStudent, async (req, res) => {
  try {
    const { companyId } = req.params;
    const studentId = req.user.id;

    const company = await Company.findByPk(companyId);
    if (!company || company.registrationDeadline < new Date()) {
      return res.status(400).json({ message: 'Registration deadline passed or company not found' });
    }

    const existingRegistration = await Registration.findOne({
      where: { studentId, companyId }
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this company' });
    }

    const registration = await Registration.create({
      studentId,
      companyId,
      status: 'Registered',
      registeredAt: new Date()
    });

    res.json({ message: 'Registration successful', registration });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get student queries
router.get('/queries', authenticateToken, authorizeStudent, async (req, res) => {
  try {
    const queries = await Query.findAll({
      where: { studentId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new query
router.post('/queries', authenticateToken, authorizeStudent, async (req, res) => {
  try {
    const { subject, message } = req.body;
    const query = await Query.create({
      studentId: req.user.id,
      subject,
      message
    });
    res.status(201).json(query);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get alumni
router.get('/alumni', authenticateToken, authorizeStudent, async (req, res) => {
  try {
    const alumni = await Alumni.findAll({
      order: [['batch', 'DESC']]
    });
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get chat messages
router.get('/messages', authenticateToken, authorizeStudent, async (req, res) => {
  try {
    const messages = await Message.findAll({
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get student profile
router.get('/profile', authenticateToken, authorizeStudent, async (req, res) => {
  try {
    console.log('Profile request - User ID:', req.user.id);
    
    const student = await Student.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'resetToken', 'resetTokenExpiry'] }
    });
    
    console.log('Found student:', student ? student.dataValues : 'Not found');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update student profile
router.put('/profile', authenticateToken, authorizeStudent, async (req, res) => {
  try {
    console.log('Profile update - User ID:', req.user.id, 'Data:', req.body);
    
    const student = await Student.findByPk(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    await Student.update(req.body, { where: { id: req.user.id } });
    
    const updatedStudent = await Student.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'resetToken', 'resetTokenExpiry'] }
    });
    
    res.json({ message: 'Profile updated successfully', student: updatedStudent });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get detailed eligibility report
router.get('/eligibility/report', authenticateToken, authorizeStudent, getEligibilityReport);

// Check eligibility for specific company
router.get('/eligibility/company/:companyId', authenticateToken, authorizeStudent, checkCompanyEligibility);

// Get placement statistics
router.get('/placement/stats', authenticateToken, authorizeStudent, getPlacementStats);

// Get student eligibility summary
router.get('/eligibility/summary', authenticateToken, authorizeStudent, async (req, res) => {
  try {
    const summary = await getStudentEligibilitySummary(req.user.id);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;