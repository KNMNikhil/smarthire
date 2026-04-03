import React, { useEffect, useState } from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';

const SuccessAnimation = ({ isVisible, onComplete, companyName }) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowAnimation(true);
      const timer = setTimeout(() => {
        setShowAnimation(false);
        setTimeout(onComplete, 300);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
      showAnimation ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* Success Animation */}
      <div className={`relative transform transition-all duration-500 ${
        showAnimation ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
      }`}>
        <div className="bg-gradient-to-br from-green-600/90 to-emerald-600/90 backdrop-blur-md border border-green-400/30 rounded-2xl p-8 text-center shadow-2xl">
          {/* Animated Check Circle */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <CheckCircle className="w-12 h-12 text-white animate-bounce" />
            </div>
            
            {/* Sparkles Animation */}
            <div className="absolute -top-2 -right-2 animate-ping">
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </div>
            <div className="absolute -bottom-2 -left-2 animate-ping delay-300">
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </div>
            <div className="absolute top-0 left-0 animate-ping delay-700">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
          </div>
          
          {/* Success Message */}
          <h3 className="text-2xl font-bold text-white mb-2">
            🎉 Registration Successful!
          </h3>
          <p className="text-green-100 text-lg mb-4">
            You're now registered for
          </p>
          <p className="text-white text-xl font-semibold mb-4">
            {companyName}
          </p>
          
          {/* Additional Info */}
          <div className="bg-white/10 rounded-lg p-4 text-sm text-green-100">
            <p className="mb-2">📧 Check your email for confirmation</p>
            <p>📅 Mark your calendar for the placement drive</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessAnimation;