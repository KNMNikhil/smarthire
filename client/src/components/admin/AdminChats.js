import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Users, Megaphone, Bell } from 'lucide-react';

const AdminChats = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState({
    title: '',
    message: '',
    type: 'broadcast',
    recipients: 'All Students'
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:9000/api/admin/messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    const message = {
      id: messages.length + 1,
      ...newMessage,
      sentAt: new Date().toISOString().split('T')[0]
    };
    setMessages([message, ...messages]);
    setNewMessage({
      title: '',
      message: '',
      type: 'broadcast',
      recipients: 'All Students'
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'broadcast': return <Megaphone className="h-5 w-5 text-blue-600" />;
      case 'announcement': return <Bell className="h-5 w-5 text-green-600" />;
      case 'reminder': return <MessageSquare className="h-5 w-5 text-orange-600" />;
      default: return <MessageSquare className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'broadcast': return 'bg-blue-100 text-blue-800';
      case 'announcement': return 'bg-green-100 text-green-800';
      case 'reminder': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-2 pt-0">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Broadcast Messages</h1>
        <p className="text-gray-400">Send announcements and messages to students</p>
      </div>

      {/* Send New Message */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-8">
        <h2 className="text-xl font-semibold text-white mb-6">Send New Message</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={newMessage.title}
                onChange={(e) => setNewMessage({...newMessage, title: e.target.value})}
                placeholder="Message title"
                className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <select
                value={newMessage.type}
                onChange={(e) => setNewMessage({...newMessage, type: e.target.value})}
                className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              >
                <option value="broadcast">Broadcast</option>
                <option value="announcement">Announcement</option>
                <option value="reminder">Reminder</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Recipients</label>
            <select
              value={newMessage.recipients}
              onChange={(e) => setNewMessage({...newMessage, recipients: e.target.value})}
              className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            >
              <option value="All Students">All Students</option>
              <option value="Final Year Students">Final Year Students</option>
              <option value="Registered Students">Registered Students</option>
              <option value="Placed Students">Placed Students</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
            <textarea
              value={newMessage.message}
              onChange={(e) => setNewMessage({...newMessage, message: e.target.value})}
              placeholder="Type your message here..."
              rows="4"
              className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.title || !newMessage.message}
            className="bg-purple-600/80 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all duration-200"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </button>
        </div>
      </div>

      {/* Message History */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-8">
        <h2 className="text-xl font-semibold text-white mb-6">Message History</h2>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="bg-white/8 backdrop-blur-sm border border-gray-400/20 shadow-lg shadow-black/25 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="text-purple-400">{getTypeIcon(message.type)}</div>
                    <h3 className="text-lg font-semibold text-white">{message.title}</h3>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                      {message.type}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 mb-3">{message.message}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Sent to: <span className="text-white ml-1">{message.recipients}</span>
                    </div>
                    <div>
                      Sent on: {new Date(message.sentAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminChats;