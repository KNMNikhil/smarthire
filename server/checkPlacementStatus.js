const { sequelize, Student } = require('./models');

const checkPlacementStatus = async () => {
  try {
    await sequelize.authenticate();
    
    const students = await Student.findAll({
      attributes: ['id', 'name', 'placedStatus', 'higherStudies']
    });
    
    console.log('All students and their placement status:');
    console.table(students.map(s => s.toJSON()));
    
    const placedCount = await Student.count({
      where: {
        placedStatus: {
          [sequelize.Sequelize.Op.in]: ['General', 'Dream', 'Super Dream', 'Higher Studies']
        }
      }
    });
    
    console.log('Placed students count:', placedCount);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkPlacementStatus();