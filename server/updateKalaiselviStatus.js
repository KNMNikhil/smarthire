const { sequelize, Student } = require('./models');

const updateKalaiselviStatus = async () => {
  try {
    await sequelize.authenticate();
    
    const student = await Student.findOne({
      where: { rollNo: '220701116' }
    });
    
    if (!student) {
      console.log('Student not found');
      return;
    }
    
    console.log('Current status:', student.placedStatus);
    
    // Update to "Not Placed" so she can see all companies
    await student.update({ placedStatus: 'Not Placed' });
    
    console.log('Updated status to: Not Placed');
    console.log('Now Kalaiselvi can see all companies (General, Dream, Super Dream)');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateKalaiselviStatus();