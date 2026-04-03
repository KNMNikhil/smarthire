import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Calendar, ChevronRight } from 'lucide-react';
import io from 'socket.io-client';

const StudentChats = () => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://192.168.68.114:5000';
    const newSocket = io(serverUrl);
    setSocket(newSocket);

    newSocket.emit('join', { role: 'student', userId: user.id, name: user.name });

    newSocket.on('message', (message) => {
      // Only accept messages from admin
      if (message.senderRole === 'admin') {
        setMessages(prev => {
          // Avoid duplicates
          if (prev.some(m => m.id === message.id || m.tempId === message.tempId)) return prev;
          return [...prev, message];
        });
      }
    });

    newSocket.on('chatHistory', (history) => {
      // Filter only admin messages for history
      const adminMessages = history.filter(m => m.senderRole === 'admin');
      setMessages(adminMessages.map(m => ({ ...m, status: m.status || 'read' })));
    });

    return () => newSocket.close();
  }, [user.id, user.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const groupMessagesByDate = () => {
    const groups = {};
    const relevantMessages = messages.filter(m => {
      // Logic: Admin messages that are broadcasts OR sent specifically to this users
      // (Though user said 'send message to all students', keeping DM visibility logic in case legacy messages exist is safe, 
      // but primarily we expect broadcasts)
      if (m.senderRole !== 'admin') return false;
      return m.isBroadcast === true || m.recipientId === user.id || m.recipientId === null;
    });

    // Sort by timestamp
    relevantMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    relevantMessages.forEach(msg => {
      const date = formatDate(msg.timestamp);
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex h-screen bg-black text-gray-200 font-sans overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full border-x border-neutral-800 bg-black shadow-2xl">

        {/* Header */}
        <div className="bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/10 rounded-lg">
              <Bell className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Announcements</h1>
              <p className="text-gray-400 text-sm">Updates from Administration</p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search updates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-neutral-800/50 border border-neutral-700 text-gray-200 text-sm rounded-xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 block w-64 pl-10 p-2.5 transition-all placeholder-gray-500 hover:bg-neutral-800"
            />
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          {Object.keys(messageGroups).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-60 animate-fadeIn">
              <div className="p-4 bg-neutral-800 rounded-full mb-4">
                <Bell className="w-8 h-8" />
              </div>
              <p className="text-lg font-medium">No announcements yet</p>
              <p className="text-sm">Stay tuned for updates</p>
            </div>
          ) : (
            Object.entries(messageGroups).map(([date, msgs]) => (
              <div key={date} className="space-y-6 animate-fadeIn">

                {/* Date Divider */}
                <div className="flex items-center justify-center">
                  <div className="bg-neutral-800/60 backdrop-blur text-gray-400 text-xs font-semibold px-4 py-1.5 rounded-full border border-neutral-700/50 flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {date}
                  </div>
                </div>

                {/* Message Cards */}
                <div className="space-y-4">
                  {msgs
                    .filter(msg => msg.text.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((msg, index) => (
                      <div
                        key={index}
                        className="group relative bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-violet-500/30 rounded-2xl p-5 transition-all duration-300 shadow-sm hover:shadow-violet-500/10"
                      >
                        <div className="flex items-start gap-4">
                          {/* Avatar/Icon */}
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                              <span className="text-white font-bold text-lg">A</span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-white">Admin</h3>
                                {msg.isBroadcast && (
                                  <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 text-[10px] font-semibold border border-violet-500/20">
                                    Broadcast
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-500 font-medium">
                                {formatTime(msg.timestamp)}
                              </span>
                            </div>

                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                              {msg.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer - Read Only Indicator */}
        <div className="bg-neutral-900/90 border-t border-neutral-800 px-6 py-3">
          <div className="flex items-center justify-center gap-2 text-gray-500 text-xs font-medium">
            <span>📢 Official Communication Channel</span>
            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
            <span>Read Only</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentChats;
