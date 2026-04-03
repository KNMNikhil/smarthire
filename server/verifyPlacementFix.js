const { sequelize, Student, Company, Query } = require('./models');
const { Op } = require('sequelize');

const verifyPlacementFix = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully\n');
    
    // Get all students with their placement status
    const allStudents = await Student.findAll({
      attributes: ['id', 'name', 'placedStatus', 'cgpa'],
      order: [['name', 'ASC']]
    });
    
    console.log('📊 CURRENT STUDENT DATA:');
    console.log('========================');
    allStudents.forEach(student => {
      console.log(`${student.id}: ${student.name.padEnd(30)} | Status: ${student.placedStatus.padEnd(20)} | CGPA: ${student.cgpa || 'N/A'}`);
    });
    
    // Test the dashboard query (same as admin route)
    const totalStudents = await Student.count();
    const placedStudents = await Student.count({
      where: { 
        placedStatus: { 
          [Op.in]: ['General', 'Dream', 'Super Dream', 'Placed (General)', 'Placed (Dream)', 'Placed (Super Dream)'] 
        } 
      }
    });
    const activeCompanies = await Company.count({ where: { status: 'Active' } });
    const pendingQueries = await Query.count({ where: { status: 'Pending' } });
    const studentsWithArrears = await Student.count({ where: { arrears: { [Op.gt]: 0 } } });
    
    // Calculate average CGPA
    const avgCgpaResult = await Student.findOne({
      attributes: [[sequelize.fn('AVG', sequelize.col('cgpa')), 'avgCgpa']],
      where: { cgpa: { [Op.ne]: null } }
    });
    
    const averageCgpa = avgCgpaResult?.dataValues?.avgCgpa ? 
      parseFloat(avgCgpaResult.dataValues.avgCgpa).toFixed(2) : '0.00';

    const placementPercentage = totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(2) : 0;

    console.log('\n🎯 DASHBOARD STATISTICS (FIXED):');
    console.log('=================================');
    console.log(`📈 Total Students: ${totalStudents}`);
    console.log(`🎓 Placed Students: ${placedStudents}`);
    console.log(`🏢 Active Companies: ${activeCompanies}`);
    console.log(`❓ Pending Queries: ${pendingQueries}`);
    console.log(`⚠️  Students with Arrears: ${studentsWithArrears}`);
    console.log(`📊 Average CGPA: ${averageCgpa}`);
    console.log(`🎯 Placement Percentage: ${placementPercentage}%`);
    
    // Breakdown by placement status
    console.log('\n📋 PLACEMENT STATUS BREAKDOWN:');
    console.log('==============================');
    const statusCounts = await Student.findAll({
      attributes: [
        'placedStatus',
        [sequelize.fn('COUNT', sequelize.col('placedStatus')), 'count']
      ],
      group: ['placedStatus']
    });
    
    statusCounts.forEach(item => {
      const status = item.placedStatus;
      const count = item.dataValues.count;
      const percentage = ((count / totalStudents) * 100).toFixed(1);
      console.log(`${status.padEnd(25)} | ${count} students (${percentage}%)`);
    });
    
    console.log('\n✅ VERIFICATION COMPLETE!');
    console.log('The placement statistics should now show correctly in the admin dashboard.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

verifyPlacementFix();