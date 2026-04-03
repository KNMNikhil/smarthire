const { Student, Company, Registration, sequelize } = require('./models');

async function verifyStatisticsData() {
  try {
    console.log('📊 Verifying Statistics Data...\n');
    
    // Get all students
    const students = await Student.findAll();
    console.log(`✅ Total Students: ${students.length}`);
    
    // Count placed students (all placement status formats)
    const placedStudents = students.filter(s => 
      ['General', 'Dream', 'Super Dream', 
       'Placed (General)', 'Placed (Dream)', 'Placed (Super Dream)',
       'Placed - General', 'Placed - Dream', 'Placed - Super Dream'].includes(s.placedStatus)
    );
    console.log(`✅ Placed Students: ${placedStudents.length}`);
    
    // Calculate placement rate
    const placementRate = students.length > 0 ? ((placedStudents.length / students.length) * 100).toFixed(2) : 0;
    console.log(`✅ Placement Rate: ${placementRate}%`);
    
    // Calculate average CGPA
    const validCgpas = students.map(s => parseFloat(s.cgpa)).filter(cgpa => !isNaN(cgpa));
    const avgCgpa = validCgpas.length > 0 ? (validCgpas.reduce((a, b) => a + b, 0) / validCgpas.length).toFixed(2) : '0.00';
    console.log(`✅ Average CGPA: ${avgCgpa}`);
    
    // CGPA Distribution
    console.log('\n📈 CGPA Distribution:');
    const cgpaRanges = [
      { label: '6.0-7.0', min: 6.0, max: 7.0 },
      { label: '7.0-8.0', min: 7.0, max: 8.0 },
      { label: '8.0-9.0', min: 8.0, max: 9.0 },
      { label: '9.0-10.0', min: 9.0, max: 10.0 }
    ];
    
    cgpaRanges.forEach((range, index) => {
      const count = students.filter(s => {
        const cgpa = parseFloat(s.cgpa);
        if (isNaN(cgpa)) return false;
        if (index === cgpaRanges.length - 1) {
          return cgpa >= range.min && cgpa <= range.max;
        }
        return cgpa >= range.min && cgpa < range.max;
      }).length;
      console.log(`  ${range.label}: ${count} students`);
    });
    
    // Arrears Distribution
    console.log('\n📊 Arrears Distribution:');
    const noArrears = students.filter(s => (parseInt(s.arrears) || 0) === 0).length;
    const lowArrears = students.filter(s => {
      const arr = parseInt(s.arrears) || 0;
      return arr >= 1 && arr <= 2;
    }).length;
    const highArrears = students.filter(s => (parseInt(s.arrears) || 0) >= 3).length;
    
    console.log(`  0 Arrears: ${noArrears} students`);
    console.log(`  1-2 Arrears: ${lowArrears} students`);
    console.log(`  3+ Arrears: ${highArrears} students`);
    
    // Companies
    const companies = await Company.findAll();
    console.log(`\n✅ Total Companies: ${companies.length}`);
    
    // Registrations
    const registrations = await Registration.count();
    console.log(`✅ Total Registrations: ${registrations}`);
    
    console.log('\n🎯 All statistics data verified successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

verifyStatisticsData();