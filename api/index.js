const students = [
  { id: 1, name: "KAAVIYA G", email: "220701114@rajalakshmi.edu.in", password: "12", placedStatus: "Higher Studies", cgpa: "8.8", tenthPercentage: "95", twelfthPercentage: "97", arrears: 0 },
  { id: 2, name: "KARUMURY NAGA MADHAVA NIKHIL", email: "220701120@rajalakshmi.edu.in", password: "12", placedStatus: "Higher Studies", cgpa: "7.5", tenthPercentage: "60", twelfthPercentage: "72", arrears: 0 },
  { id: 3, name: "KALAISELVI S", email: "220701116@rajalakshmi.edu.in", password: "12", placedStatus: "Placed - Dream", cgpa: "8.5", tenthPercentage: "97", twelfthPercentage: "95", arrears: 0 },
  { id: 4, name: "JAYANEE POOBALARAYAN", email: "220701102@rajalakshmi.edu.in", password: "12", placedStatus: "Placed - Super Dream", cgpa: "8.5", tenthPercentage: "97", twelfthPercentage: "97", arrears: 0 },
  { id: 5, name: "KEERTHIVASAN S", email: "220701128@rajalakshmi.edu.in", password: "12", placedStatus: "Not Placed", cgpa: "7.4", tenthPercentage: "86", twelfthPercentage: "75", arrears: 0 },
  { id: 6, name: "KAILAASH B", email: "220701115@rajalakshmi.edu.in", password: "12", placedStatus: "Not Placed", cgpa: "7.1", tenthPercentage: "70", twelfthPercentage: "73", arrears: 0 }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, method } = req;
  
  // Admin login
  if (url === '/auth/admin/login' && method === 'POST') {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
      return res.json({
        token: 'demo_token_admin',
        user: { id: 1, name: 'System Administrator', username: 'admin', role: 'admin' }
      });
    }
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Student login
  if (url === '/auth/student/login' && method === 'POST') {
    const { email, password } = req.body;
    const student = students.find(s => s.email === email && s.password === password);
    if (student) {
      return res.json({
        token: `demo_token_student_${student.id}`,
        user: { id: student.id, name: student.name, email: student.email, role: 'student' }
      });
    }
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Student registration
  if (url === '/auth/student/register' && method === 'POST') {
    return res.status(201).json({ message: 'Student registered successfully' });
  }
  
  // Admin dashboard
  if (url === '/admin/dashboard' && method === 'GET') {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token !== 'demo_token_admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const totalStudents = students.length;
    const placedStudents = students.filter(s => 
      ['Placed - General', 'Placed - Dream', 'Placed - Super Dream'].includes(s.placedStatus)
    ).length;
    
    return res.json({
      totalStudents,
      placedStudents,
      activeCompanies: 0,
      studentsWithArrears: 0,
      averageCgpa: '8.15',
      placementPercentage: Math.round((placedStudents / totalStudents) * 100),
      pendingQueries: 0
    });
  }
  
  // Student dashboard
  if (url === '/students/dashboard' && method === 'GET') {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token?.startsWith('demo_token_student_')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const studentId = parseInt(token.replace('demo_token_student_', ''));
    const student = students.find(s => s.id === studentId);
    
    return res.json({
      student,
      eligibleCompanies: [],
      totalEligible: 0
    });
  }
  
  // Get students
  if (url === '/students' && method === 'GET') {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token !== 'demo_token_admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    return res.json(students.map(s => ({ ...s, password: undefined })));
  }
  
  // Default response
  return res.status(404).json({ message: 'API endpoint not found' });
}