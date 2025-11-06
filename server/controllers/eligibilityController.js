const { Student, Company, Registration } = require('../models');
const { Op } = require('sequelize');

// Calculate eligibility for a specific student and company
const calculateEligibility = (student, company) => {
  const criteria = company.eligibilityCriteria;
  const checks = {
    cgpa: (student.cgpa || 0) >= (criteria.minCgpa || 0),
    lastSemGpa: (student.lastSemGpa || 0) >= (criteria.minLastSemGpa || 0),
    arrears: (student.arrears || 0) <= (criteria.maxArrears || 0),
    tenthPercentage: (student.tenthPercentage || 0) >= (criteria.minTenthPercentage || 0),
    twelfthPercentage: (student.twelfthPercentage || 0) >= (criteria.minTwelfthPercentage || 0),
    age: (student.age || 0) >= (criteria.minAge || 0) && (student.age || 100) <= (criteria.maxAge || 100),
    higherStudies: criteria.allowHigherStudies || !student.higherStudies,
    internship: !criteria.requireInternship || student.internship
  };

  const isEligible = Object.values(checks).every(check => check);
  
  return {
    isEligible,
    checks,
    failedCriteria: Object.keys(checks).filter(key => !checks[key])
  };
};

// Get detailed eligibility report for student
const getEligibilityReport = async (req, res) => {
  try {
    const student = await Student.findByPk(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const companies = await Company.findAll({
      where: {
        status: 'Active',
        registrationDeadline: { [Op.gt]: new Date() }
      }
    });

    const eligibilityReport = companies.map(company => {
      const eligibility = calculateEligibility(student, company);
      return {
        company: {
          id: company.id,
          name: company.name,
          jobRole: company.jobRole,
          package: company.package,
          type: company.type,
          visitDate: company.visitDate,
          registrationDeadline: company.registrationDeadline
        },
        ...eligibility
      };
    });

    const eligible = eligibilityReport.filter(report => report.isEligible);
    const notEligible = eligibilityReport.filter(report => !report.isEligible);

    res.json({
      student: {
        name: student.name,
        rollNo: student.rollNo,
        cgpa: student.cgpa,
        lastSemGpa: student.lastSemGpa,
        arrears: student.arrears,
        tenthPercentage: student.tenthPercentage,
        twelfthPercentage: student.twelfthPercentage,
        age: student.age,
        higherStudies: student.higherStudies,
        internship: student.internship,
        placedStatus: student.placedStatus
      },
      summary: {
        totalCompanies: companies.length,
        eligibleCount: eligible.length,
        notEligibleCount: notEligible.length,
        eligibilityPercentage: Math.round((eligible.length / companies.length) * 100)
      },
      eligible,
      notEligible
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Check eligibility for specific company
const checkCompanyEligibility = async (req, res) => {
  try {
    const { companyId } = req.params;
    const student = await Student.findByPk(req.user.id);
    const company = await Company.findByPk(companyId);

    if (!student || !company) {
      return res.status(404).json({ message: 'Student or company not found' });
    }

    const eligibility = calculateEligibility(student, company);
    
    res.json({
      company: {
        id: company.id,
        name: company.name,
        jobRole: company.jobRole,
        eligibilityCriteria: company.eligibilityCriteria
      },
      student: {
        cgpa: student.cgpa,
        lastSemGpa: student.lastSemGpa,
        arrears: student.arrears,
        tenthPercentage: student.tenthPercentage,
        twelfthPercentage: student.twelfthPercentage,
        age: student.age,
        higherStudies: student.higherStudies,
        internship: student.internship
      },
      ...eligibility
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get placement statistics for student
const getPlacementStats = async (req, res) => {
  try {
    const student = await Student.findByPk(req.user.id);
    const registrations = await Registration.findAll({
      where: { studentId: req.user.id },
      include: [Company]
    });

    const stats = {
      totalRegistrations: registrations.length,
      byStatus: {
        registered: registrations.filter(r => r.status === 'Registered').length,
        selected: registrations.filter(r => r.status === 'Selected').length,
        rejected: registrations.filter(r => r.status === 'Rejected').length
      },
      byCompanyType: {
        general: registrations.filter(r => r.Company.type === 'General').length,
        dream: registrations.filter(r => r.Company.type === 'Dream').length,
        superDream: registrations.filter(r => r.Company.type === 'Super Dream').length
      },
      placementStatus: student.placedStatus
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  calculateEligibility,
  getEligibilityReport,
  checkCompanyEligibility,
  getPlacementStats
};