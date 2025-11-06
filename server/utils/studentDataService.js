const { Student } = require('../models');
const { Op } = require('sequelize');

// Validate student data
const validateStudentData = (data) => {
  const errors = [];
  
  // Required fields
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Valid email is required');
  }
  
  if (!data.rollNo || data.rollNo.trim().length < 3) {
    errors.push('Roll number must be at least 3 characters long');
  }
  
  // Academic validations
  if (data.cgpa && (data.cgpa < 0 || data.cgpa > 10)) {
    errors.push('CGPA must be between 0 and 10');
  }
  
  if (data.lastSemGpa && (data.lastSemGpa < 0 || data.lastSemGpa > 10)) {
    errors.push('Last semester GPA must be between 0 and 10');
  }
  
  if (data.tenthPercentage && (data.tenthPercentage < 0 || data.tenthPercentage > 100)) {
    errors.push('10th percentage must be between 0 and 100');
  }
  
  if (data.twelfthPercentage && (data.twelfthPercentage < 0 || data.twelfthPercentage > 100)) {
    errors.push('12th percentage must be between 0 and 100');
  }
  
  if (data.arrears && data.arrears < 0) {
    errors.push('Arrears cannot be negative');
  }
  
  if (data.age && (data.age < 16 || data.age > 35)) {
    errors.push('Age must be between 16 and 35');
  }
  
  return errors;
};

// Calculate academic performance score
const calculatePerformanceScore = (student) => {
  let score = 0;
  let factors = 0;
  
  if (student.cgpa) {
    score += (student.cgpa / 10) * 30;
    factors += 30;
  }
  
  if (student.lastSemGpa) {
    score += (student.lastSemGpa / 10) * 20;
    factors += 20;
  }
  
  if (student.tenthPercentage) {
    score += (student.tenthPercentage / 100) * 15;
    factors += 15;
  }
  
  if (student.twelfthPercentage) {
    score += (student.twelfthPercentage / 100) * 15;
    factors += 15;
  }
  
  // Penalty for arrears
  if (student.arrears) {
    score -= Math.min(student.arrears * 5, 20);
  }
  
  // Bonus for internship
  if (student.internship) {
    score += 10;
    factors += 10;
  }
  
  // Bonus for no higher studies (focused on placement)
  if (!student.higherStudies) {
    score += 10;
    factors += 10;
  }
  
  return factors > 0 ? Math.max(0, Math.min(100, (score / factors) * 100)) : 0;
};

// Get student eligibility summary
const getStudentEligibilitySummary = async (studentId) => {
  try {
    const student = await Student.findByPk(studentId);
    if (!student) {
      throw new Error('Student not found');
    }
    
    const performanceScore = calculatePerformanceScore(student);
    
    // Determine eligibility tier
    let tier = 'Basic';
    if (performanceScore >= 80) tier = 'Premium';
    else if (performanceScore >= 60) tier = 'Standard';
    
    // Check data completeness
    const requiredFields = ['cgpa', 'lastSemGpa', 'tenthPercentage', 'twelfthPercentage', 'age'];
    const completedFields = requiredFields.filter(field => student[field] !== null && student[field] !== undefined);
    const completeness = (completedFields.length / requiredFields.length) * 100;
    
    return {
      student: {
        id: student.id,
        name: student.name,
        rollNo: student.rollNo,
        placedStatus: student.placedStatus
      },
      performanceScore: Math.round(performanceScore),
      tier,
      completeness: Math.round(completeness),
      missingFields: requiredFields.filter(field => !student[field]),
      strengths: getStudentStrengths(student),
      recommendations: getRecommendations(student, performanceScore)
    };
  } catch (error) {
    throw error;
  }
};

// Identify student strengths
const getStudentStrengths = (student) => {
  const strengths = [];
  
  if (student.cgpa >= 8.5) strengths.push('Excellent Academic Performance');
  else if (student.cgpa >= 7.5) strengths.push('Good Academic Performance');
  
  if (student.arrears === 0) strengths.push('No Backlogs');
  if (student.internship) strengths.push('Industry Experience');
  if (student.tenthPercentage >= 85) strengths.push('Strong Foundation');
  if (student.twelfthPercentage >= 85) strengths.push('Consistent Performance');
  
  return strengths;
};

// Get improvement recommendations
const getRecommendations = (student, score) => {
  const recommendations = [];
  
  if (score < 60) {
    recommendations.push('Focus on improving current semester grades');
    if (student.arrears > 0) {
      recommendations.push('Clear pending arrears to improve eligibility');
    }
  }
  
  if (!student.internship) {
    recommendations.push('Consider pursuing internships for better opportunities');
  }
  
  if (!student.cgpa || student.cgpa < 7) {
    recommendations.push('Work on maintaining CGPA above 7.0 for better placements');
  }
  
  return recommendations;
};

module.exports = {
  validateStudentData,
  calculatePerformanceScore,
  getStudentEligibilitySummary,
  getStudentStrengths,
  getRecommendations
};