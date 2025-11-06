import React from 'react';
import { MessageSquare } from 'lucide-react';

const StudentChats = () => {
  return (
    <div className="space-y-8 p-2 pt-0">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-12 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Real-time Chat</h3>
        <p className="text-gray-400 text-lg">
          Chat functionality will be implemented with Socket.io for real-time communication with admin.
        </p>
      </div>
    </div>
  );
};

export default StudentChats;