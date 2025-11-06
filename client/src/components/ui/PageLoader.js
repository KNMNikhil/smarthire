import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoading } from '../../contexts/LoadingContext';
import LoadingSpinner from './LoadingSpinner';

export default function PageLoader({ children }) {
  const [routeLoading, setRouteLoading] = useState(false);
  const { isLoading } = useLoading();
  const location = useLocation();

  useEffect(() => {
    setRouteLoading(true);
    const timer = setTimeout(() => {
      setRouteLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="relative">
      {(isLoading || routeLoading) && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading..." />
        </div>
      )}
      {children}
    </div>
  );
}