import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import HoverGradientNavBar from '../ui/hover-gradient-nav-bar';
import { LogOut } from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-black">
      {/* Top Navigation */}
      <HoverGradientNavBar user={user} handleLogout={handleLogout} />

      {/* Main content */}
      <main className="flex-1 relative overflow-y-auto focus:outline-none bg-black pt-20">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;