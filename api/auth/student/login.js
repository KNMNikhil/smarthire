const students = [
  {
    id: 1,
    name: "KAAVIYA G",
    email: "220701114@rajalakshmi.edu.in",
    password: "12"
  },
  {
    id: 2,
    name: "KARUMURY NAGA MADHAVA NIKHIL",
    email: "220701120@rajalakshmi.edu.in",
    password: "12"
  },
  {
    id: 3,
    name: "KALAISELVI S",
    email: "220701116@rajalakshmi.edu.in",
    password: "12"
  },
  {
    id: 4,
    name: "JAYANEE POOBALARAYAN",
    email: "220701102@rajalakshmi.edu.in",
    password: "12"
  },
  {
    id: 5,
    name: "KEERTHIVASAN S",
    email: "220701128@rajalakshmi.edu.in",
    password: "12"
  },
  {
    id: 6,
    name: "KAILAASH B",
    email: "220701115@rajalakshmi.edu.in",
    password: "12"
  }
];

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { email, password } = req.body;
  const student = students.find(s => s.email === email && s.password === password);
  
  if (student) {
    res.json({
      token: `demo_token_student_${student.id}`,
      user: { id: student.id, name: student.name, email: student.email, role: 'student' }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
}