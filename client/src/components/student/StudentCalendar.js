import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/apiService';
import { EventManager } from '../ui/event-manager';
import { motion } from 'framer-motion';
import Skeleton from '../ui/Skeleton';

const StudentCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendarData();

    window.refreshCalendar = fetchCalendarData;

    return () => {
      delete window.refreshCalendar;
    };
  }, []);

  const fetchCalendarData = async () => {
    try {
      const response = await studentService.getRegisteredCompanies();
      const registeredCompanies = response.data || [];

      const placementEdits = JSON.parse(localStorage.getItem('placementEdits') || '{}');
      const deletedPlacements = JSON.parse(localStorage.getItem('deletedPlacements') || '[]');

      const placementEvents = registeredCompanies
        .filter(company => company.visitDate && !deletedPlacements.includes(`placement_${company.id}`))
        .map(company => {
          const visitDate = new Date(company.visitDate);
          const endDate = new Date(visitDate);
          endDate.setHours(visitDate.getHours() + 4);

          const baseEvent = {
            id: `placement_${company.id}`,
            title: `🏢 ${company.name} - ${company.jobRole || 'Placement Drive'}`,
            description: `Package: ${company.package || 'Not specified'}\nLocation: ${company.location || 'Company Office'}\nType: ${company.type || 'General'}\nStatus: ✅ Registered`,
            startTime: new Date(visitDate),
            endTime: new Date(endDate),
            color: company.type === 'Super Dream' ? 'purple' : company.type === 'Dream' ? 'blue' : 'green',
            category: 'Placement Drive',
            tags: ['Work', 'Important', 'Registered', company.type || 'General'],
            isPlacementDrive: true
          };

          const eventId = `placement_${company.id}`;
          if (placementEdits[eventId]) {
            return { ...baseEvent, ...placementEdits[eventId] };
          }

          return baseEvent;
        });

      try {
        const personalEventsResponse = await studentService.getCalendarEvents();
        const personalEvents = (personalEventsResponse.data || []).map(event => ({
          ...event,
          startTime: new Date(event.startTime),
          endTime: new Date(event.endTime)
        }));

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
      const response = await studentService.createCalendarEvent(eventData);
      const newEvent = {
        ...response.data,
        startTime: new Date(response.data.startTime),
        endTime: new Date(response.data.endTime)
      };
      setEvents(prev => [...prev, newEvent]);
    } catch (error) {
      console.error('Error creating event:', error);
      alert(error.response?.data?.message || 'Failed to create event. Please try again.');
    }
  };

  const handleEventUpdate = async (id, eventData) => {
    if (id.toString().startsWith('placement_')) {
      const placementEdits = JSON.parse(localStorage.getItem('placementEdits') || '{}');
      placementEdits[id] = eventData;
      localStorage.setItem('placementEdits', JSON.stringify(placementEdits));

      setEvents(prev => prev.map(event =>
        event.id === id ? { ...event, ...eventData } : event
      ));
      return;
    }

    try {
      await studentService.updateCalendarEvent(id, eventData);
      setEvents(prev => prev.map(event =>
        event.id === id ? { ...event, ...eventData } : event
      ));
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event. Please try again.');
    }
  };

  const handleEventDelete = async (id) => {
    if (id.toString().startsWith('placement_')) {
      const deletedPlacements = JSON.parse(localStorage.getItem('deletedPlacements') || '[]');
      deletedPlacements.push(id);
      localStorage.setItem('deletedPlacements', JSON.stringify(deletedPlacements));

      setEvents(prev => prev.filter(event => event.id !== id));
      return;
    }

    try {
      await studentService.deleteCalendarEvent(id);
      setEvents(prev => prev.filter(event => event.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchCalendarData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="bg-white/10 shadow-2xl rounded-xl p-8 h-[500px] relative overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4"
    >
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
    </motion.div>
  );
};

export default StudentCalendar;