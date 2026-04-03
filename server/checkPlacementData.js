const { sequelize, Student } = require('./models');

const checkPlacementData = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    // Get all students with their placement status
    const students = await Student.findAll({
      attributes: ['id', 'name', 'placedStatus'],
      order: [['name', 'ASC']]
    });
    
    console.log('\n=== All Students and their Placement Status ===');
    students.forEach(student => {
      console.log(`${student.id}: ${student.name} - ${student.placedStatus}`);
    });
    
    // Get count by placement status
    const placementCounts = await Student.findAll({
      attributes: [
        'placedStatus',
        [sequelize.fn('COUNT', sequelize.col('placedStatus')), 'count']
      ],
      group: ['placedStatus']
    });
    
    console.log('\n=== Placement Status Counts ===');
    placementCounts.forEach(item => {
      console.log(`${item.placedStatus}: ${item.dataValues.count}`);
    });
    
    // Total counts
    const totalStudents = await Student.count();
    const placedStudents = await Student.count({
      where: { 
        placedStatus: { 
          [sequelize.Sequelize.Op.in]: ['General', 'Dream', 'Super Dream', 'Placed (General)', 'Placed (Dream)', 'Placed (Super Dream)'] 
        } 
      }
    });
    
    console.log('\n=== Summary ===');
    console.log(`Total Students: ${totalStudents}`);
    console.log(`Placed Students: ${placedStudents}`);
    console.log(`Placement Rate: ${totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(2) : 0}%`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkPlacementData();