const jwt = require('jsonwebtoken');
const { Student, Admin } = require('../models');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const authorizeAdmin = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const authorizeStudent = async (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Student access required' });
  }
  next();
};

module.exports = {
  authenticateToken,
  authorizeAdmin,
  authorizeStudent
};