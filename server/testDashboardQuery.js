const { sequelize, Student, Company } = require('./models');

const testDashboardQuery = async () => {
  try {
    await sequelize.authenticate();
    
    const totalStudents = await Student.count();
    console.log('Total Students:', totalStudents);
    
    // Test different queries
    const placedQuery1 = await Student.count({
      where: {
        placedStatus: { [sequelize.Sequelize.Op.iLike]: 'Placed%' }
      }
    });
    console.log('Placed (iLike):', placedQuery1);
    
    const placedQuery2 = await Student.count({
      where: {
        placedStatus: 'Placed (Dream)'
      }
    });
    console.log('Placed (Dream) exact:', placedQuery2);
    
    const higherStudies = await Student.count({
      where: {
        placedStatus: 'Higher Studies'
      }
    });
    console.log('Higher Studies:', higherStudies);
    
    const activeCompanies = await Company.count();
    console.log('Active Companies:', activeCompanies);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testDashboardQuery();