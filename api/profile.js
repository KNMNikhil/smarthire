const students = [
  { id: 1, name: "KAAVIYA G", email: "220701114@rajalakshmi.edu.in", password: "12", placedStatus: "Higher Studies", cgpa: "8.8", tenthPercentage: "95", twelfthPercentage: "97", arrears: 0, rollNo: "220701114", avatar: "/114.jpg", dob: "2003-05-15", age: 21, department: "CSE", batch: "2022-2026", sem1Gpa: "8.5", sem2Gpa: "8.7", sem3Gpa: "8.9", sem4Gpa: "8.8", sem5Gpa: "8.6", sem6Gpa: "9.0" },
  { id: 2, name: "KARUMURY NAGA MADHAVA NIKHIL", email: "220701120@rajalakshmi.edu.in", password: "12", placedStatus: "Higher Studies", cgpa: "7.5", tenthPercentage: "60", twelfthPercentage: "72", arrears: 0, rollNo: "220701120", avatar: "/120.jpg", dob: "2003-08-22", age: 21, department: "CSE", batch: "2022-2026", sem1Gpa: "7.2", sem2Gpa: "7.5", sem3Gpa: "7.8", sem4Gpa: "7.6", sem5Gpa: "7.4", sem6Gpa: "7.3" },
  { id: 3, name: "KALAISELVI S", email: "220701116@rajalakshmi.edu.in", password: "12", placedStatus: "Placed - Dream", cgpa: "8.5", tenthPercentage: "97", twelfthPercentage: "95", arrears: 0, rollNo: "220701116", avatar: "https://randomuser.me/api/portraits/women/68.jpg", dob: "2003-03-10", age: 21, department: "CSE", batch: "2022-2026", sem1Gpa: "8.2", sem2Gpa: "8.4", sem3Gpa: "8.6", sem4Gpa: "8.5", sem5Gpa: "8.7", sem6Gpa: "8.8" },
  { id: 4, name: "JAYANEE POOBALARAYAN", email: "220701102@rajalakshmi.edu.in", password: "12", placedStatus: "Placed - Super Dream", cgpa: "8.5", tenthPercentage: "97", twelfthPercentage: "97", arrears: 0, rollNo: "220701102", avatar: "https://randomuser.me/api/portraits/women/25.jpg", dob: "2003-12-05", age: 20, department: "CSE", batch: "2022-2026", sem1Gpa: "8.3", sem2Gpa: "8.5", sem3Gpa: "8.7", sem4Gpa: "8.6", sem5Gpa: "8.4", sem6Gpa: "8.5" },
  { id: 5, name: "KEERTHIVASAN S", email: "220701128@rajalakshmi.edu.in", password: "12", placedStatus: "Not Placed", cgpa: "7.4", tenthPercentage: "86", twelfthPercentage: "75", arrears: 0, rollNo: "220701128", avatar: "https://randomuser.me/api/portraits/men/52.jpg", dob: "2003-07-18", age: 21, department: "CSE", batch: "2022-2026", sem1Gpa: "7.1", sem2Gpa: "7.3", sem3Gpa: "7.5", sem4Gpa: "7.4", sem5Gpa: "7.6", sem6Gpa: "7.2" },
  { id: 6, name: "KAILAASH B", email: "220701115@rajalakshmi.edu.in", password: "12", placedStatus: "Not Placed", cgpa: "7.1", tenthPercentage: "70", twelfthPercentage: "73", arrears: 0, rollNo: "220701115", avatar: "https://randomuser.me/api/portraits/men/32.jpg", dob: "2003-11-30", age: 20, department: "CSE", batch: "2022-2026", sem1Gpa: "6.8", sem2Gpa: "7.0", sem3Gpa: "7.2", sem4Gpa: "7.1", sem5Gpa: "7.3", sem6Gpa: "7.0" }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token?.startsWith('demo_token_student_')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const studentId = parseInt(token.replace('demo_token_student_', ''));
  const student = students.find(s => s.id === studentId);
  
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  if (req.method === 'GET') {
    return res.json({ ...student, password: undefined });
  }

  if (req.method === 'PUT') {
    // Update student profile
    const updates = req.body;
    Object.assign(student, updates);
    return res.json({ message: 'Profile updated successfully', student: { ...student, password: undefined } });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}