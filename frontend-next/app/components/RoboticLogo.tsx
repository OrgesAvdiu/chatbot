'use client';

export default function RoboticLogo({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        {/* Metallic head gradient */}
        <linearGradient id="head-metal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#f5f7fa', stopOpacity: 1 }} />
          <stop offset="25%" style={{ stopColor: '#d4dce5', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#a0aab8', stopOpacity: 1 }} />
          <stop offset="75%" style={{ stopColor: '#7a8495', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#3a4555', stopOpacity: 1 }} />
        </linearGradient>

        {/* Deep shadow for dimension */}
        <linearGradient id="face-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#2a3a4f', stopOpacity: 1 }} />
          <stop offset="40%" style={{ stopColor: '#1a2a3f', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#0a1420', stopOpacity: 1 }} />
        </linearGradient>

        {/* Neon blue eye glow */}
        <radialGradient id="eye-glow-blue" cx="50%" cy="40%" r="50%">
          <stop offset="0%" style={{ stopColor: '#4da3ff', stopOpacity: 1 }} />
          <stop offset="60%" style={{ stopColor: '#2563eb', stopOpacity: 0.5 }} />
          <stop offset="100%" style={{ stopColor: '#1e40af', stopOpacity: 0.1 }} />
        </radialGradient>

        {/* Neon cyan accent */}
        <radialGradient id="cyan-accent" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: '#22d3ee', stopOpacity: 0.9 }} />
          <stop offset="80%" style={{ stopColor: '#06b6d4', stopOpacity: 0.2 }} />
          <stop offset="100%" style={{ stopColor: '#0891b2', stopOpacity: 0 }} />
        </radialGradient>

        {/* Outer aura glow */}
        <radialGradient id="aura-glow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" style={{ stopColor: '#4da3ff', stopOpacity: 0.6 }} />
          <stop offset="70%" style={{ stopColor: '#9b6bff', stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: '#4da3ff', stopOpacity: 0.05 }} />
        </radialGradient>

        {/* 3D shadow effect */}
        <filter id="depth-shadow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
          <feOffset dx="0" dy="8" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.35" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Neon glow effect */}
        <filter id="neon-glow-effect">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Inner light */}
        <filter id="inner-light">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
          <feComponentTransfer in="blur">
            <feFuncA type="linear" slope="0.7" />
          </feComponentTransfer>
        </filter>
      </defs>

      {/* Background neon aura */}
      <circle cx="80" cy="100" r="75" fill="url(#aura-glow)" opacity="0.5" />
      <circle cx="80" cy="100" r="75" fill="none" stroke="#4da3ff" strokeWidth="1" opacity="0.3" />

      {/* Main structure with 3D depth */}
      <g filter="url(#depth-shadow)">
        {/* Head shape - rounded rectangular face */}
        <path
          d="M 45 30 Q 30 30 30 50 L 30 150 Q 30 170 45 170 L 115 170 Q 130 170 130 150 L 130 50 Q 130 30 115 30 Z"
          fill="url(#head-metal)"
          stroke="#1a2a3f"
          strokeWidth="2.5"
        />

        {/* Face plate - inner metallic surface */}
        <path
          d="M 48 45 Q 35 45 35 60 L 35 155 Q 35 165 48 165 L 112 165 Q 125 165 125 155 L 125 60 Q 125 45 112 45 Z"
          fill="url(#face-shadow)"
          opacity="0.9"
        />

        {/* Left side dimension panel */}
        <path
          d="M 30 50 L 35 55 L 35 155 L 30 150 Z"
          fill="#0a1420"
          opacity="0.8"
        />

        {/* Right side dimension panel */}
        <path
          d="M 130 50 L 125 55 L 125 155 L 130 150 Z"
          fill="#0a1420"
          opacity="0.8"
        />

        {/* LEFT EYE - Advanced 3D */}
        <g>
          {/* Outer socket shadow */}
          <ellipse cx="55" cy="75" rx="16" ry="18" fill="#050a10" stroke="#1a2a3f" strokeWidth="2" />
          {/* Socket rim glow */}
          <ellipse cx="55" cy="75" rx="17" ry="19" fill="none" stroke="url(#eye-glow-blue)" strokeWidth="2" opacity="0.8" filter="url(#neon-glow-effect)" />
          {/* Inner dark lens */}
          <ellipse cx="55" cy="75" rx="12" ry="14" fill="#0f1920" />
          {/* Neon iris */}
          <ellipse cx="55" cy="78" rx="8" ry="10" fill="#4da3ff" filter="url(#inner-light)" />
          {/* Bright pupil highlight */}
          <circle cx="57" cy="75" r="4" fill="#7dd3fc" opacity="0.9" />
          {/* Gloss reflection */}
          <ellipse cx="59" cy="72" rx="2.5" ry="3" fill="#ffffff" opacity="0.7" />
          {/* Rim glow */}
          <circle cx="55" cy="75" r="13" fill="none" stroke="#22d3ee" strokeWidth="0.5" opacity="0.5" />
        </g>

        {/* RIGHT EYE - Mirrored */}
        <g>
          {/* Outer socket shadow */}
          <ellipse cx="105" cy="75" rx="16" ry="18" fill="#050a10" stroke="#1a2a3f" strokeWidth="2" />
          {/* Socket rim glow */}
          <ellipse cx="105" cy="75" rx="17" ry="19" fill="none" stroke="url(#eye-glow-blue)" strokeWidth="2" opacity="0.8" filter="url(#neon-glow-effect)" />
          {/* Inner dark lens */}
          <ellipse cx="105" cy="75" rx="12" ry="14" fill="#0f1920" />
          {/* Neon iris */}
          <ellipse cx="105" cy="78" rx="8" ry="10" fill="#4da3ff" filter="url(#inner-light)" />
          {/* Bright pupil highlight */}
          <circle cx="107" cy="75" r="4" fill="#7dd3fc" opacity="0.9" />
          {/* Gloss reflection */}
          <ellipse cx="109" cy="72" rx="2.5" ry="3" fill="#ffffff" opacity="0.7" />
          {/* Rim glow */}
          <circle cx="105" cy="75" r="13" fill="none" stroke="#22d3ee" strokeWidth="0.5" opacity="0.5" />
        </g>

        {/* CENTER NOSE BRIDGE - Vertical sensor */}
        <g>
          <rect x="77" y="60" width="6" height="35" rx="3" fill="url(#cyan-accent)" opacity="0.7" filter="url(#neon-glow-effect)" />
          <circle cx="80" cy="58" r="3" fill="#22d3ee" filter="url(#neon-glow-effect)" />
        </g>

        {/* MOUTH AREA - Neon accent line */}
        <g>
          {/* Upper mouth line */}
          <path
            d="M 50 115 Q 80 125 110 115"
            stroke="#4da3ff"
            strokeWidth="2.5"
            fill="none"
            opacity="0.7"
            filter="url(#neon-glow-effect)"
            strokeLinecap="round"
          />
          {/* Lower mouth line */}
          <path
            d="M 50 125 Q 80 130 110 125"
            stroke="#22d3ee"
            strokeWidth="1.5"
            fill="none"
            opacity="0.5"
            filter="url(#neon-glow-effect)"
            strokeLinecap="round"
          />
          {/* Mouth glow box */}
          <rect x="45" y="110" width="70" height="25" rx="6" fill="none" stroke="#9b6bff" strokeWidth="1" opacity="0.4" />
        </g>

        {/* CHIN DETAIL - Lower face accent */}
        <rect x="48" y="155" width="64" height="6" rx="3" fill="#4da3ff" opacity="0.5" filter="url(#neon-glow-effect)" />

        {/* LEFT CHEEK ACCENT */}
        <rect x="35" y="85" width="3" height="25" rx="1.5" fill="url(#eye-glow-blue)" opacity="0.6" filter="url(#neon-glow-effect)" />

        {/* RIGHT CHEEK ACCENT */}
        <rect x="122" y="85" width="3" height="25" rx="1.5" fill="url(#cyan-accent)" opacity="0.6" filter="url(#neon-glow-effect)" />

        {/* FOREHEAD ACCENT - Top strip */}
        <rect x="50" y="40" width="60" height="4" rx="2" fill="#9b6bff" opacity="0.5" filter="url(#neon-glow-effect)" />
      </g>

      {/* Animations */}
      <style>{`
        @keyframes face-glow {
          0%, 100% { filter: drop-shadow(0 0 4px #4da3ff); }
          50% { filter: drop-shadow(0 0 12px #4da3ff) drop-shadow(0 0 18px #9b6bff); }
        }
        
        @keyframes subtle-lift {
          0%, 100% { transform: translateY(0px) scaleY(1); }
          50% { transform: translateY(-3px) scaleY(1.01); }
        }
        
        @keyframes eye-blink {
          0%, 49%, 100% { opacity: 1; }
          50%, 51% { opacity: 0.3; }
        }
        
        svg {
          animation: subtle-lift 4s ease-in-out infinite, face-glow 3s ease-in-out infinite;
          transform-origin: center;
          will-change: transform, filter;
        }
        
        circle[r="75"] {
          animation: face-glow 3s ease-in-out infinite;
        }
        
        ellipse[cx="55"][cy="75"],
        ellipse[cx="105"][cy="75"] {
          animation: eye-blink 4s ease-in-out infinite;
        }
      `}</style>
    </svg>
  );
}



