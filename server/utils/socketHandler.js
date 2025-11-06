const { Message } = require('../models');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join user to their role-based room
    socket.on('join', (userData) => {
      socket.join(userData.role);
      socket.userData = userData;
      console.log(`${userData.name} joined ${userData.role} room`);
    });

    // Handle new messages
    socket.on('sendMessage', async (messageData) => {
      try {
        const message = await Message.create({
          sender: messageData.sender,
          senderType: messageData.senderType,
          message: messageData.message,
          type: messageData.type || 'general'
        });

        // Broadcast to all users
        io.emit('newMessage', message);
        console.log('Message broadcasted:', message.message);
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('messageError', { error: 'Failed to send message' });
      }
    });

    // Handle registration updates
    socket.on('registrationUpdate', (data) => {
      // Broadcast registration status updates to admin
      socket.to('admin').emit('registrationStatusUpdate', data);
    });

    // Handle admin announcements
    socket.on('adminAnnouncement', (announcement) => {
      // Broadcast to all students
      socket.to('student').emit('newAnnouncement', announcement);
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      socket.broadcast.emit('userTyping', {
        user: socket.userData?.name,
        isTyping: data.isTyping
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // Store io instance for use in routes
  return io;
};

module.exports = socketHandler;