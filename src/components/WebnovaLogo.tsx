import React from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only' | 'stacked';
  showGoogleBadge?: boolean;
  onGooglePreviewClick?: () => void;
}

export const WebnovaLogo: React.FC<LogoProps> = ({
  className = '',
  showTagline = false,
  size = 'md',
  variant = 'full',
  showGoogleBadge = false,
  onGooglePreviewClick,
}) => {
  const iconSizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const textSizes = {
    xs: 'text-base',
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const badgeIcon = (
    <div className={`relative ${iconSizes[size]} flex-shrink-0 flex items-center justify-center group`}>
      {/* Outer Atmospheric Cyan Glow for Ultimate Visibility in Dark & Light Modes */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/30 via-blue-500/30 to-indigo-500/30 blur-md opacity-80 group-hover:opacity-100 transition-opacity" />

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full drop-shadow-[0_4px_16px_rgba(56,189,248,0.45)] transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          {/* Deep Cosmic Foundation with Inner Light Glow */}
          <linearGradient id="wnDarkBg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0B132B" />
            <stop offset="50%" stopColor="#0E1E38" />
            <stop offset="100%" stopColor="#060B18" />
          </linearGradient>

          {/* Luminous Neon Cyan-to-Blue Border */}
          <linearGradient id="wnNeonBorder" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          {/* Radiant Cosmic Orbital Swoosh with High-Luminosity Gradient */}
          <linearGradient id="wnOrbitGlow" x1="12" y1="78" x2="88" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284C7" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#38BDF8" />
            <stop offset="80%" stopColor="#7DD3FC" />
            <stop offset="100%" stopColor="#BAE6FD" />
          </linearGradient>

          {/* Luminous High-Light W Stem 1 (Left): Radiant White into Electric Cyan */}
          <linearGradient id="wnWStem1" x1="18" y1="26" x2="48" y2="76" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#E0F2FE" />
            <stop offset="70%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          {/* Luminous High-Light W Stem 2 (Right): Electric Cyan into Vivid Sky */}
          <linearGradient id="wnWStem2" x1="48" y1="26" x2="82" y2="76" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="45%" stopColor="#60A5FA" />
            <stop offset="85%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>

          {/* High-Gloss Radial Highlight for 3D Glass Light Depth */}
          <radialGradient id="wnGlassReflect" cx="50%" cy="20%" r="60%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#0284C7" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Nova Star Glow */}
          <radialGradient id="wnStarAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#0284C7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Base Squircle Container */}
        <rect
          x="3.5"
          y="3.5"
          width="93"
          height="93"
          rx="24"
          fill="url(#wnDarkBg)"
          stroke="url(#wnNeonBorder)"
          strokeWidth="3.2"
        />

        {/* Gloss Lighting Reflection Overlay */}
        <rect
          x="5"
          y="5"
          width="90"
          height="90"
          rx="22"
          fill="url(#wnGlassReflect)"
        />

        {/* Subtle Inner Neon Bevel */}
        <rect
          x="6.5"
          y="6.5"
          width="87"
          height="87"
          rx="20.5"
          fill="none"
          stroke="#38BDF8"
          strokeWidth="1"
          strokeOpacity="0.4"
        />

        {/* Dynamic Celestial Orbit Ring (Intertwined around 'W') */}
        <path
          d="M 12 65 C 10 79, 44 87, 72 76 C 88 70, 93 56, 88 42 C 84 28, 68 20, 50 19"
          stroke="url(#wnOrbitGlow)"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Background Orbit Arc Shadow for Layered Depth */}
        <path
          d="M 14 62 C 18 73, 46 80, 70 71"
          stroke="#000000"
          strokeWidth="3"
          strokeOpacity="0.3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Radiant Stylized Iconic 'W' - Left Wing with Brilliant Light */}
        <path
          d="M 21 28 L 35 74 L 50 38 L 65 74 L 79 28"
          stroke="url(#wnWStem1)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Dynamic Right Wing Overlay for Vivid Luminescence */}
        <path
          d="M 50 38 L 65 74 L 79 28"
          stroke="url(#wnWStem2)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Center High-Light Glow Core on the 'W' */}
        <path
          d="M 35 74 L 50 38 L 65 74"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeOpacity="0.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Glowing Nova Star Apex Aura (Top Right Orbit - Exactly as in user screenshot) */}
        <circle cx="78" cy="22" r="11" fill="url(#wnStarAura)" />

        {/* 4-Point Nova Starburst (Symbol of WEBNOVA) */}
        <path
          d="M 78 12 Q 78 22, 68 22 Q 78 22, 78 32 Q 78 22, 88 22 Q 78 22, 78 12 Z"
          fill="#38BDF8"
        />
        <path
          d="M 78 15 Q 78 22, 71 22 Q 78 22, 78 29 Q 78 22, 85 22 Q 78 22, 78 15 Z"
          fill="#FFFFFF"
        />

        {/* Brilliant Nova Core Dot */}
        <circle cx="78" cy="22" r="2.5" fill="#FFFFFF" />

        {/* Satellite Micro-Orbit Accent Dot */}
        <circle cx="16" cy="58" r="2.5" fill="#38BDF8" />
      </svg>
    </div>
  );

  if (variant === 'icon-only') {
    return badgeIcon;
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {badgeIcon}
        <div className="mt-3 flex flex-col items-center">
          <span className={`font-extrabold tracking-widest ${textSizes[size]} text-slate-900 dark:text-white font-heading`}>
            WEB<span className="text-blue-600 dark:text-sky-400">NOVA</span>
          </span>
          {showTagline && (
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400 mt-1">
              Digital Marketing &amp; Web Agency
            </span>
          )}
          {showGoogleBadge && (
            <button
              onClick={onGooglePreviewClick}
              type="button"
              className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 dark:text-sky-300 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 rounded-full border border-blue-200 dark:border-sky-800 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
              <span>Google Search Preview</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {badgeIcon}

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`font-extrabold tracking-tight ${textSizes[size]} text-slate-900 dark:text-white font-heading`}>
            WEB<span className="text-blue-600 dark:text-sky-400">NOVA</span>
          </span>

          {showGoogleBadge && (
            <button
              onClick={onGooglePreviewClick}
              type="button"
              title="Click to view Google Search SERP Preview"
              aria-label="View Google Search preview"
              className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 rounded-full border border-emerald-200 dark:border-emerald-800 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Google Verified
            </button>
          )}
        </div>

        {showTagline && (
          <span className="text-[10px] font-medium tracking-wider uppercase text-slate-500 dark:text-slate-400 -mt-0.5">
            Modern Websites &amp; Digital Growth
          </span>
        )}
      </div>
    </div>
  );
};
