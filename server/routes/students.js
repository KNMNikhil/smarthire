const express = require('express');
const { Student, Company, Registration, Query, Alumni, Message, CalendarEvent } = require('../models');
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

    // Get companies based on student placement status
    let companyTypeFilter = [];
    
    if (student.placedStatus === 'Not Placed') {
      // Show all company types for not placed students
      companyTypeFilter = ['General', 'Dream', 'Super Dream'];
    } else if (student.placedStatus === 'Placed - General') {
      // Show Dream and Super Dream companies
      companyTypeFilter = ['Dream', 'Super Dream'];
    } else if (student.placedStatus === 'Placed - Dream') {
      // Show General and Super Dream companies
      companyTypeFilter = ['General', 'Super Dream'];
    } else if (student.placedStatus === 'Placed - Super Dream') {
      // Show General and Dream companies
      companyTypeFilter = ['General', 'Dream'];
    } else {
      // For Higher Studies or other statuses, show no companies
      companyTypeFilter = [];
    }

    const eligibleCompanies = await Company.findAll({
      where: {
        status: 'Active',
        registrationDeadline: { [Op.gt]: new Date() },
        type: { [Op.in]: companyTypeFilter }
      }
    });

    // Filter companies based on eligibility criteria
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

    // Get placed companies if student is placed
    let placedCompanies = [];
    if (['Placed - General', 'Placed - Dream', 'Placed - Super Dream'].includes(student.placedStatus)) {
      const selectedRegistrations = await Registration.findAll({
        where: {
          studentId: student.id,
          status: 'Selected'
        },
        include: [{
          model: Company,
          attributes: ['id', 'name', 'type', 'package']
        }]
      });
      placedCompanies = selectedRegistrations.map(reg => reg.Company);
    }

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
      placedCompanies: placedCompanies,
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
    
    // Get companies based on student placement status
    let companyTypeFilter = [];
    
    if (student.placedStatus === 'Not Placed') {
      companyTypeFilter = ['General', 'Dream', 'Super Dream'];
    } else if (student.placedStatus === 'Placed - General') {
      companyTypeFilter = ['Dream', 'Super Dream'];
    } else if (student.placedStatus === 'Placed - Dream') {
      companyTypeFilter = ['General', 'Super Dream'];
    } else if (student.placedStatus === 'Placed - Super Dream') {
      companyTypeFilter = ['General', 'Dream'];
    } else {
      companyTypeFilter = [];
    }

    const companies = await Company.findAll({
      where: {
        status: 'Active',
        registrationDeadline: { [Op.gt]: new Date() },
        type: { [Op.in]: companyTypeFilter }
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
      where: { 
        studentId: req.user.id,
        status: ['Registered', 'Selected', 'Rejected']
      },
      include: [{
        model: Company,
        attributes: ['id', 'name', 'jobRole', 'package', 'visitDate', 'location', 'type']
      }]
    });

    console.log(`Student ${req.user.id} registrations:`, registrations.map(r => ({
      id: r.id,
      companyId: r.companyId,
      status: r.status,
      companyName: r.Company?.name
    })));

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
    console.log('Registration request:', { companyId: req.params.companyId, userId: req.user?.id });
    
    const { companyId } = req.params;
    const studentId = req.user.id;

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

    // Emit real-time update to admin (if socket.io is available)
    try {
      const io = req.app.get('io');
      if (io) {
        io.emit('newRegistration', {
          studentId,
          companyId,
          companyName: company.name,
          registration
        });
      }
    } catch (socketError) {
      console.log('Socket.io not available:', socketError.message);
    }

    console.log('Registration successful:', { studentId, companyId, status: registration.status });
    res.json({ message: 'Registration successful', registration });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
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
    
    // If placement status is being changed to "Not Placed", clear any "Selected" registrations
    if (req.body.placedStatus === 'Not Placed' && student.placedStatus !== 'Not Placed') {
      await Registration.update(
        { status: 'Registered' },
        { 
          where: { 
            studentId: req.user.id,
            status: 'Selected'
          }
        }
      );
      console.log('Cleared Selected registrations for student:', req.user.id);
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

// Get registered companies for calendar
router.get('/registered-companies', authenticateToken, authorizeStudent, async (req, res) => {
  try {
    const registrations = await Registration.findAll({
      where: { 
        studentId: req.user.id,
        status: 'Registered'
      },
      include: [{
        model: Company,
        attributes: ['id', 'name', 'jobRole', 'package', 'visitDate', 'location', 'type']
      }],
      order: [['registeredAt', 'DESC']]
    });
    
    const registeredCompanies = registrations.map(reg => reg.Company).filter(company => company);
    res.json(registeredCompanies);
  } catch (error) {
    console.error('Error fetching registered companies:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Calendar Events CRUD
router.get('/calendar/events', authenticateToken, authorizeStudent, async (req, res) => {
  try {
    const events = await CalendarEvent.findAll({
      where: { studentId: req.user.id },
      order: [['startTime', 'ASC']]
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/calendar/events', authenticateToken, authorizeStudent, async (req, res) => {
  try {
    console.log('Creating calendar event for student:', req.user.id);
    console.log('Event data:', req.body);
    
    // Validate required fields
    const { title, startTime, endTime } = req.body;
    if (!title || !startTime || !endTime) {
      return res.status(400).json({ message: 'Title, start time, and end time are required' });
    }
    
    // Verify student exists
    const student = await Student.findByPk(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const eventData = {
      studentId: req.user.id,
      title: title.trim(),
      description: req.body.description || '',
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      color: req.body.color || 'blue',
      category: req.body.category || 'Personal',
      tags: req.body.tags || []
    };
    
    const event = await CalendarEvent.create(eventData);
    console.log('Calendar event created:', event.id);
    res.status(201).json(event);
  } catch (error) {
    console.error('Calendar event creation error:', error);
    res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
});

router.put('/calendar/events/:id', authenticateToken, authorizeStudent, async (req, res) => {
  try {
    const event = await CalendarEvent.findOne({
      where: { id: req.params.id, studentId: req.user.id }
    });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    await event.update(req.body);
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/calendar/events/:id', authenticateToken, authorizeStudent, async (req, res) => {
  try {
    const event = await CalendarEvent.findOne({
      where: { id: req.params.id, studentId: req.user.id }
    });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    await event.destroy();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get company registrations (for admin)
router.get('/company/:companyId/registrations', async (req, res) => {
  try {
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;