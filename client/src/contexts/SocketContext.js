import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000');
      
      newSocket.on('connect', () => {
        console.log('Connected to server');
        newSocket.emit('join', user);
      });

      newSocket.on('newMessage', (message) => {
        setMessages(prev => [message, ...prev]);
      });

      newSocket.on('registrationStatusUpdate', (data) => {
        // Handle real-time registration updates
        console.log('Registration update:', data);
      });

      newSocket.on('newAnnouncement', (announcement) => {
        // Handle admin announcements
        console.log('New announcement:', announcement);
      });

      newSocket.on('userTyping', (data) => {
        // Handle typing indicators
        console.log('User typing:', data);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [isAuthenticated, user]);

  const sendMessage = (messageData) => {
    if (socket) {
      socket.emit('sendMessage', {
        ...messageData,
        sender: user.name || user.username,
        senderType: user.role
      });
    }
  };

  const sendRegistrationUpdate = (data) => {
    if (socket) {
      socket.emit('registrationUpdate', data);
    }
  };

  const sendAnnouncement = (announcement) => {
    if (socket) {
      socket.emit('adminAnnouncement', announcement);
    }
  };

  const value = {
    socket,
    messages,
    onlineUsers,
    sendMessage,
    sendRegistrationUpdate,
    sendAnnouncement
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};