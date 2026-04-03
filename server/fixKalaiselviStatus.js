const { sequelize, Student } = require('./models');

const fixKalaiselviStatus = async () => {
  try {
    await sequelize.authenticate();
    
    const student = await Student.findOne({
      where: { rollNo: '220701116' }
    });
    
    if (!student) {
      console.log('Student not found');
      return;
    }
    
    // Revert back to Placed (Dream)
    await student.update({ placedStatus: 'Placed (Dream)' });
    
    console.log('Reverted Kalaiselvi status back to: Placed (Dream)');
    console.log('She should see Super Dream companies like ZOHO');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixKalaiselviStatus();