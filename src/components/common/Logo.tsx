import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 40, showText = true, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 200 200" 
        className="shrink-0 transition-transform duration-300 hover:rotate-3"
        role="img"
        aria-label="Sawariya Tea Stall Logo - Best Kulhad Chai in Khatu Shyam Ji"
      >
        <defs>
          <linearGradient id="steamGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF9933" />
            <stop offset="100%" stopColor="#FFD700" />
          </linearGradient>
          <linearGradient id="cupGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4A2C20" />
            <stop offset="100%" stopColor="#2D1810" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#CC9900" />
          </linearGradient>
        </defs>

        {/* Outer Ring (Premium Branding) */}
        <circle cx="100" cy="100" r="90" fill="none" stroke="url(#goldGrad)" strokeWidth="4" />
        <circle cx="100" cy="100" r="84" fill="none" stroke="#4A2C20" strokeWidth="1" strokeDasharray="4,4" />

        {/* Steam forming "S" */}
        <path d="M90 85 C85 65 115 60 110 45 C105 30 80 35 100 15 C103 12 107 14 105 18 C93 30 115 28 118 42 C122 55 93 62 98 75 C100 81 92 84 90 85 Z" fill="url(#steamGrad)" opacity="0.95" />
        <path d="M96 85 C93 72 108 68 106 58 C104 48 90 50 100 35 C102 32 105 33 103 36 C95 44 110 42 111 52 C112 62 98 66 100 78 C101 82 98 84 96 85 Z" fill="url(#steamGrad)" opacity="0.6" />

        {/* Clay Tea Cup (Kulhad) */}
        <path d="M65 95 C65 95 62 140 70 145 C78 150 122 150 130 145 C138 140 135 95 135 95 Z" fill="url(#cupGrad)" stroke="url(#goldGrad)" strokeWidth="1.5" />
        
        {/* Cup Rim (Lip) */}
        <ellipse cx="100" cy="95" rx="35" ry="8" fill="#4A2C20" stroke="url(#goldGrad)" strokeWidth="2" />
        <ellipse cx="100" cy="95" rx="31" ry="5" fill="#2D1810" />

        {/* Tea Inside Cup */}
        <ellipse cx="100" cy="95" rx="30" ry="4" fill="#D4A574" />

        {/* Gold Decorative Patterns on Cup */}
        <path d="M72 110 Q100 120 128 110" fill="none" stroke="url(#goldGrad)" strokeWidth="2" />
        <path d="M74 125 Q100 135 126 125" fill="none" stroke="url(#goldGrad)" strokeDasharray="2,2" strokeWidth="1.5" />
      </svg>
      {showText && (
        <div className="text-left">
          <h1 className="font-heading text-base md:text-lg font-bold leading-none text-inherit group-hover:text-saffron transition-colors">
            साँवरिया <span className="text-saffron">टी स्टॉल</span>
          </h1>
          <p className="text-[8px] md:text-[9px] tracking-widest uppercase text-inherit/60 leading-none mt-1">
            Sawariya Tea Stall
          </p>
        </div>
      )}
    </div>
  );
}
