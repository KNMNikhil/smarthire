import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import HoverGradientNavBar from '../ui/hover-gradient-nav-bar';
import AdminBottomNavBar from '../ui/AdminBottomNavBar';
import AdminMobileSidebar from '../ui/AdminMobileSidebar';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-black">
      {/* Top Navigation - Hidden on mobile */}
      <div className="hidden md:block">
        <HoverGradientNavBar user={user} handleLogout={handleLogout} />
      </div>

      {/* Mobile Sidebar */}
      <AdminMobileSidebar user={user} handleLogout={handleLogout} />

      {/* Main content */}
      <main className="flex-1 relative overflow-y-auto focus:outline-none bg-black pt-4 md:pt-20 pb-20 md:pb-4">
        <div className="py-4 md:py-6">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <AdminBottomNavBar />
    </div>
  );
};

export default AdminLayout;