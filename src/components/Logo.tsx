/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export default function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-20 h-20'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizes[size]} relative flex-shrink-0`}>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-pink-primary/20 blur-xl rounded-full" />
        
        {/* Main Logo Shape */}
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10"
        >
          {/* Main Circle Background */}
          <circle cx="50" cy="50" r="48" className="fill-pink-primary" />
          
          {/* Inner Light Circle */}
          <circle cx="50" cy="50" r="28" className="fill-pink-light" />
          
          {/* Vertical Petal / Eye Shape */}
          <path 
            d="M50 32C50 32 60 44 60 50C60 56 50 68 50 68C50 68 40 56 40 50C40 44 50 32 50 32Z" 
            className="fill-pink-primary"
          />
        </svg>
      </div>
      
      {showText && (
        <span className={`${textSizes[size]} font-bold tracking-tight text-gray-900`}>
          Luna
        </span>
      )}
    </div>
  );
}
