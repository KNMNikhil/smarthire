const axios = require('axios');

const testKalaiselviAPI = async () => {
  try {
    // First login as Kalaiselvi
    const loginResponse = await axios.post('http://localhost:5000/api/auth/student/login', {
      email: 'kalaiselvi@student.com', // Assuming this is her email
      password: 'password123' // Default password
    });
    
    const token = loginResponse.data.token;
    console.log('Login successful for Kalaiselvi');
    
    // Get dashboard data
    const dashboardResponse = await axios.get('http://localhost:5000/api/students/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('Dashboard Response:');
    console.log('Student:', dashboardResponse.data.student.name);
    console.log('Placement Status:', dashboardResponse.data.student.placedStatus);
    console.log('Eligible Companies:', dashboardResponse.data.eligibleCompanies.length);
    
    dashboardResponse.data.eligibleCompanies.forEach(company => {
      console.log(`- ${company.name} (${company.type})`);
    });
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

testKalaiselviAPI();