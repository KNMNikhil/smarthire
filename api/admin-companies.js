let companies = [
  { 
    id: 1, 
    name: "ZOHO", 
    package: "6.5 LPA", 
    eligibility: "7.5 CGPA", 
    description: "Zoho Corporation - Leading cloud software suite provider",
    requirements: "No arrears, Strong programming skills, Good problem-solving abilities",
    location: "Chennai, Bangalore",
    driveDate: "2024-03-25",
    lastDate: "2024-03-20",
    jobRole: "Software Developer",
    type: "Product Based"
  },
  { 
    id: 2, 
    name: "AMAZON", 
    package: "12.0 LPA", 
    eligibility: "8.0 CGPA", 
    description: "Amazon - Global e-commerce and cloud computing leader",
    requirements: "75% in 10th and 12th, No current arrears, Strong DSA skills",
    location: "Hyderabad, Bangalore, Chennai",
    driveDate: "2024-04-05",
    lastDate: "2024-03-30",
    jobRole: "Software Development Engineer",
    type: "Product Based"
  }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = req.headers.authorization?.replace('Bearer ', '');

  if (req.method === 'GET') {
    // Admin can view all companies with full details
    if (token === 'demo_token_admin') {
      return res.json(companies);
    }
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Admin-only operations
  if (token !== 'demo_token_admin') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const newCompany = { id: Date.now(), ...req.body };
    companies.push(newCompany);
    return res.status(201).json(newCompany);
  }

  if (req.method === 'PUT') {
    const { id } = req.query;
    const companyIndex = companies.findIndex(c => c.id === parseInt(id));
    if (companyIndex === -1) {
      return res.status(404).json({ message: 'Company not found' });
    }
    companies[companyIndex] = { ...companies[companyIndex], ...req.body };
    return res.json(companies[companyIndex]);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    const companyIndex = companies.findIndex(c => c.id === parseInt(id));
    if (companyIndex === -1) {
      return res.status(404).json({ message: 'Company not found' });
    }
    companies.splice(companyIndex, 1);
    return res.json({ message: 'Company deleted successfully' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}