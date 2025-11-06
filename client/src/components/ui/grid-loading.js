import React from 'react';
import { cn } from '../../lib/utils';

export default function UniqueLoading({
  variant = "squares",
  size = "md",
  text = "Loading...",
  className,
}) {
  const containerSizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  if (variant === "squares") {
    return (
      <div className={cn("relative", containerSizes[size], className)}>
        <div className="grid grid-cols-3 gap-1 w-full h-full">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-purple-600 dark:bg-purple-500 animate-pulse rounded-sm"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: "1.5s",
              }}
            />
          ))}
        </div>
        {text && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-purple-600 text-sm font-medium whitespace-nowrap">
            {text}
          </div>
        )}
      </div>
    );
  }

  return null;
}