const getEligibleCompaniesForStudent = (student, companies) => {
  return companies.filter(company => {
    const studentCgpa = parseFloat(student.cgpa) || 0;
    const currentSem = parseInt(student.currentSemester) || 8;
    const lastSemGpaField = `sem${currentSem - 1}Gpa`;
    const studentLastSemGpa = parseFloat(student[lastSemGpaField]) || parseFloat(student.lastSemGpa) || 0;
    const studentArrears = parseInt(student.arrears) || 0;
    const studentTenth = parseFloat(student.tenthPercentage) || 0;
    const studentTwelfth = parseFloat(student.twelfthPercentage) || 0;
    
    // Check placement hierarchy - students can only apply to higher categories
    const studentPlacementStatus = student.placedStatus;
    const companyType = company.type || 'General';
    
    let canApply = true;
    if (studentPlacementStatus === 'Placed (General)') {
      canApply = companyType === 'Dream' || companyType === 'Super Dream';
    } else if (studentPlacementStatus === 'Placed (Dream)') {
      canApply = companyType === 'Super Dream';
    } else if (studentPlacementStatus === 'Placed (Super Dream)' || studentPlacementStatus === 'Higher Studies') {
      canApply = false;
    }
    
    if (!canApply) return false;
    
    const criteria = company.eligibilityCriteria || {};
    const cgpaEligible = !criteria.minCgpa || studentCgpa >= parseFloat(criteria.minCgpa);
    const lastSemEligible = !criteria.minLastSemGpa || studentLastSemGpa >= parseFloat(criteria.minLastSemGpa);
    const arrearsEligible = criteria.maxArrears === undefined || studentArrears <= parseInt(criteria.maxArrears);
    const tenthEligible = !criteria.minTenthPercentage || studentTenth >= parseFloat(criteria.minTenthPercentage);
    const twelfthEligible = !criteria.minTwelfthPercentage || studentTwelfth >= parseFloat(criteria.minTwelfthPercentage);
    const internshipEligible = !criteria.requireInternship || student.internship;
    
    return cgpaEligible && lastSemEligible && arrearsEligible && 
           tenthEligible && twelfthEligible && internshipEligible;
  });
};

const getEligibleStudentsForCompany = (company, students) => {
  return students.filter(student => {
    const studentCgpa = parseFloat(student.cgpa) || 0;
    const currentSem = parseInt(student.currentSemester) || 8;
    const lastSemGpaField = `sem${currentSem - 1}Gpa`;
    const studentLastSemGpa = parseFloat(student[lastSemGpaField]) || parseFloat(student.lastSemGpa) || 0;
    const studentArrears = parseInt(student.arrears) || 0;
    const studentTenth = parseFloat(student.tenthPercentage) || 0;
    const studentTwelfth = parseFloat(student.twelfthPercentage) || 0;
    
    const criteria = company.eligibilityCriteria || {};
    const cgpaEligible = !criteria.minCgpa || studentCgpa >= parseFloat(criteria.minCgpa);
    const lastSemEligible = !criteria.minLastSemGpa || studentLastSemGpa >= parseFloat(criteria.minLastSemGpa);
    const arrearsEligible = criteria.maxArrears === undefined || studentArrears <= parseInt(criteria.maxArrears);
    const tenthEligible = !criteria.minTenthPercentage || studentTenth >= parseFloat(criteria.minTenthPercentage);
    const twelfthEligible = !criteria.minTwelfthPercentage || studentTwelfth >= parseFloat(criteria.minTwelfthPercentage);
    const internshipEligible = !criteria.requireInternship || student.internship;
    
    return cgpaEligible && lastSemEligible && arrearsEligible && 
           tenthEligible && twelfthEligible && internshipEligible;
  });
};

const checkStudentEligibility = (student, company) => {
  const studentCgpa = parseFloat(student.cgpa) || 0;
  const currentSem = parseInt(student.currentSemester) || 8;
  const lastSemGpaField = `sem${currentSem - 1}Gpa`;
  const studentLastSemGpa = parseFloat(student[lastSemGpaField]) || parseFloat(student.lastSemGpa) || 0;
  const studentArrears = parseInt(student.arrears) || 0;
  const studentTenth = parseFloat(student.tenthPercentage) || 0;
  const studentTwelfth = parseFloat(student.twelfthPercentage) || 0;
  
  const criteria = company.eligibilityCriteria || {};
  
  return {
    eligible: true,
    cgpa: { 
      eligible: !criteria.minCgpa || studentCgpa >= parseFloat(criteria.minCgpa),
      required: criteria.minCgpa || 0,
      actual: studentCgpa
    },
    lastSemGpa: {
      eligible: !criteria.minLastSemGpa || studentLastSemGpa >= parseFloat(criteria.minLastSemGpa),
      required: criteria.minLastSemGpa || 0,
      actual: studentLastSemGpa
    },
    arrears: {
      eligible: criteria.maxArrears === undefined || studentArrears <= parseInt(criteria.maxArrears),
      required: criteria.maxArrears !== undefined ? criteria.maxArrears : 'No limit',
      actual: studentArrears
    },
    tenth: {
      eligible: !criteria.minTenthPercentage || studentTenth >= parseFloat(criteria.minTenthPercentage),
      required: criteria.minTenthPercentage || 0,
      actual: studentTenth
    },
    twelfth: {
      eligible: !criteria.minTwelfthPercentage || studentTwelfth >= parseFloat(criteria.minTwelfthPercentage),
      required: criteria.minTwelfthPercentage || 0,
      actual: studentTwelfth
    },
    internship: {
      eligible: !criteria.requireInternship || student.internship,
      required: criteria.requireInternship || false,
      actual: student.internship || false
    }
  };
};

module.exports = {
  getEligibleCompaniesForStudent,
  getEligibleStudentsForCompany,
  checkStudentEligibility
};