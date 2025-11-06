const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const eventsFile = path.join(__dirname, '../calendar-events.json');
let calendarEvents = [];
let nextEventId = 1;

const loadEvents = () => {
  try {
    if (fs.existsSync(eventsFile)) {
      const data = fs.readFileSync(eventsFile, 'utf8');
      const parsed = JSON.parse(data);
      calendarEvents = parsed.events || [];
      nextEventId = parsed.nextEventId || 1;
    }
  } catch (error) {
    console.error('Error loading calendar events:', error);
    calendarEvents = [];
    nextEventId = 1;
  }
};

const saveEvents = () => {
  try {
    const data = { events: calendarEvents, nextEventId };
    fs.writeFileSync(eventsFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving calendar events:', error);
  }
};

loadEvents();

// Get all calendar events for a student
router.get('/events', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || !token.startsWith('demo_token_student_')) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    const studentId = parseInt(token.replace('demo_token_student_', ''));
    const studentEvents = calendarEvents.filter(event => event.studentId === studentId);
    
    res.json({ success: true, events: studentEvents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new calendar event
router.post('/events', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || !token.startsWith('demo_token_student_')) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    const studentId = parseInt(token.replace('demo_token_student_', ''));
    const { title, description, startTime, endTime, color, category, tags } = req.body;
    
    const event = {
      id: nextEventId++,
      studentId,
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      color,
      category,
      tags: tags || [],
      createdAt: new Date()
    };
    
    calendarEvents.push(event);
    saveEvents();
    
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update a calendar event
router.put('/events/:id', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || !token.startsWith('demo_token_student_')) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    const studentId = parseInt(token.replace('demo_token_student_', ''));
    const eventId = parseInt(req.params.id);
    const { title, description, startTime, endTime, color, category, tags } = req.body;
    
    const eventIndex = calendarEvents.findIndex(e => e.id === eventId && e.studentId === studentId);
    
    if (eventIndex === -1) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    calendarEvents[eventIndex] = {
      ...calendarEvents[eventIndex],
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      color,
      category,
      tags: tags || [],
      updatedAt: new Date()
    };
    
    saveEvents();
    res.json({ success: true, event: calendarEvents[eventIndex] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a calendar event
router.delete('/events/:id', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || !token.startsWith('demo_token_student_')) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    const studentId = parseInt(token.replace('demo_token_student_', ''));
    const eventId = parseInt(req.params.id);
    
    const eventIndex = calendarEvents.findIndex(e => e.id === eventId && e.studentId === studentId);
    
    if (eventIndex === -1) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    calendarEvents.splice(eventIndex, 1);
    saveEvents();
    
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;