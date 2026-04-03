const { CalendarEvent, sequelize } = require('./models');

async function testCalendarEvent() {
  try {
    console.log('Testing CalendarEvent model...');
    
    // Sync the table
    await CalendarEvent.sync({ force: true });
    console.log('✅ CalendarEvent table synced');
    
    // Test creating an event
    const testEvent = await CalendarEvent.create({
      studentId: 1,
      title: 'Test Event',
      description: 'Test Description',
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
      color: 'blue',
      category: 'Personal',
      tags: ['test']
    });
    
    console.log('✅ Test event created:', testEvent.id);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

testCalendarEvent();