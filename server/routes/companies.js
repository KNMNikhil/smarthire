const express = require('express');
const { Company, Student, Registration, History } = require('../models');
const { authenticateToken, authorizeAdmin } = require('../middlewares/auth');
const { Op } = require('sequelize');
const { sendEmail } = require('../utils/emailService');
const router = express.Router();

// Get all companies
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status = 'all' } = req.query;
    const whereClause = status !== 'all' ? { status } : {};
    
    const companies = await Company.findAll({
      where: whereClause,
      order: [['visitDate', 'ASC']]
    });
    
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add new company
router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { minCgpa, minLastSemGpa, maxArrears, tenthMin, twelfthMin, minAge, maxAge, allowHigherStudies, requireInternship, ...otherData } = req.body;
    
    const companyData = {
      ...otherData,
      eligibilityCriteria: {
        minCgpa: parseFloat(minCgpa) || 0,
        minLastSemGpa: parseFloat(minLastSemGpa) || 0,
        maxArrears: parseInt(maxArrears) || 0,
        minTenthPercentage: parseFloat(tenthMin) || 0,
        minTwelfthPercentage: parseFloat(twelfthMin) || 0,
        minAge: parseInt(minAge) || 0,
        maxAge: parseInt(maxAge) || 100,
        allowHigherStudies: allowHigherStudies !== false,
        requireInternship: requireInternship === true
      }
    };
    
    const company = await Company.create(companyData);

    // Find eligible students using comprehensive criteria
    const allStudents = await Student.findAll();
    const eligibleStudents = allStudents.filter(student => {
      const criteria = companyData.eligibilityCriteria;
      return (
        (student.cgpa || 0) >= criteria.minCgpa &&
        (student.lastSemGpa || 0) >= criteria.minLastSemGpa &&
        (student.arrears || 0) <= criteria.maxArrears &&
        (student.tenthPercentage || 0) >= criteria.minTenthPercentage &&
        (student.twelfthPercentage || 0) >= criteria.minTwelfthPercentage &&
        (student.age || 0) >= criteria.minAge &&
        (student.age || 100) <= criteria.maxAge &&
        (criteria.allowHigherStudies || !student.higherStudies) &&
        (!criteria.requireInternship || student.internship)
      );
    });

    // Create registration entries for eligible students
    const registrations = eligibleStudents.map(student => ({
      studentId: student.id,
      companyId: company.id,
      status: 'Not Registered'
    }));

    await Registration.bulkCreate(registrations);

    // Send notification emails to eligible students
    const emailPromises = eligibleStudents.map(student => 
      sendEmail({
        to: student.email,
        subject: `New Company Drive - ${company.name}`,
        html: `
          <h2>New Placement Opportunity!</h2>
          <p>Dear ${student.name},</p>
          <p>A new company <strong>${company.name}</strong> is visiting for placement.</p>
          <p><strong>Job Role:</strong> ${company.jobRole}</p>
          <p><strong>Package:</strong> ${company.package}</p>
          <p><strong>Visit Date:</strong> ${new Date(company.visitDate).toLocaleDateString()}</p>
          <p><strong>Registration Deadline:</strong> ${new Date(company.registrationDeadline).toLocaleDateString()}</p>
          <p>Login to SmartHire portal to register for this opportunity.</p>
        `
      })
    );

    await Promise.all(emailPromises);

    res.status(201).json({
      message: 'Company added successfully',
      company,
      eligibleStudentsCount: eligibleStudents.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get company with registrations
router.get('/:id/registrations', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { filter = 'all' } = req.query;

    let whereClause = { companyId: id };
    if (filter === 'registered') {
      whereClause.status = 'Registered';
    } else if (filter === 'not-registered') {
      whereClause.status = 'Not Registered';
    }

    const registrations = await Registration.findAll({
      where: whereClause,
      include: [
        {
          model: Student,
          attributes: ['id', 'name', 'rollNo', 'email', 'cgpa', 'arrears']
        },
        {
          model: Company,
          attributes: ['name', 'jobRole', 'visitDate']
        }
      ],
      order: [['registeredAt', 'DESC']]
    });

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update company
router.put('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    await Company.update(updateData, { where: { id } });
    const updatedCompany = await Company.findByPk(id);

    res.json({ message: 'Company updated successfully', company: updatedCompany });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Complete company drive (move to history)
router.post('/:id/complete', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { selectedStudents = [] } = req.body;

    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Get all registrations for this company
    const registrations = await Registration.findAll({
      where: { companyId: id },
      include: [Student]
    });

    const eligibleStudents = registrations.map(reg => ({
      id: reg.Student.id,
      name: reg.Student.name,
      rollNo: reg.Student.rollNo
    }));

    const registeredStudents = registrations
      .filter(reg => reg.status === 'Registered')
      .map(reg => ({
        id: reg.Student.id,
        name: reg.Student.name,
        rollNo: reg.Student.rollNo
      }));

    // Create history record
    await History.create({
      companyId: id,
      eligibleStudents,
      registeredStudents,
      selectedStudents,
      completedAt: new Date()
    });

    // Update company status
    await Company.update({ status: 'Completed' }, { where: { id } });

    // Update selected students' placement status
    if (selectedStudents.length > 0) {
      await Student.update(
        { placedStatus: company.type },
        { where: { id: { [Op.in]: selectedStudents.map(s => s.id) } } }
      );
    }

    res.json({ message: 'Company drive completed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get company history
router.get('/history', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const history = await History.findAll({
      include: [Company],
      order: [['completedAt', 'DESC']]
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;