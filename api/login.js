export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password, email } = req.body;
  
  // Admin login
  if (username && username === 'admin' && password === 'admin123') {
    return res.status(200).json({
      token: 'demo_token_admin',
      user: { id: 1, name: 'System Administrator', username: 'admin', role: 'admin' }
    });
  }
  
  // Student login
  if (email && password) {
    const students = [
      { id: 1, email: "220701114@rajalakshmi.edu.in", password: "12", name: "KAAVIYA G" },
      { id: 2, email: "220701120@rajalakshmi.edu.in", password: "12", name: "KARUMURY NAGA MADHAVA NIKHIL" },
      { id: 3, email: "220701116@rajalakshmi.edu.in", password: "12", name: "KALAISELVI S" },
      { id: 4, email: "220701102@rajalakshmi.edu.in", password: "12", name: "JAYANEE POOBALARAYAN" },
      { id: 5, email: "220701128@rajalakshmi.edu.in", password: "12", name: "KEERTHIVASAN S" },
      { id: 6, email: "220701115@rajalakshmi.edu.in", password: "12", name: "KAILAASH B" }
    ];
    
    const student = students.find(s => s.email === email && s.password === password);
    if (student) {
      return res.status(200).json({
        token: `demo_token_student_${student.id}`,
        user: { id: student.id, name: student.name, email: student.email, role: 'student' }
      });
    }
  }
  
  return res.status(401).json({ message: 'Invalid credentials' });
}