import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, MessageSquare, HelpCircle, 
  Bell, History, LogOut 
} from 'lucide-react';

const AdminMobileSidebar = ({ user, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const sidebarItems = [
    { icon: <Bell className="h-5 w-5" />, label: "Updates", href: "/admin/updates" },
    { icon: <HelpCircle className="h-5 w-5" />, label: "Queries", href: "/admin/queries" },
    { icon: <MessageSquare className="h-5 w-5" />, label: "Chats", href: "/admin/chats" },
    { icon: <History className="h-5 w-5" />, label: "History", href: "/admin/history" },
  ];

  return (
    <>
      {/* Menu Button - Fixed top right */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 right-4 z-40 p-2 bg-blue-600 rounded-full shadow-lg"
      >
        <Menu className="h-6 w-6 text-white" />
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="md:hidden fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-gradient-to-br from-gray-900 via-black to-gray-900 border-l border-blue-500/20 z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-black/80 backdrop-blur-xl border-b border-blue-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">{user?.name || 'Admin'}</h3>
                  <p className="text-gray-400 text-sm">{user?.username}</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-2">
              {sidebarItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}

              {/* Logout Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all mt-4"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminMobileSidebar;
