const students = [
  { id: 1, name: "KAAVIYA G", email: "220701114@rajalakshmi.edu.in", password: "12", placedStatus: "Higher Studies", cgpa: "8.8", tenthPercentage: "95", twelfthPercentage: "97", arrears: 0, rollNo: "220701114", avatar: "/114.jpg" },
  { id: 2, name: "KARUMURY NAGA MADHAVA NIKHIL", email: "220701120@rajalakshmi.edu.in", password: "12", placedStatus: "Higher Studies", cgpa: "7.5", tenthPercentage: "60", twelfthPercentage: "72", arrears: 0, rollNo: "220701120", avatar: "/120.jpg" },
  { id: 3, name: "KALAISELVI S", email: "220701116@rajalakshmi.edu.in", password: "12", placedStatus: "Placed - Dream", cgpa: "8.5", tenthPercentage: "97", twelfthPercentage: "95", arrears: 0, rollNo: "220701116", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
  { id: 4, name: "JAYANEE POOBALARAYAN", email: "220701102@rajalakshmi.edu.in", password: "12", placedStatus: "Placed - Super Dream", cgpa: "8.5", tenthPercentage: "97", twelfthPercentage: "97", arrears: 0, rollNo: "220701102", avatar: "https://randomuser.me/api/portraits/women/25.jpg" },
  { id: 5, name: "KEERTHIVASAN S", email: "220701128@rajalakshmi.edu.in", password: "12", placedStatus: "Not Placed", cgpa: "7.4", tenthPercentage: "86", twelfthPercentage: "75", arrears: 0, rollNo: "220701128", avatar: "https://randomuser.me/api/portraits/men/52.jpg" },
  { id: 6, name: "KAILAASH B", email: "220701115@rajalakshmi.edu.in", password: "12", placedStatus: "Not Placed", cgpa: "7.1", tenthPercentage: "70", twelfthPercentage: "73", arrears: 0, rollNo: "220701115", avatar: "https://randomuser.me/api/portraits/men/32.jpg" }
];

const companies = [
  { id: 1, name: "ZOHO", package: "6.5 LPA", eligibility: "7.5 CGPA" },
  { id: 2, name: "AMAZON", package: "12.0 LPA", eligibility: "8.0 CGPA" }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  
  // Admin dashboard
  if (token === 'demo_token_admin') {
    const totalStudents = students.length;
    const placedStudents = students.filter(s => 
      ['Placed - General', 'Placed - Dream', 'Placed - Super Dream'].includes(s.placedStatus)
    ).length;
    
    return res.json({
      totalStudents,
      placedStudents,
      activeCompanies: companies.length,
      studentsWithArrears: students.filter(s => s.arrears > 0).length,
      averageCgpa: '7.8',
      placementPercentage: Math.round((placedStudents / totalStudents) * 100),
      pendingQueries: 0
    });
  }
  
  // Student dashboard
  if (token?.startsWith('demo_token_student_')) {
    const studentId = parseInt(token.replace('demo_token_student_', ''));
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    return res.json({
      student: { ...student, password: undefined },
      eligibleCompanies: companies,
      totalEligible: companies.length
    });
  }

  return res.status(401).json({ message: 'Unauthorized' });
}