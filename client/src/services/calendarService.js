import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const calendarService = {
  // Get all calendar events for the logged-in student
  getEvents: async () => {
    try {
      const response = await axios.get(`${API_URL}/calendar/events`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create a new calendar event
  createEvent: async (eventData) => {
    try {
      const response = await axios.post(`${API_URL}/calendar/events`, eventData, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update an existing calendar event
  updateEvent: async (eventId, eventData) => {
    try {
      const response = await axios.put(`${API_URL}/calendar/events/${eventId}`, eventData, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete a calendar event
  deleteEvent: async (eventId) => {
    try {
      const response = await axios.delete(`${API_URL}/calendar/events/${eventId}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};