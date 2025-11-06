import React from 'react';
import { User } from 'lucide-react';

const AdminProfile = () => {
  return (
    <div className="space-y-8 p-2 pt-0">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/50 rounded-xl p-12 text-center">
        <div className="h-16 w-16 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-6">
          <User className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">Admin Profile</h3>
        <p className="text-gray-400 text-lg">
          Manage admin profile settings, change password, and update account information.
        </p>
      </div>
    </div>
  );
};

export default AdminProfile;