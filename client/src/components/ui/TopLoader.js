import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function TopLoader() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
}