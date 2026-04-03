import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Upload, BarChart3, User } from 'lucide-react';

const navItems = [
    { icon: <LayoutDashboard className="h-6 w-6" />, label: "Dashboard", href: "/admin/dashboard" },
    { icon: <Users className="h-6 w-6" />, label: "Students", href: "/admin/students" },
    { icon: <Upload className="h-6 w-6" />, label: "Companies", href: "/admin/uploads" },
    { icon: <BarChart3 className="h-6 w-6" />, label: "Stats", href: "/admin/statistics" },
    { icon: <User className="h-6 w-6" />, label: "Profile", href: "/admin/profile" },
];

const AdminBottomNavBar = () => {
    const location = useLocation();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 px-4 py-2">
            <div className="flex items-center justify-between max-w-lg mx-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link key={item.label} to={item.href} className="relative flex flex-col items-center p-2">
                            <motion.div
                                animate={{
                                    scale: isActive ? 1.2 : 1,
                                    color: isActive ? '#3B82F6' : '#9CA3AF',
                                }}
                                className="relative z-10"
                            >
                                {item.icon}
                            </motion.div>
                            <span className={`text-[10px] mt-1 ${isActive ? 'text-blue-500 font-medium' : 'text-gray-400'}`}>
                                {item.label}
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="adminBottomNavBackground"
                                    className="absolute inset-0 bg-blue-500/10 rounded-xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default AdminBottomNavBar;
