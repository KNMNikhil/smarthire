import React, { useState, useEffect, useRef } from 'react';
import { Send, Check, CheckCheck, Search, Users, MoreVertical, Paperclip, Smile, MessageSquare, Megaphone, User } from 'lucide-react';
import io from 'socket.io-client';

const AdminChats = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);

  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://192.168.68.114:5000';
    const newSocket = io(serverUrl);
    setSocket(newSocket);

    newSocket.emit('join', { role: 'admin', userId: user.id, name: user.name });

    newSocket.on('message', (message) => {
      setMessages(prev => {
        if (prev.some(m => m.id === message.id || m.tempId === message.tempId)) return prev;
        // Only accept broadcast messages or messages sent by admin provided they are broadcasts
        if (message.isBroadcast) {
          return [...prev, { ...message, status: 'delivered' }];
        }
        return prev;
      });
    });

    newSocket.on('chatHistory', (history) => {
      // Filter history for only broadcast messages
      const broadcastHistory = history.filter(m => m.isBroadcast);
      setMessages(broadcastHistory.map(m => ({ ...m, status: m.status || 'read' })));
    });

    return () => newSocket.close();
  }, [user.id, user.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      const tempId = Date.now();
      const message = {
        tempId,
        text: newMessage,
        sender: user.name || 'Admin',
        senderRole: 'admin',
        senderId: user.id,
        recipientId: null, // Always null for broadcast
        isBroadcast: true, // Always true
        timestamp: new Date().toISOString(),
        status: 'sent'
      };
      setMessages(prev => [...prev, message]);
      socket.emit('sendMessage', message);
      setNewMessage('');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const groupMessagesByDate = () => {
    const groups = {};
    // Only show broadcast messages
    const filteredMsgs = messages.filter(m => m.isBroadcast);

    filteredMsgs.forEach(msg => {
      const date = formatDate(msg.timestamp);
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex h-screen bg-black overflow-hidden text-gray-200 font-sans">
      {/* Simplified Sidebar - Just Title/Info, no list */}
      <div className="w-80 bg-neutral-900 border-r border-neutral-800 flex flex-col shadow-xl z-20">
        <div className="p-6 bg-neutral-900 border-b border-neutral-800">
          <h2 className="text-white font-bold text-xl mb-4 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-violet-500" />
            Communication
          </h2>
          <p className="text-sm text-gray-500">
            Admin Communication Center
          </p>
        </div>

        <div className="p-4">
          <div className="bg-violet-600/10 border border-violet-600/20 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Megaphone className="w-5 h-5 text-violet-500" />
              <h3 className="font-semibold text-violet-200 text-sm">Announcements Mode</h3>
            </div>
            <p className="text-xs text-violet-300/70 leading-relaxed">
              You are in broadcast mode. Any message sent here will be delivered to <strong>all registered students</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-black relative">
        {/* Header */}
        <div className="bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg tracking-tight">
                Global Announcements
              </h2>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Broadcasting to all students
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {Object.keys(messageGroups).length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-60">
              <div className="w-20 h-20 bg-neutral-900 rounded-3xl flex items-center justify-center mb-6 rotate-12 border border-neutral-800">
                <MessageSquare className="w-10 h-10 text-violet-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-300 mb-2">No announcements yet</h3>
              <p className="text-sm max-w-xs text-center">
                Send an announcement to notify all registered students.
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8">
              {Object.entries(messageGroups).map(([date, msgs]) => (
                <div key={date}>
                  <div className="flex justify-center my-6">
                    <div className="bg-neutral-800/80 backdrop-blur text-gray-400 text-xs font-semibold px-3 py-1 rounded-full border border-neutral-700">
                      {date}
                    </div>
                  </div>
                  <div className="space-y-4">
                    {msgs.map((msg, index) => {
                      const isOwn = msg.senderRole === 'admin';
                      return (
                        <div key={index} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}>
                          <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'} flex gap-3`}>

                            <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                              <div
                                className={`rounded-2xl px-5 py-3.5 shadow-md text-sm leading-relaxed ${isOwn
                                  ? 'bg-violet-600 text-white rounded-br-none shadow-violet-500/20'
                                  : 'bg-neutral-800 text-gray-200 border border-neutral-700 rounded-bl-none'
                                  }`}
                              >
                                {msg.text}
                              </div>
                              <div className="flex items-center gap-1.5 mt-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] text-gray-500 font-medium">{formatTime(msg.timestamp)}</span>
                                {isOwn && (
                                  <span>
                                    <CheckCheck className="w-3 h-3 text-emerald-500" />
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-neutral-900 border-t border-neutral-800 p-4">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-center gap-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type an announcement to all students..."
              className="flex-1 bg-black border border-neutral-700 text-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 placeholder-gray-500 transition-all font-medium"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl p-3.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20 active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-center text-xs text-gray-500 mt-2">
            Messages sent here will be visible to <strong>all students</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminChats;
