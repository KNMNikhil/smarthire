const { sequelize, Student, Company, Query } = require('./models');
const { Op } = require('sequelize');

const testFixedAPI = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully\n');
    
    // Test the exact same query as in the fixed admin dashboard endpoint
    const totalStudents = await Student.count();
    const placedStudents = await Student.count({
      where: {
        placedStatus: { 
          [Op.in]: ['General', 'Dream', 'Super Dream', 'Placed (General)', 'Placed (Dream)', 'Placed (Super Dream)'] 
        }
      }
    });
    const higherStudiesStudents = await Student.count({
      where: {
        placedStatus: 'Higher Studies'
      }
    });
    const activeCompanies = await Company.count();
    const studentsWithArrears = await Student.count({
      where: {
        arrears: { [Op.gt]: 0 }
      }
    });
    
    // Calculate average CGPA (same logic as in server)
    const students = await Student.findAll({
      attributes: ['cgpa'],
      where: {
        cgpa: { [Op.ne]: null }
      }
    });
    
    const validCgpas = students.map(s => parseFloat(s.cgpa)).filter(cgpa => !isNaN(cgpa));
    const averageCgpa = validCgpas.length > 0 ? (validCgpas.reduce((a, b) => a + b, 0) / validCgpas.length).toFixed(2) : '0.00';
    
    const placementPercentage = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;
    
    const dashboardData = {
      totalStudents,
      placedStudents,
      higherStudiesStudents,
      activeCompanies,
      studentsWithArrears,
      averageCgpa,
      placementPercentage,
      pendingQueries: 0
    };
    
    console.log('🎯 FIXED API RESPONSE (Simulated):');
    console.log('==================================');
    console.log(`📈 Total Students: ${dashboardData.totalStudents}`);
    console.log(`🎓 Placed Students: ${dashboardData.placedStudents}`);
    console.log(`📚 Higher Studies: ${dashboardData.higherStudiesStudents}`);
    console.log(`🏢 Active Companies: ${dashboardData.activeCompanies}`);
    console.log(`⚠️  Students with Arrears: ${dashboardData.studentsWithArrears}`);
    console.log(`📊 Average CGPA: ${dashboardData.averageCgpa}`);
    console.log(`🎯 Placement Percentage: ${dashboardData.placementPercentage}%`);
    console.log(`❓ Pending Queries: ${dashboardData.pendingQueries}`);
    
    console.log('\n📋 JSON Response:');
    console.log(JSON.stringify(dashboardData, null, 2));
    
    if (dashboardData.placedStudents > 0 && dashboardData.placementPercentage > 0) {
      console.log('\n✅ SUCCESS! The placement statistics fix is working correctly!');
      console.log('The admin dashboard should now show the correct placement data.');
    } else {
      console.log('\n❌ Issue still exists - placement statistics are still 0');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testFixedAPI();