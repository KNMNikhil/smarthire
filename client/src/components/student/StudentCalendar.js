import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/apiService';
import { calendarService } from '../../services/calendarService';
import { EventManager } from '../ui/event-manager';

const StudentCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    try {
      // Fetch placement drives
      const response = await studentService.getInbox();
      const companies = response.data.eligibleCompanies || [];
      
      // Get saved edits and deletions from localStorage
      const placementEdits = JSON.parse(localStorage.getItem('placementEdits') || '{}');
      const deletedPlacements = JSON.parse(localStorage.getItem('deletedPlacements') || '[]');
      
      // Convert companies to calendar events
      const placementEvents = companies
        .filter(company => !deletedPlacements.includes(`placement_${company.id}`))
        .map(company => {
          const visitDate = new Date(company.visitDate);
          const endDate = new Date(visitDate);
          endDate.setHours(visitDate.getHours() + 2);
          
          const baseEvent = {
            id: `placement_${company.id}`,
            title: `${company.name} - ${company.jobRole}`,
            description: `Package: ${company.package || 'Not specified'}\nLocation: ${company.location || 'Not specified'}`,
            startTime: new Date(visitDate),
            endTime: new Date(endDate),
            color: 'blue',
            category: 'Placement Drive',
            tags: ['Work', 'Important'],
            isPlacementDrive: true
          };
          
          // Apply saved edits if any
          const eventId = `placement_${company.id}`;
          if (placementEdits[eventId]) {
            return { ...baseEvent, ...placementEdits[eventId] };
          }
          
          return baseEvent;
        });

      // Fetch personal calendar events
      try {
        const personalEventsResponse = await calendarService.getEvents();
        const personalEvents = (personalEventsResponse.events || []).map(event => ({
          ...event,
          startTime: new Date(event.startTime),
          endTime: new Date(event.endTime)
        }));
        
        // Combine placement drives and personal events
        setEvents([...placementEvents, ...personalEvents]);
      } catch (personalError) {
        console.log('No personal events found, showing only placement drives');
        setEvents(placementEvents);
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventCreate = async (eventData) => {
    try {
      const response = await calendarService.createEvent(eventData);
      if (response.success) {
        // Add the new event to the local state
        setEvents(prev => [...prev, response.event]);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    }
  };

  const handleEventUpdate = async (id, eventData) => {
    if (id.startsWith('placement_')) {
      // For placement drive events, save to localStorage
      const placementEdits = JSON.parse(localStorage.getItem('placementEdits') || '{}');
      placementEdits[id] = eventData;
      localStorage.setItem('placementEdits', JSON.stringify(placementEdits));
      
      setEvents(prev => prev.map(event => 
        event.id === id ? { ...event, ...eventData } : event
      ));
      return;
    }
    
    try {
      const response = await calendarService.updateEvent(id, eventData);
      if (response.success) {
        setEvents(prev => prev.map(event => 
          event.id === id ? { ...event, ...eventData } : event
        ));
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event. Please try again.');
    }
  };

  const handleEventDelete = async (id) => {
    if (id.startsWith('placement_')) {
      // For placement drive events, mark as deleted in localStorage
      const deletedPlacements = JSON.parse(localStorage.getItem('deletedPlacements') || '[]');
      deletedPlacements.push(id);
      localStorage.setItem('deletedPlacements', JSON.stringify(deletedPlacements));
      
      setEvents(prev => prev.filter(event => event.id !== id));
      return;
    }
    
    try {
      const response = await calendarService.deleteEvent(id);
      if (response.success) {
        setEvents(prev => prev.filter(event => event.id !== id));
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  const restoreDeletedPlacement = (placementId) => {
    const deletedPlacements = JSON.parse(localStorage.getItem('deletedPlacements') || '[]');
    const updatedDeleted = deletedPlacements.filter(id => id !== placementId);
    localStorage.setItem('deletedPlacements', JSON.stringify(updatedDeleted));
    fetchCalendarData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <EventManager
        events={events}
        onEventCreate={handleEventCreate}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
        categories={['Placement Drive', 'Interview', 'Meeting', 'Personal']}
        availableTags={['Important', 'Urgent', 'Work', 'Personal', 'Interview']}
        defaultView="month"
        className="text-white"
      />
    </div>
  );
};

export default StudentCalendar;