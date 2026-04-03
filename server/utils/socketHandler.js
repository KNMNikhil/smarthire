const { Chat } = require('../models');

const connectedUsers = new Map();

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', async (userData) => {
      socket.join(userData.role);
      socket.userData = userData;
      connectedUsers.set(socket.id, userData);
      console.log(`${userData.name} joined ${userData.role} room`);
      
      try {
        const messages = await Chat.findAll({
          order: [['createdAt', 'ASC']]
        });
        const formattedMessages = messages.map(m => ({
          id: m.id,
          senderId: m.senderId,
          sender: m.senderName,
          senderRole: m.senderRole,
          recipientId: m.recipientId,
          text: m.text,
          status: m.status,
          isBroadcast: m.isBroadcast || false,
          timestamp: m.createdAt
        }));
        console.log(`Sending ${formattedMessages.length} messages to ${userData.name}`);
        socket.emit('chatHistory', formattedMessages);
      } catch (error) {
        console.error('Error loading chat history:', error);
        socket.emit('chatHistory', []);
      }
      
      io.emit('userConnected', Array.from(connectedUsers.values()));
    });

    socket.on('sendMessage', async (messageData) => {
      try {
        const savedMessage = await Chat.create({
          senderId: messageData.senderId,
          senderName: messageData.sender,
          senderRole: messageData.senderRole,
          recipientId: messageData.recipientId || null,
          text: messageData.text,
          status: 'sent',
          isBroadcast: messageData.isBroadcast || false
        });

        const message = {
          id: savedMessage.id,
          senderId: savedMessage.senderId,
          sender: savedMessage.senderName,
          senderRole: savedMessage.senderRole,
          recipientId: savedMessage.recipientId,
          text: savedMessage.text,
          status: 'delivered',
          isBroadcast: savedMessage.isBroadcast,
          timestamp: savedMessage.createdAt,
          tempId: messageData.tempId
        };
        
        // Always broadcast to all connected users for real-time updates
        io.emit('message', message);
        
        // Update status to delivered
        await Chat.update({ status: 'delivered' }, { where: { id: savedMessage.id } });
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    socket.on('messageDelivered', async ({ messageId }) => {
      try {
        await Chat.update({ status: 'delivered' }, { where: { id: messageId } });
        io.emit('messageDelivered', { messageId });
      } catch (error) {
        console.error('Error updating message status:', error);
      }
    });

    socket.on('messageRead', async ({ messageId }) => {
      try {
        await Chat.update({ status: 'read' }, { where: { id: messageId } });
        io.emit('messageRead', { messageId });
      } catch (error) {
        console.error('Error updating message status:', error);
      }
    });

    socket.on('typing', (data) => {
      socket.broadcast.emit('typing', data);
    });

    socket.on('registrationUpdate', (data) => {
      socket.to('admin').emit('registrationStatusUpdate', data);
    });

    socket.on('adminAnnouncement', (announcement) => {
      socket.to('student').emit('newAnnouncement', announcement);
    });

    socket.on('disconnect', () => {
      connectedUsers.delete(socket.id);
      io.emit('userConnected', Array.from(connectedUsers.values()));
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

module.exports = socketHandler;