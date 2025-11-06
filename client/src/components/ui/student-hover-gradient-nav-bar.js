import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Home, Inbox, Calendar, MessageSquare, Users, HelpCircle, User, LogOut } from 'lucide-react';

const menuItems = [
  { icon: <Home className="h-5 w-5" />, label: "Dashboard", href: "/student/dashboard", gradient: "radial-gradient(circle, rgba(147,51,234,0.4) 0%, rgba(126,34,206,0.2) 50%, rgba(88,28,135,0) 100%)" },
  { icon: <Inbox className="h-5 w-5" />, label: "Inbox", href: "/student/inbox", gradient: "radial-gradient(circle, rgba(147,51,234,0.4) 0%, rgba(126,34,206,0.2) 50%, rgba(88,28,135,0) 100%)" },
  { icon: <Calendar className="h-5 w-5" />, label: "Calendar", href: "/student/calendar", gradient: "radial-gradient(circle, rgba(147,51,234,0.4) 0%, rgba(126,34,206,0.2) 50%, rgba(88,28,135,0) 100%)" },
  { icon: <MessageSquare className="h-5 w-5" />, label: "Chats", href: "/student/chats", gradient: "radial-gradient(circle, rgba(147,51,234,0.4) 0%, rgba(126,34,206,0.2) 50%, rgba(88,28,135,0) 100%)" },
  { icon: <Users className="h-5 w-5" />, label: "Alumni", href: "/student/alumni", gradient: "radial-gradient(circle, rgba(147,51,234,0.4) 0%, rgba(126,34,206,0.2) 50%, rgba(88,28,135,0) 100%)" },
  { icon: <HelpCircle className="h-5 w-5" />, label: "Queries", href: "/student/queries", gradient: "radial-gradient(circle, rgba(147,51,234,0.4) 0%, rgba(126,34,206,0.2) 50%, rgba(88,28,135,0) 100%)" },
  { icon: <User className="h-5 w-5" />, label: "Profile", href: "/student/profile", gradient: "radial-gradient(circle, rgba(147,51,234,0.4) 0%, rgba(126,34,206,0.2) 50%, rgba(88,28,135,0) 100%)" },
];

const itemVariants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
};

const backVariants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
};

const sharedTransition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  duration: 0.5,
};

function StudentHoverGradientNavBar({ user, handleLogout }) {
  const location = useLocation();
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <motion.nav
        className="w-full px-4 py-3 mr-4 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-xl relative"
        initial="initial"
        whileHover="hover"
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/REC.png" alt="REC Logo" className="h-10 w-auto" />
          </div>

          {/* Navigation Items */}
          <ul className="flex items-center gap-2 relative z-10">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
            <motion.li key={item.label} className="relative flex-1 md:flex-none">
              <motion.div
                className="block rounded-xl md:rounded-2xl overflow-visible group relative"
                style={{ perspective: "600px" }}
                whileHover={isActive ? "initial" : "hover"}
                initial="initial"
              >
                <div
                  className="absolute inset-0 z-0 pointer-events-none rounded-xl md:rounded-2xl"
                  style={{
                    background: item.gradient,
                    opacity: isActive ? 0.8 : 0,
                  }}
                />
                {isActive ? (
                  <Link to={item.href}>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-2 px-2 py-1.5 md:px-4 md:py-2 relative z-10 bg-transparent transition-colors rounded-xl md:rounded-2xl text-xs md:text-sm">
                      <span className="transition-colors duration-300 text-purple-400">
                        {item.icon}
                      </span>
                      <span className="hidden md:inline font-medium text-purple-400">{item.label}</span>
                    </div>
                  </Link>
                ) : (
                  <>
                    <Link to={item.href}>
                      <motion.div
                        className="flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-2 px-2 py-1.5 md:px-4 md:py-2 relative z-10 bg-transparent text-white/70 hover:text-white transition-colors rounded-xl md:rounded-2xl text-xs md:text-sm"
                        variants={itemVariants}
                        transition={sharedTransition}
                        style={{
                          transformStyle: "preserve-3d",
                          transformOrigin: "center bottom"
                        }}
                      >
                        <span className="transition-colors duration-300 text-white/70 group-hover:text-white">
                          {item.icon}
                        </span>
                        <span className="hidden md:inline font-medium text-white/70 group-hover:text-white">{item.label}</span>
                      </motion.div>
                    </Link>
                    <Link to={item.href}>
                      <motion.div
                        className="flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-2 px-2 py-1.5 md:px-4 md:py-2 absolute inset-0 z-10 bg-transparent transition-colors rounded-xl md:rounded-2xl text-xs md:text-sm"
                        variants={backVariants}
                        transition={sharedTransition}
                        style={{
                          transformStyle: "preserve-3d",
                          transformOrigin: "center top",
                          transform: "rotateX(90deg)"
                        }}
                      >
                        <span className="transition-colors duration-300 text-white/70 group-hover:text-white">
                          {item.icon}
                        </span>
                        <span className="hidden md:inline font-medium text-white/70 group-hover:text-white">{item.label}</span>
                      </motion.div>
                    </Link>
                  </>
                )}
              </motion.div>
            </motion.li>
          );
          })}
          </ul>

          {/* User & Logout */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="text-white/70 hover:text-white flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </motion.nav>
    </div>
  );
}

export default StudentHoverGradientNavBar;