const express = require('express');
const { BusRoute, Company, Student, Registration } = require('../models');
const { authenticateToken } = require('../middlewares/auth');
const router = express.Router();

// Admin: Get all bus routes
router.get('/admin/routes', authenticateToken, async (req, res) => {
  try {
    const routes = await BusRoute.findAll({
      include: [{
        model: Company,
        attributes: ['name']
      }],
      order: [['date', 'ASC']]
    });
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin: Create bus route
router.post('/admin/routes', authenticateToken, async (req, res) => {
  try {
    const route = await BusRoute.create(req.body);
    res.status(201).json(route);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin: Update bus route
router.put('/admin/routes/:id', authenticateToken, async (req, res) => {
  try {
    const route = await BusRoute.findByPk(req.params.id);
    if (!route) {
      return res.status(404).json({ message: 'Bus route not found' });
    }
    
    await route.update(req.body);
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin: Delete bus route
router.delete('/admin/routes/:id', authenticateToken, async (req, res) => {
  try {
    const route = await BusRoute.findByPk(req.params.id);
    if (!route) {
      return res.status(404).json({ message: 'Bus route not found' });
    }
    
    await route.destroy();
    res.json({ message: 'Bus route deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Student: Get eligible bus routes
router.get('/student/eligible', authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.id;
    
    // Get companies student is registered for
    const registrations = await Registration.findAll({
      where: { studentId },
      include: [{
        model: Company,
        attributes: ['id', 'name']
      }]
    });
    
    const companyIds = registrations.map(reg => reg.Company.id);
    
    // Get bus routes for those companies
    const routes = await BusRoute.findAll({
      where: {
        companyId: companyIds,
        date: {
          [require('sequelize').Op.gte]: new Date()
        }
      },
      include: [{
        model: Company,
        attributes: ['name']
      }],
      order: [['date', 'ASC']]
    });
    
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;