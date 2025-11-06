const express = require('express');
const bcrypt = require('bcryptjs');
const { Student, Company, Registration, Query, History, Message } = require('../models');
const { authenticateToken, authorizeAdmin } = require('../middlewares/auth');
const { Op } = require('sequelize');
const router = express.Router();

// Get admin dashboard stats
router.get('/dashboard', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const totalStudents = await Student.count();
    const placedStudents = await Student.count({
      where: { 
        placedStatus: { 
          [Op.in]: ['Placed - General', 'Placed - Dream', 'Placed - Super Dream'] 
        } 
      }
    });
    const activeCompanies = await Company.count({
      where: { status: 'Active' }
    });
    const pendingQueries = await Query.count({
      where: { status: 'Pending' }
    });
    const studentsWithArrears = await Student.count({
      where: { arrears: { [Op.gt]: 0 } }
    });
    
    // Calculate average CGPA
    const avgCgpaResult = await Student.findOne({
      attributes: [
        [require('sequelize').fn('AVG', require('sequelize').col('cgpa')), 'avgCgpa']
      ],
      where: { cgpa: { [Op.ne]: null } }
    });
    
    const averageCgpa = avgCgpaResult?.dataValues?.avgCgpa ? 
      parseFloat(avgCgpaResult.dataValues.avgCgpa).toFixed(2) : '0.00';

    res.json({
      totalStudents,
      placedStudents,
      activeCompanies,
      pendingQueries,
      studentsWithArrears,
      averageCgpa,
      placementPercentage: totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(2) : 0
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all students
router.get('/students', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { page, limit, search = '', all } = req.query;
    
    // If 'all' parameter is provided, return all students without pagination
    if (all === 'true') {
      const students = await Student.findAll({
        attributes: { exclude: ['password', 'resetToken', 'resetTokenExpiry'] },
        order: [['name', 'ASC']]
      });
      return res.json(students);
    }
    
    // Otherwise, return paginated results
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    const whereClause = search ? {
      [Op.or]: [
        { name: { [Op.iLike]: `%${search}%` } },
        { rollNo: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ]
    } : {};

    const students = await Student.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password', 'resetToken', 'resetTokenExpiry'] },
      limit: limitNum,
      offset: offset,
      order: [['name', 'ASC']]
    });

    res.json({
      students: students.rows,
      total: students.count,
      totalPages: Math.ceil(students.count / limitNum),
      currentPage: pageNum
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add new student
router.post('/students', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { password, ...studentData } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const student = await Student.create({
      ...studentData,
      password: hashedPassword
    });

    res.status(201).json({
      message: 'Student added successfully',
      student: { ...student.toJSON(), password: undefined }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update student
router.put('/students/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    await Student.update(updateData, { where: { id } });
    const updatedStudent = await Student.findByPk(id, {
      attributes: { exclude: ['password', 'resetToken', 'resetTokenExpiry'] }
    });

    res.json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete student
router.delete('/students/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await Student.destroy({ where: { id } });
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all queries
router.get('/queries', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const queries = await Query.findAll({
      include: [{ model: Student, attributes: ['name', 'rollNo', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reply to query
router.put('/queries/:id/reply', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    await Query.update({
      reply,
      status: 'Replied',
      repliedAt: new Date()
    }, { where: { id } });

    res.json({ message: 'Reply sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get statistics for charts
router.get('/statistics', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    // Placement statistics
    const placementStats = await Student.findAll({
      attributes: [
        'placedStatus',
        [require('sequelize').fn('COUNT', require('sequelize').col('placedStatus')), 'count']
      ],
      group: ['placedStatus']
    });

    // Monthly registrations
    const monthlyRegistrations = await Registration.findAll({
      attributes: [
        [require('sequelize').fn('DATE_TRUNC', 'month', require('sequelize').col('registeredAt')), 'month'],
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: {
        registeredAt: { [Op.ne]: null }
      },
      group: [require('sequelize').fn('DATE_TRUNC', 'month', require('sequelize').col('registeredAt'))],
      order: [[require('sequelize').fn('DATE_TRUNC', 'month', require('sequelize').col('registeredAt')), 'ASC']]
    });

    // Company type distribution
    const companyStats = await Company.findAll({
      attributes: [
        'type',
        [require('sequelize').fn('COUNT', require('sequelize').col('type')), 'count']
      ],
      group: ['type']
    });

    res.json({
      placementStats,
      monthlyRegistrations,
      companyStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send broadcast message
router.post('/broadcast', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { message, type = 'broadcast' } = req.body;
    
    const newMessage = await Message.create({
      sender: req.user.username,
      senderType: 'admin',
      message,
      type
    });

    // Emit to all connected clients via Socket.io
    req.app.get('io').emit('newMessage', newMessage);

    res.json({ message: 'Broadcast sent successfully', data: newMessage });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;