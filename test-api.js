const axios = require('axios');

const testRegistration = async () => {
  try {
    console.log('Testing API connection...');
    
    // Test basic connection
    const healthCheck = await axios.get('http://localhost:5000');
    console.log('✓ Server is running:', healthCheck.data);
    
    // Test registration endpoint
    const testData = {
      name: 'Test Student API',
      email: 'testapi@test.com',
      password: 'test123',
      confirmPassword: 'test123',
      rollNo: 'API001',
      dob: '2000-01-01',
      cgpa: '8.5',
      tenthPercentage: '85',
      twelfthPercentage: '87',
      age: '21',
      batch: '2021-2025'
    };
    
    const response = await axios.post('http://localhost:5000/api/auth/student/register', testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✓ Registration successful:', response.data);
    
  } catch (error) {
    console.error('✗ Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
};

testRegistration();