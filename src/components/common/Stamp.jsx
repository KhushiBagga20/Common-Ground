import { useId } from 'react';

/**
 * A rubber stamp with text running around a circular path. The slightly
 * rough edge comes from a static displacement filter.
 */
export default function Stamp({ text, center, color = 'var(--orange)', size = 120, rotate = -12, className = '' }) {
  const uid = useId().replace(/:/g, '');
  const label = `${text.toUpperCase()} ✶ `;

  return (
    <svg
      viewBox="0 0 160 160"
      width={size}
      height={size}
      className={`stamp ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
    >
      <defs>
        <path id={`p${uid}`} d="M80 80 m-58 0 a58 58 0 1 1 116 0 a58 58 0 1 1 -116 0" />
        <filter id={`r${uid}`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" />
        </filter>
      </defs>
      <g filter={`url(#r${uid})`} opacity="0.92" style={{ color }}>
        <circle cx="80" cy="80" r="74" fill="none" stroke="currentColor" strokeWidth="5" />
        <circle cx="80" cy="80" r="44" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <text fill="currentColor" fontFamily="Space Mono, monospace" fontWeight={700} fontSize="12.5" letterSpacing="2.2">
          <textPath href={`#p${uid}`} textLength={2 * Math.PI * 58 - 6} lengthAdjust="spacing">
            {label.repeat(Math.max(1, Math.round(40 / label.length)))}
          </textPath>
        </text>
        <text x="80" y="86" textAnchor="middle" fill="currentColor" fontFamily="Silkscreen, Space Mono, monospace" fontSize="18">
          {center}
        </text>
      </g>
    </svg>
  );
}
