const axios = require('axios');

const testAdminDashboard = async () => {
  try {
    console.log('🧪 Testing Admin Dashboard API...\n');
    
    // First, let's try to login as admin to get a token
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@college.edu',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Now test the dashboard endpoint
    const dashboardResponse = await axios.get('http://localhost:5000/api/admin/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const stats = dashboardResponse.data;
    
    console.log('📊 DASHBOARD API RESPONSE:');
    console.log('==========================');
    console.log(`📈 Total Students: ${stats.totalStudents}`);
    console.log(`🎓 Placed Students: ${stats.placedStudents}`);
    console.log(`🏢 Active Companies: ${stats.activeCompanies}`);
    console.log(`❓ Pending Queries: ${stats.pendingQueries}`);
    console.log(`⚠️  Students with Arrears: ${stats.studentsWithArrears}`);
    console.log(`📊 Average CGPA: ${stats.averageCgpa}`);
    console.log(`🎯 Placement Percentage: ${stats.placementPercentage}%`);
    
    if (stats.placedStudents > 0 && stats.placementPercentage > 0) {
      console.log('\n✅ SUCCESS! Placement statistics are now working correctly!');
    } else {
      console.log('\n❌ Issue still exists - placement statistics are still 0');
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.response?.data || error.message);
  }
};

testAdminDashboard();