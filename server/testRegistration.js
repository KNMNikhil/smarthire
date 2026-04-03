const axios = require('axios');

const testRegistration = async () => {
  try {
    const testStudent = {
      name: 'Test Student',
      email: 'test@student.com',
      rollNo: 'TEST001',
      password: 'password123',
      confirmPassword: 'password123',
      department: 'CSE',
      age: 20,
      cgpa: 8.5,
      tenthPercentage: 85.5,
      twelfthPercentage: 87.2,
      currentSemester: 6,
      arrears: 0
    };

    console.log('Testing student registration...');
    const response = await axios.post('http://localhost:5000/api/auth/student/register', testStudent);
    console.log('Registration successful:', response.data);
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
  }
};

testRegistration();