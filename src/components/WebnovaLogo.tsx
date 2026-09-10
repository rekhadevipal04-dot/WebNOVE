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
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Stylized W logo with orbit ring and star */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_8px_rgba(37,99,235,0.35)]"
        >
          <defs>
            <linearGradient id="webnovaGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <linearGradient id="ringGrad" x1="10" y1="80" x2="90" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="70%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#93C5FD" />
            </linearGradient>
          </defs>

          {/* Planetary Orbit Ring Behind & Around */}
          <path
            d="M 12 60 C 12 76, 50 84, 76 72 C 86 67, 92 56, 88 44 C 84 34, 72 26, 58 24"
            stroke="url(#ringGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Stylized Sharp 'W' with dynamic slant */}
          <path
            d="M 22 28 L 36 74 L 51 38 L 65 74 L 79 28"
            stroke="url(#webnovaGrad)"
            strokeWidth="8.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Star / Sparkle accent at the top right */}
          <path
            d="M 82 12 Q 82 22, 72 22 Q 82 22, 82 32 Q 82 22, 92 22 Q 82 22, 82 12 Z"
            fill="#38BDF8"
            className="animate-pulse"
          />
          <circle cx="82" cy="22" r="1.5" fill="#FFFFFF" />
        </svg>
      </div>

      {variant === 'full' && (
        <div className="flex flex-col">
          <div className="flex items-center tracking-tight">
            <span className={`font-extrabold ${textSizes[size]} text-slate-900 dark:text-white font-heading`}>
              WEB<span className="text-blue-600 dark:text-blue-400">NOVA</span>
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
