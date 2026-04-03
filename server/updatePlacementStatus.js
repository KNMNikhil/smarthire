const { sequelize, Student } = require('./models');

const updatePlacementStatus = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    
    console.log('Synchronizing database with new enum values...');
    await sequelize.sync({ alter: true });
    console.log('Database synchronized.');
    
    // Update students with higherStudies=true to have placedStatus='Higher Studies'
    const [updatedCount] = await Student.update(
      { placedStatus: 'Higher Studies' },
      { 
        where: { 
          higherStudies: true,
          placedStatus: 'Not Placed'
        } 
      }
    );
    
    console.log(`Updated ${updatedCount} students to 'Higher Studies' status.`);
    
    // Verify the changes
    const higherStudiesStudents = await Student.findAll({
      where: { higherStudies: true },
      attributes: ['id', 'name', 'rollNo', 'placedStatus', 'higherStudies']
    });
    
    console.log('Students with Higher Studies:');
    console.table(higherStudiesStudents.map(s => s.toJSON()));
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating placement status:', error);
    process.exit(1);
  }
};

updatePlacementStatus();