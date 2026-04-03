const { sequelize } = require('./config/database');
const { Student, Registration } = require('./models');

async function testProfileUpdate() {
  try {
    console.log('Testing profile update functionality...');
    
    // Find the student
    const student = await Student.findOne({
      where: { rollNo: '220701115' }
    });
    
    if (!student) {
      console.log('❌ Student not found');
      return;
    }
    
    console.log('Before update:', {
      name: student.name,
      rollNo: student.rollNo,
      placedStatus: student.placedStatus
    });
    
    // Check current registrations
    const registrations = await Registration.findAll({
      where: { studentId: student.id }
    });
    
    console.log('Current registrations:', registrations.map(r => ({
      companyId: r.companyId,
      status: r.status
    })));
    
    // Update placement status to "Not Placed"
    await student.update({
      placedStatus: 'Not Placed'
    });
    
    // Clear Selected registrations
    await Registration.update(
      { status: 'Registered' },
      { 
        where: { 
          studentId: student.id,
          status: 'Selected'
        }
      }
    );
    
    console.log('After update:', {
      name: student.name,
      rollNo: student.rollNo,
      placedStatus: student.placedStatus
    });
    
    // Check updated registrations
    const updatedRegistrations = await Registration.findAll({
      where: { studentId: student.id }
    });
    
    console.log('Updated registrations:', updatedRegistrations.map(r => ({
      companyId: r.companyId,
      status: r.status
    })));
    
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Error testing profile update:', error);
    process.exit(1);
  }
}

testProfileUpdate();