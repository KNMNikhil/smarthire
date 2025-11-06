const companies = [
  { 
    id: 1, 
    name: "TCS", 
    package: "3.5 LPA", 
    eligibility: "7.0 CGPA", 
    description: "Tata Consultancy Services - Leading IT services company",
    requirements: "No arrears, Good communication skills",
    location: "Chennai, Bangalore",
    driveDate: "2024-03-15",
    lastDate: "2024-03-10"
  },
  { 
    id: 2, 
    name: "Infosys", 
    package: "4.0 LPA", 
    eligibility: "7.5 CGPA", 
    description: "Infosys Limited - Global leader in consulting and technology",
    requirements: "60% in 10th and 12th, No current arrears",
    location: "Mysore, Pune, Hyderabad",
    driveDate: "2024-03-20",
    lastDate: "2024-03-15"
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
    // Both admin and students can view companies
    return res.json(companies);
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