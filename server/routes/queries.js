const express = require('express');
const { Query, Student } = require('../models');
const { authenticateToken } = require('../middlewares/auth');
const router = express.Router();

// Get all queries (admin) or user queries (student)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let queries;
    
    if (req.user.role === 'admin') {
      queries = await Query.findAll({
        include: [{ model: Student, attributes: ['name', 'rollNo', 'email'] }],
        order: [['createdAt', 'DESC']]
      });
    } else {
      queries = await Query.findAll({
        where: { studentId: req.user.id },
        order: [['createdAt', 'DESC']]
      });
    }
    
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new query (student only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can create queries' });
    }

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

// Reply to query (admin only)
router.put('/:id/reply', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can reply to queries' });
    }

    const { id } = req.params;
    const { reply } = req.body;

    const query = await Query.findByPk(id);
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }

    await query.update({
      reply,
      status: 'Replied',
      repliedAt: new Date()
    });

    res.json({ message: 'Reply sent successfully', query });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Close query
router.put('/:id/close', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = await Query.findByPk(id);
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }

    // Check if user owns the query or is admin
    if (req.user.role !== 'admin' && query.studentId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await query.update({ status: 'Closed' });
    res.json({ message: 'Query closed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;