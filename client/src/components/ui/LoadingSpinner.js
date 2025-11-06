import React from 'react';

export default function LoadingSpinner({
  size = "md",
  text = "Loading...",
  className = "",
}) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin`}></div>
      {text && (
        <div className="mt-4 text-purple-600 text-sm font-medium">
          {text}
        </div>
      )}
    </div>
  );
}