import React from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon-only';
}

export const WebnovaLogo: React.FC<LogoProps> = ({
  className = '',
  showTagline = false,
  size = 'md',
  variant = 'full',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Radiant Luminous Light Logo Badge (Ultra-high visibility across dark & light modes) */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_4px_12px_rgba(37,99,235,0.25)] transition-transform duration-300 hover:scale-105"
        >
          <defs>
            {/* Crisp Radiant Light Squircle Background */}
            <linearGradient id="logoBgGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#E0F2FE" />
            </linearGradient>

            {/* Vibrant Cyan-to-Blue Tech Border */}
            <linearGradient id="logoBorderGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>

            {/* Orbit Arc Gradient */}
            <linearGradient id="logoOrbitGrad" x1="10" y1="80" x2="90" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#93C5FD" />
            </linearGradient>

            {/* Main 'W' Left Wing: Royal Blue to Vivid Blue */}
            <linearGradient id="logoWGrad1" x1="20" y1="25" x2="50" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="40%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>

            {/* Main 'W' Right Wing: Vivid Blue to Electric Cyan */}
            <linearGradient id="logoWGrad2" x1="50" y1="25" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="50%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>

          {/* Luminous Light Squircle Base */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="24"
            fill="url(#logoBgGrad)"
            stroke="url(#logoBorderGrad)"
            strokeWidth="3"
          />

          {/* High-Gloss Inner Glass Ring */}
          <rect
            x="6.5"
            y="6.5"
            width="87"
            height="87"
            rx="21.5"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.8"
          />

          {/* Planetary Orbit Arc */}
          <path
            d="M 14 62 C 14 78, 50 86, 76 74 C 88 68, 92 56, 88 44 C 84 32, 70 24, 54 22"
            stroke="url(#logoOrbitGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Bold Geometric Modern 'W' */}
          <path
            d="M 22 28 L 36 74 L 50 38 L 64 74 L 78 28"
            stroke="url(#logoWGrad1)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Dynamic Right Wing Gradient Overlay */}
          <path
            d="M 50 38 L 64 74 L 78 28"
            stroke="url(#logoWGrad2)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Starburst Aura */}
          <circle cx="80" cy="20" r="9" fill="#38BDF8" fillOpacity="0.35" />

          {/* 4-Point Nova Starburst (Symbol of WEBNOVA) */}
          <path
            d="M 80 11 Q 80 20, 71 20 Q 80 20, 80 29 Q 80 20, 89 20 Q 80 20, 80 11 Z"
            fill="#0284C7"
          />
          <path
            d="M 80 14 Q 80 20, 74 20 Q 80 20, 80 26 Q 80 20, 86 20 Q 80 20, 80 14 Z"
            fill="#38BDF8"
            className="animate-pulse"
          />
          <circle cx="80" cy="20" r="1.5" fill="#FFFFFF" />

          {/* Orbit Particle Accent */}
          <circle cx="17" cy="56" r="2" fill="#0284C7" />
        </svg>
      </div>

      {variant === 'full' && (
        <div className="flex flex-col">
          <div className="flex items-center tracking-tight">
            <span className={`font-extrabold ${textSizes[size]} text-slate-900 dark:text-white font-heading`}>
              WEB<span className="text-blue-600 dark:text-sky-400">NOVA</span>
            </span>
          </div>
          {showTagline && (
            <span className="text-[10px] font-medium tracking-wider uppercase text-slate-500 dark:text-slate-400 -mt-1">
              Modern Websites. Better Business.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
