import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { Search, Heart, Compass, Plus } from 'lucide-react';
import PageCanvas from '../components/layout/PageCanvas';
import Smiley from '../components/common/Smiley';
import { hobbies } from '../data/hobbies';
import { communities } from '../data/communities';
import { staggerItem } from '../animations/variants';
import './Explore.css';

/* ==========================================================================
   1. BRAND CONSISTENT SUNFLOWER COMPONENT (12 PETALS + STEM + BLINK + CURSOR)
   ========================================================================== */

const EYE_RANGE = 6; // Max pupil offset in px

function EyeTrackingDaisy({ size = 64, className = "" }) {
  const svgRef = useRef(null);
  const [isBlinking, setIsBlinking] = useState(false);

  // Smooth springs for tracking coordinates
  const rawPupilX = useMotionValue(0);
  const rawPupilY = useMotionValue(0);
  const pupilX = useSpring(rawPupilX, { stiffness: 180, damping: 20 });
  const pupilY = useSpring(rawPupilY, { stiffness: 180, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const faceCX = rect.left + rect.width / 2;
      const faceCY = rect.top + rect.height / 2;
      
      const dx = e.clientX - faceCX;
      const dy = e.clientY - faceCY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0) {
        const t = Math.min(distance / 400, 1);
        rawPupilX.set((dx / distance) * t * EYE_RANGE);
        rawPupilY.set((dy / distance) * t * EYE_RANGE);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [rawPupilX, rawPupilY]);

  // Random blinking timer loop
  useEffect(() => {
    const blinkLoop = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
      const nextDelay = 3500 + Math.random() * 3000;
      return setTimeout(() => blinkLoop(), nextDelay);
    };
    const id = setTimeout(() => blinkLoop(), 2000);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className={`eye-tracking-flower-wrapper ${className}`} style={{ width: size, height: size }}>
      <svg
        ref={svgRef}
        className="sunflower-mascot__svg"
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Soft drop shadow behind flower */}
        <ellipse cx="160" cy="290" rx="60" ry="12" fill="rgba(0,0,0,0.05)" />

        {/* Green stem (behind petals) */}
        <path d="M160 215 Q158 270 148 312" stroke="var(--explore-mint)" strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M160 215 Q158 270 148 312" stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        
        {/* Leaves */}
        <path d="M156 250 Q110 240 120 220 Q140 225 156 250 Z" fill="var(--explore-mint)" stroke="#1A1A1A" strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M159 270 Q205 265 195 240 Q175 250 159 270 Z" fill="var(--explore-mint)" stroke="#1A1A1A" strokeWidth="3.5" strokeLinejoin="round" />

        {/* 12 Overlapping Petals matching Landing page styling */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const px = 160 + 74 * Math.sin(rad);
          const py = 160 - 74 * Math.cos(rad);
          return (
            <ellipse
              key={i}
              cx={px}
              cy={py}
              rx={22}
              ry={40}
              fill="#F8F4EC"
              stroke="#1A1A1A"
              strokeWidth="3.5"
              transform={`rotate(${deg}, ${px}, ${py})`}
            />
          );
        })}

        {/* Yellow Face Center */}
        <circle cx="160" cy="160" r="58" fill="var(--explore-yellow-sun)" stroke="#1A1A1A" strokeWidth="4" />

        {/* Eye whites */}
        <ellipse cx="142" cy="150" rx="12" ry="14" fill="white" stroke="#1A1A1A" strokeWidth="2.5" />
        <ellipse cx="178" cy="150" rx="12" ry="14" fill="white" stroke="#1A1A1A" strokeWidth="2.5" />

        {/* Dynamic Pupils */}
        <motion.ellipse
          cx="142"
          cy="150"
          rx={isBlinking ? 9 : 7.5}
          ry={isBlinking ? 2 : 9.5}
          fill="#1A1A1A"
          style={{ x: pupilX, y: pupilY }}
        />
        <motion.ellipse
          cx="178"
          cy="150"
          rx={isBlinking ? 9 : 7.5}
          ry={isBlinking ? 2 : 9.5}
          fill="#1A1A1A"
          style={{ x: pupilX, y: pupilY }}
        />

        {/* Eye highlight shines */}
        {!isBlinking && (
          <>
            <motion.circle cx="146" cy="145" r="3" fill="white" style={{ x: pupilX, y: pupilY }} />
            <motion.circle cx="182" cy="145" r="3" fill="white" style={{ x: pupilX, y: pupilY }} />
          </>
        )}

        {/* Cheeks Blush */}
        <ellipse cx="130" cy="173" rx="11" ry="7" fill="#F47B7B" opacity="0.45" />
        <ellipse cx="190" cy="173" rx="11" ry="7" fill="#F47B7B" opacity="0.45" />

        {/* Freckles */}
        <circle cx="123" cy="168" r="0.8" fill="#1A1A1A" opacity="0.4" />
        <circle cx="125" cy="171" r="0.8" fill="#1A1A1A" opacity="0.4" />
        <circle cx="195" cy="171" r="0.8" fill="#1A1A1A" opacity="0.4" />
        <circle cx="197" cy="168" r="0.8" fill="#1A1A1A" opacity="0.4" />

        {/* Smile */}
        <path d="M 140 175 Q 160 195 180 175" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" fill="none" />

        {/* Sparkles Floating around daisy */}
        <polygon points="45,45 48,50 45,55 42,50" fill="var(--explore-pink-soft)" />
        <polygon points="275,50 278,55 275,60 272,55" fill="var(--explore-yellow-soft)" />
        <polygon points="265,250 268,255 265,260 262,255" fill="var(--explore-lavender)" />
      </svg>
    </div>
  );
}

/* ==========================================================================
   2. CUSTOM BRAND SVG ILLUSTRATIONS
   ========================================================================== */

const PlantPotMascot = ({ size = 70, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={`svg-hand-drawn ${className}`}>
    <path d="M25 45 L55 45 L50 72 L30 72 Z" fill="var(--explore-pink-soft)" fillOpacity="0.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 40 L58 40 L56 45 L24 45 Z" fill="var(--explore-pink-soft)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="36" cy="56" r="1.5" fill="currentColor" />
    <circle cx="44" cy="56" r="1.5" fill="currentColor" />
    <path d="M38 62 Q40 64 42 62" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M40 40 Q40 22 46 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M40 35 Q30 25 24 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <path d="M40 30 Q54 26 60 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <path d="M46 12 C48 16 48 20 44 20 C40 20 41 15 46 12 Z" fill="var(--explore-mint)" stroke="currentColor" strokeWidth="1.5" />
    <path d="M24 20 C28 20 30 23 29 27 C25 27 23 24 24 20 Z" fill="var(--explore-mint)" stroke="currentColor" strokeWidth="1.5" />
    <path d="M60 18 C61 22 59 25 55 25 C52 24 53 20 60 18 Z" fill="var(--explore-mint)" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const PaperAirplane = ({ className = "" }) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className={`svg-hand-drawn ${className}`}>
    <path d="M34 6 L7 17.5 L19.5 21.5 L24 33.5 Z" fill="var(--explore-pink-soft)" fillOpacity="0.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19.5 21.5 L34 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M19.5 21.5 L22.5 25.5 L25.5 23.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SparkleStar = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={`svg-hand-drawn ${className}`}>
    <path d="M8 0 Q8 8 16 8 Q8 8 8 16 Q8 8 0 8 Q8 8 8 0 Z" fill="var(--explore-yellow-soft)" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* Outline Illustrated Icons */
const GridIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const PaintPaletteIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 4 C9.5 4 4.5 9 4.5 16 C4.5 23 9.5 28 16 28 C18.5 28 20.5 26.5 20.5 24.5 C20.5 23.5 19.5 22.5 19.5 21.5 C19.5 20 20.5 19 22 19 L25 19 C28.5 19 30.5 16 30.5 12.5 C30.5 7.5 24 4 16 4 Z" fill="var(--explore-pink-soft)" fillOpacity="0.4" />
    <circle cx="10" cy="12" r="2" fill="var(--explore-pink-accent)" />
    <circle cx="15" cy="9" r="2" fill="var(--explore-yellow-sun)" />
    <circle cx="21" cy="11" r="2" fill="var(--explore-blue)" />
    <circle cx="19" cy="17" r="2" fill="var(--explore-mint)" />
    <circle cx="11" cy="22" r="3" fill="var(--explore-surface)" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9 24 L27 8" stroke="currentColor" strokeWidth="2" />
    <path d="M25 10 L27 8" stroke="var(--explore-pink-accent)" strokeWidth="3" />
  </svg>
);

const GuitarIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 21 C5.5 17 9 14 12 16 C13.5 17 13.5 15 15 13 C16.5 11.5 14 8 18 6 C21 4.5 24 7.5 22 11 C20.5 13.5 21.5 13.5 21 15 C20 18 16.5 21.5 12 22 C9 22.5 8.5 22.5 7 21 Z" fill="var(--explore-yellow-soft)" fillOpacity="0.5" />
    <circle cx="16" cy="14" r="2" fill="currentColor" />
    <path d="M18 12 L26 4" stroke="currentColor" strokeWidth="2" />
    <rect x="25" y="2" width="4" height="3" rx="1" fill="currentColor" />
  </svg>
);

const SneakerIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 22 C5 15 7 11 11 11 L23 11 C25 11 27 13 27 16 L27 22 Q27 24 25 24 L7 24 Q5 24 5 22 Z" fill="var(--explore-mint)" fillOpacity="0.4" />
    <path d="M5 21 L27 21" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 11 L14 15 L16 11 M15 15 L17 19 L19 15" stroke="currentColor" strokeWidth="1.5" />
    <path d="M22 11 Q25 15 27 16" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const BookIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="var(--explore-blue)" fillOpacity="0.4" />
  </svg>
);

const PlantIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22V12" />
    <path d="M12 12c0-3 3-5 5-5s3 2 3 5-3 5-5 5z" fill="var(--explore-mint)" fillOpacity="0.4" />
    <path d="M12 15c0-2.5-2-4.5-4-4.5s-3 1.5-3 4.5 3 4.5 4 4.5z" fill="var(--explore-mint)" fillOpacity="0.25" />
  </svg>
);

const GamepadIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="6" width="20" height="12" rx="3" fill="var(--explore-lavender)" fillOpacity="0.4" />
    <path d="M6 12h4M8 10v4" />
    <circle cx="15" cy="12" r="1.2" fill="currentColor" />
    <circle cx="18" cy="12" r="1.2" fill="currentColor" />
  </svg>
);

const MoreIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <circle cx="6" cy="12" r="1.5" fill="currentColor" />
    <circle cx="18" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

/* Hobby Specific Custom Outlines */
const CameraIcon = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 11 Q4 9 7 9 L11 9 Q13 6 15 6 L17 6 Q19 6 21 9 L25 9 Q28 9 28 11 L28 25 Q28 27 25 27 L7 27 Q4 27 4 25 Z" fill="var(--explore-blue)" fillOpacity="0.4" />
    <circle cx="16" cy="18" r="6" fill="var(--explore-surface)" stroke="currentColor" strokeWidth="2" />
    <circle cx="16" cy="18" r="3" fill="currentColor" />
    <circle cx="24" cy="13" r="1.5" fill="var(--explore-pink-soft)" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const PotteryIcon = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 6 L22 6 L20 10 L25 15 C28 20 25 27 20 27 L12 27 C7 27 4 20 7 15 L12 10 Z" fill="var(--explore-pink-soft)" fillOpacity="0.4" />
    <path d="M9 16 Q16 19 23 16" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M8 20 Q16 23 24 20" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

const ClapperboardIcon = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="5" y="11" width="22" height="15" rx="2" fill="var(--explore-lavender)" fillOpacity="0.4" />
    <path d="M4 11 L28 7" stroke="currentColor" strokeWidth="3" />
    <path d="M5 11 L27 11" stroke="currentColor" strokeWidth="3" />
    <path d="M9 10 L11 8 M14 9 L16 7 M19 8 L21 6" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const RobotIcon = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="7" y="10" width="18" height="14" rx="3" fill="var(--explore-blue)" fillOpacity="0.4" />
    <circle cx="12" cy="16" r="2" fill="currentColor" />
    <circle cx="20" cy="16" r="2" fill="currentColor" />
    <path d="M12 21 Q16 23 20 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <path d="M16 10 V6 M13 6 H19" stroke="currentColor" strokeWidth="1.8" />
    <rect x="4" y="14" width="3" height="6" rx="1" fill="currentColor" />
    <rect x="25" y="14" width="3" height="6" rx="1" fill="currentColor" />
  </svg>
);

const NotebookIcon = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="7" y="5" width="18" height="22" rx="2" fill="var(--explore-yellow-soft)" fillOpacity="0.5" />
    <path d="M5 8 H9 M5 13 H9 M5 18 H9 M5 23 H9" stroke="currentColor" strokeWidth="2" />
    <path d="M12 9 H21 M12 14 H21 M12 19 H18" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    <path d="M22 25 L29 18 L26 15 L19 22 Z" fill="var(--explore-pink-soft)" stroke="currentColor" strokeWidth="1.5" />
    <path d="M28 19 L29 18" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const CookingIcon = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 14 H26 V22 Q26 27 21 27 H11 Q6 27 6 22 Z" fill="var(--explore-pink-soft)" fillOpacity="0.4" />
    <path d="M4 14 H28" stroke="currentColor" strokeWidth="2" />
    <path d="M11 14 Q16 10 21 14" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="16" cy="11" r="1.5" fill="currentColor" />
    <path d="M6 17 H3 M26 17 H29" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const TelescopeIcon = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10.08 9.08l10.58-3.08-1.5 5.18-10.58 3.08z" fill="var(--explore-blue)" fillOpacity="0.35" />
    <path d="M3 21l3.5-3.5M21 3l-1.5 1.5" />
    <path d="M12 14.5l-4.5 4.5" />
    <path d="M10 10l-4.5-4.5" />
    <circle cx="8" cy="16" r="1" fill="currentColor" />
  </svg>
);

const MountainIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 20L10 4L16 14L20 8L22 20Z" fill="var(--explore-yellow-soft)" fillOpacity="0.4" />
  </svg>
);

const DanceIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="4" r="1.5" fill="currentColor" />
    <path d="M6 10c2.5-1 4-2 6-2s3 .5 5 1M8 12c1.5 2 2 4.5 2.5 7M14 12c-1.5 2-2 4.5-2.5 7" />
  </svg>
);

const ChessIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="6" r="3" fill="var(--explore-text)" fillOpacity="0.2" />
    <path d="M19 21H5c0-4 3-6 5-7V9h4v5c2 1 5 3 5 7z" />
  </svg>
);

const FashionIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2a3 3 0 0 0-3 3h6a3 3 0 0 0-3-3z" />
    <path d="M2 19L12 7l10 12c-2 2-6 2-10 2s-8 0-10-2z" fill="var(--explore-pink-soft)" fillOpacity="0.4" />
  </svg>
);

const WoodworkingIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2l8 8-3 3-8-8zM7 14L3 21l3 1 7-7" fill="var(--explore-yellow-soft)" fillOpacity="0.3" />
  </svg>
);

const CyclingIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="5.5" cy="17.5" r="3.5" fill="var(--explore-blue)" fillOpacity="0.2" />
    <circle cx="18.5" cy="17.5" r="3.5" fill="var(--explore-blue)" fillOpacity="0.2" />
    <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 17.5l-3-6h6l-3 6zM8.5 11.5L12 6.5h3" />
  </svg>
);

const AstronomyIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 3l3 3-12 12-3-3zM14 8l2 2M7 15l-4 6M11 17l4 4" fill="var(--explore-blue)" fillOpacity="0.3" />
  </svg>
);

const CalligraphyIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 2L4 18v4h4L24 6zM19 3L7 15v2h2L21 5z" fill="var(--explore-lavender)" fillOpacity="0.3" />
  </svg>
);

const SkateboardIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="9" width="20" height="6" rx="3" fill="var(--explore-pink-soft)" fillOpacity="0.4" />
    <circle cx="6" cy="17" r="1.5" />
    <circle cx="18" cy="17" r="1.5" />
  </svg>
);

const CoffeeIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 8h1a3 3 0 0 1 0 6h-1M4 8h14v9a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8z" fill="var(--explore-yellow-soft)" fillOpacity="0.5" />
    <path d="M6 3v2M10 3v2M14 3v2" />
  </svg>
);

const BookClubIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="6" width="16" height="4" rx="1" fill="var(--explore-blue)" fillOpacity="0.3" />
    <rect x="3" y="11" width="18" height="4" rx="1" fill="var(--explore-yellow-soft)" fillOpacity="0.4" />
    <rect x="5" y="16" width="14" height="4" rx="1" fill="var(--explore-mint)" fillOpacity="0.3" />
  </svg>
);

const TravelIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" fill="var(--explore-blue)" fillOpacity="0.45" />
  </svg>
);

function getHobbyIcon(id, size = 32) {
  switch (id) {
    case 'photography':
      return <CameraIcon size={size} />;
    case 'guitar':
      return <GuitarIcon size={size} />;
    case 'pottery':
      return <PotteryIcon size={size} />;
    case 'running':
      return <SneakerIcon size={size} />;
    case 'film':
      return <ClapperboardIcon size={size} />;
    case 'ai-ml':
      return <RobotIcon size={size} />;
    case 'drawing':
      return <PaintPaletteIcon size={size} />;
    case 'writing':
      return <NotebookIcon size={size} />;
    case 'cooking':
      return <CookingIcon size={size} />;
    case 'bouldering':
      return <MountainIcon size={size} />;
    case 'dance':
      return <DanceIcon size={size} />;
    case 'chess':
      return <ChessIcon size={size} />;
    case 'gardening':
      return <PlantIcon size={size} />;
    case 'gaming':
      return <GamepadIcon size={size} />;
    case 'fashion':
      return <FashionIcon size={size} />;
    case 'woodworking':
      return <WoodworkingIcon size={size} />;
    case 'cycling':
      return <CyclingIcon size={size} />;
    case 'astronomy':
      return <AstronomyIcon size={size} />;
    case 'calligraphy':
      return <CalligraphyIcon size={size} />;
    case 'skateboarding':
      return <SkateboardIcon size={size} />;
    case 'coffee':
      return <CoffeeIcon size={size} />;
    case 'book-club':
      return <BookClubIcon size={size} />;
    case 'travel':
      return <TravelIcon size={size} />;
    default:
      return <EyeTrackingDaisy size={size} />;
  }
}

function getHobbyColor(id, fallback) {
  switch (id) {
    case 'photography':
      return 'var(--explore-blue)';
    case 'guitar':
      return 'var(--explore-yellow-soft)';
    case 'pottery':
      return 'var(--explore-pink-soft)';
    case 'running':
      return 'var(--explore-mint)';
    case 'film':
      return 'var(--explore-lavender)';
    case 'ai-ml':
      return 'var(--explore-blue)';
    case 'drawing':
      return 'var(--explore-yellow-soft)';
    case 'writing':
      return 'var(--explore-pink-soft)';
    case 'cooking':
      return 'var(--explore-pink-soft)';
    case 'bouldering':
      return 'var(--explore-yellow-soft)';
    case 'dance':
      return 'var(--explore-pink-soft)';
    case 'chess':
      return 'var(--explore-lavender)';
    case 'gardening':
      return 'var(--explore-mint)';
    case 'gaming':
      return 'var(--explore-lavender)';
    case 'fashion':
      return 'var(--explore-pink-soft)';
    case 'woodworking':
      return 'var(--explore-yellow-soft)';
    case 'cycling':
      return 'var(--explore-blue)';
    case 'astronomy':
      return 'var(--explore-blue)';
    case 'calligraphy':
      return 'var(--explore-lavender)';
    case 'skateboarding':
      return 'var(--explore-pink-soft)';
    default:
      return fallback || 'var(--explore-border)';
  }
}

function getCategoryIcon(cat) {
  switch (cat) {
    case 'All':
      return <GridIcon size={16} />;
    case 'Creative':
      return <PaintPaletteIcon size={16} />;
    case 'Music':
      return <GuitarIcon size={16} />;
    case 'Active':
      return <SneakerIcon size={16} />;
    case 'Learning':
      return <BookIcon size={16} />;
    case 'Lifestyle':
      return <PlantIcon size={16} />;
    case 'Gaming':
      return <GamepadIcon size={16} />;
    case 'More':
      return <MoreIcon size={16} />;
    default:
      return null;
  }
}

/* Category Filter Mapping */
const categoryMap = {
  Creative: ['Creative', 'Performance'],
  Music: ['Music'],
  Active: ['Fitness', 'Sports'],
  Learning: ['Tech', 'Science', 'Strategy'],
  Lifestyle: ['Lifestyle', 'Making'],
  Gaming: ['Entertainment'],
};

const uiCategories = ['All', 'Creative', 'Music', 'Active', 'Learning', 'Lifestyle', 'Gaming', 'More'];

/* Upcoming Events Visual Accents Map */
const eventVisuals = {
  'ev-pottery': {
    color: 'var(--explore-yellow-soft)',
    bg: '#FFFDEB',
    icon: <PotteryIcon size={18} />
  },
  'ev-photo': {
    color: 'var(--explore-pink-soft)',
    bg: '#FFF2F5',
    icon: <CameraIcon size={18} />
  },
  'ev-guitar': {
    color: 'var(--explore-lavender)',
    bg: '#FAF5FF',
    icon: <GuitarIcon size={18} />
  },
  'ev-sketch': {
    color: 'var(--explore-mint)',
    bg: '#F2FCF6',
    icon: <NotebookIcon size={18} />
  }
};

/* Upcoming Events Mock Data */
const upcomingEvents = [
  {
    id: 'ev-pottery',
    title: 'Pottery Workshop',
    location: 'Mumbai, Andheri',
    dateMonth: 'JUL',
    dateDay: '26',
    time: 'Sat, 4:00 PM',
    attendees: 12,
  },
  {
    id: 'ev-photo',
    title: 'Sunrise Photo Walk',
    location: 'Mumbai, Bandra Fort',
    dateMonth: 'JUL',
    dateDay: '27',
    time: 'Sun, 6:30 AM',
    attendees: 28,
  },
  {
    id: 'ev-guitar',
    title: 'Guitar Jam Session',
    location: 'Mumbai, Lower Parel',
    dateMonth: 'AUG',
    dateDay: '02',
    time: 'Sat, 7:00 PM',
    attendees: 15,
  },
  {
    id: 'ev-sketch',
    title: 'Sketch & Chill',
    location: 'Mumbai, Juhu Beach',
    dateMonth: 'AUG',
    dateDay: '03',
    time: 'Sun, 5:00 PM',
    attendees: 9,
  }
];

/* Quick Explore Local Mock List */
const quickExploreList = [
  { id: 'photography', name: 'Photography' },
  { id: 'guitar', name: 'Guitar' },
  { id: 'pottery', name: 'Pottery' },
  { id: 'running', name: 'Running' },
  { id: 'film', name: 'Film' },
  { id: 'ai-ml', name: 'AI & ML' },
  { id: 'drawing', name: 'Drawing' },
  { id: 'writing', name: 'Writing' },
  { id: 'cooking', name: 'Cooking' },
  { id: 'bouldering', name: 'Bouldering' },
  { id: 'dance', name: 'Dance' },
  { id: 'chess', name: 'Chess' },
  { id: 'gardening', name: 'Gardening' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'woodworking', name: 'Woodworking' },
  { id: 'cycling', name: 'Cycling' },
  { id: 'astronomy', name: 'Astronomy' },
  { id: 'calligraphy', name: 'Calligraphy' },
  { id: 'skateboarding', name: 'Skateboarding' },
  { id: 'coffee', name: 'Coffee' },
  { id: 'book-club', name: 'Book Club' },
  { id: 'travel', name: 'Travel' },
  { id: 'more', name: 'More' }
];

/* ==========================================================================
   MAIN COMPONENT: EXPLORE
   ========================================================================== */

export default function Explore() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAllHobbies, setShowAllHobbies] = useState(false);
  const [savedEvents, setSavedEvents] = useState([]);

  /* Filter Hobbies based on Category + Search */
  const filteredHobbies = useMemo(() => {
    let result = hobbies;
    if (activeCategory !== 'All') {
      const allowedCategories = categoryMap[activeCategory];
      if (allowedCategories) {
        result = result.filter(h => allowedCategories.includes(h.category));
      } else if (activeCategory === 'More') {
        const covered = Object.values(categoryMap).flat().filter(Boolean);
        result = result.filter(h => !covered.includes(h.category));
      }
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(h =>
        h.name.toLowerCase().includes(q) ||
        h.category.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [searchQuery, activeCategory]);

  /* Paginate Hobbies: Show 9 by default */
  const displayedHobbies = useMemo(() => {
    if (showAllHobbies || activeCategory !== 'All' || searchQuery) {
      return filteredHobbies;
    }
    return filteredHobbies.slice(0, 9);
  }, [filteredHobbies, showAllHobbies, activeCategory, searchQuery]);

  /* Get top 4 trending communities */
  const trendingCommunities = useMemo(() => {
    return communities.filter(c => c.trending).slice(0, 4);
  }, []);

  const handleHobbyClick = (hobbyId) => {
    if (hobbyId === 'more') {
      setActiveCategory('More');
      return;
    }
    const comm = communities.find(c => c.hobbyId === hobbyId);
    if (comm) {
      navigate(`/community/${comm.id}`);
    }
  };

  const toggleSaveEvent = (eventId, e) => {
    e.stopPropagation();
    setSavedEvents(prev =>
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  };

  return (
    <PageCanvas maxWidth="1400px">
      <div className="explore-layout">
        
        {/* ==========================================
            1. LEFT MINI RAIL
            ========================================== */}
        <aside className="explore-sidebar">
          <div className="explore-sidebar__inner">
            <div className="explore-sidebar__logo" title="CommonGround" onClick={() => navigate('/ground')}>
              <EyeTrackingDaisy size={38} />
            </div>
            
            <div className="explore-sidebar__divider" />
            
            {/* Joined-community circular avatars */}
            <div className="explore-sidebar__community-shortcuts">
              <div className="explore-sidebar__community-avatar" title="Street Photography" style={{ '--avatar-color': 'var(--explore-blue)' }} onClick={() => navigate('/community/street-photography')}>
                <CameraIcon size={16} />
              </div>
              <div className="explore-sidebar__community-avatar" title="Acoustic Sessions" style={{ '--avatar-color': 'var(--explore-yellow-soft)' }} onClick={() => navigate('/community/acoustic-sessions')}>
                <GuitarIcon size={16} />
              </div>
              <div className="explore-sidebar__community-avatar" title="Couch to 5K" style={{ '--avatar-color': 'var(--explore-mint)' }} onClick={() => navigate('/community/couch-to-5k')}>
                <SneakerIcon size={16} />
              </div>
            </div>

            <div className="explore-sidebar__divider" />

            <div className="explore-sidebar__shortcuts">
              <button className="explore-sidebar__shortcut-btn explore-sidebar__shortcut-btn--active" title="Explore Hobbies">
                <Compass size={20} />
                <span className="explore-sidebar__active-dot" />
              </button>
              <button className="explore-sidebar__shortcut-btn explore-sidebar__shortcut-btn--plus" title="Create Community" onClick={() => navigate('/create')}>
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Sidebar Collectible Motivational Note Card */}
          <div className="explore-sidebar__quote-card">
            <div className="explore-sidebar__quote-tape" />
            <p className="explore-sidebar__quote-text">
              Good things<br />
              happen<br />
              when you<br />
              show up.
            </p>
            <div className="explore-sidebar__quote-illustration">
              <EyeTrackingDaisy size={40} />
            </div>
          </div>
        </aside>

        {/* ==========================================
            MIDDLE & RIGHT WRAPPER
            ========================================== */}
        <div className="explore-main-grid">
          
          {/* ==========================================
              MAIN COLUMN (LEFT/CENTER)
              ========================================== */}
          <main className="explore-content">
            
            {/* Top Row with Header Title & Quiz Card */}
            <div className="explore-header-row-wrapper">
              
              <motion.div 
                className="explore__header"
                variants={staggerItem}
                initial="initial"
                animate="animate"
              >
                <div className="explore__header-row">
                  <h1 className="explore__title">Explore</h1>
                </div>
                <p className="text-muted">Browse hobbies, discover communities, find your thing. ✨</p>
              </motion.div>

              {/* Quiz Card */}
              <motion.div 
                className="explore-quiz-card"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => navigate('/onboarding')}
              >
                <div className="explore-quiz-card__content">
                  <span className="explore-quiz-card__stars">✦</span>
                  <h4 className="explore-quiz-card__title">Not sure what to explore?</h4>
                  <p className="explore-quiz-card__desc">Take our 30-sec quiz to find hobbies you'll actually love.</p>
                  <button className="explore-quiz-card__btn">Take the Quiz →</button>
                </div>
                <div className="explore-quiz-card__illustration">
                  <EyeTrackingDaisy size={58} />
                </div>
              </motion.div>

            </div>

            {/* Search Input */}
            <motion.div className="explore__search" variants={staggerItem}>
              <Search size={18} className="explore__search-icon" />
              <input
                type="text"
                className="explore__search-input"
                placeholder="Search hobbies, communities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>

            {/* Category Pills */}
            <motion.div className="explore__categories" variants={staggerItem}>
              {uiCategories.map(cat => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    className={`explore__category-btn ${isActive ? 'explore__category-btn--active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    <span className="explore__category-icon">{getCategoryIcon(cat)}</span>
                    <span className="explore__category-label">{cat}</span>
                  </button>
                );
              })}
            </motion.div>

            {/* Hero Section */}
            <motion.section 
              className="explore-hero"
              variants={staggerItem}
              initial="initial"
              animate="animate"
            >
              {/* Interactive Checkerboard Cell Layout */}
              <div className="explore-hero__checkerboard">
                {Array.from({ length: 48 }).map((_, idx) => (
                  <div key={idx} className="explore-hero__checkerboard-cell" />
                ))}
              </div>

              <div className="explore-hero__text-col">
                <h2 className="explore-hero__title">
                  FIND YOUR<br />
                  <span className="explore-hero__title-accent">COMMUNITY.</span>
                </h2>
                <p className="explore-hero__subtitle">
                  Discover hobbies, join communities, and connect with people who share your vibe.
                </p>
                <button 
                  className="explore-hero__btn"
                  onClick={() => {
                    const scrollTarget = document.getElementById('all-hobbies-section');
                    if (scrollTarget) {
                      scrollTarget.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Explore communities →
                </button>
              </div>

              <div className="explore-hero__illustration-col">
                <EyeTrackingDaisy size={110} className="explore-hero__flower-mascot" />
                <PaperAirplane className="explore-hero__airplane" />
                <div className="explore-hero__stars-container">
                  <SparkleStar size={18} className="explore-hero__star-1" />
                  <SparkleStar size={14} className="explore-hero__star-2" />
                </div>
                {/* Airplane trail */}
                <svg className="explore-hero__trail-svg" viewBox="0 0 150 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 70 Q 55 30, 95 60 T 140 30" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" fill="none" />
                </svg>
              </div>
            </motion.section>

            {/* Hobbies Section */}
            <motion.section 
              id="all-hobbies-section" 
              className="explore__section" 
              variants={staggerItem}
            >
              <div className="explore__section-header">
                <h2 className="explore__section-title">
                  {activeCategory === 'All' ? 'All Hobbies' : activeCategory}
                  <span className="explore__section-count">
                    {filteredHobbies.length}
                  </span>
                </h2>
                {activeCategory === 'All' && !searchQuery && (
                  <button 
                    className="explore__section-see-all"
                    onClick={() => setShowAllHobbies(!showAllHobbies)}
                  >
                    {showAllHobbies ? 'See less' : 'See all →'}
                  </button>
                )}
              </div>

              <div className="explore__hobby-grid">
                {displayedHobbies.map((hobby, i) => (
                  <motion.div
                    key={hobby.id}
                    className="explore__hobby-card"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.35 }}
                    whileHover={{ y: -5 }}
                    onClick={() => handleHobbyClick(hobby.id)}
                  >
                    <div className="explore__hobby-illustration">
                      {getHobbyIcon(hobby.id, 40)}
                    </div>
                    <div className="explore__hobby-info">
                      <h3 className="explore__hobby-name">{hobby.name}</h3>
                      <p className="explore__hobby-desc text-muted">{hobby.description}</p>
                    </div>
                    <span className="explore__hobby-arrow">Explore →</span>
                    <div className="explore__hobby-accent" style={{ backgroundColor: getHobbyColor(hobby.id, hobby.color) }} />
                  </motion.div>
                ))}
              </div>

              {filteredHobbies.length === 0 && (
                <div className="explore__empty">
                  <Smiley size={40} mood="neutral" />
                  <p className="text-muted">No hobbies found. Try a different search?</p>
                </div>
              )}

              {/* Show More Hobbies Button */}
              {activeCategory === 'All' && !searchQuery && hobbies.length > 9 && (
                <div className="explore__show-more-row">
                  <button 
                    className="explore__show-more-btn"
                    onClick={() => setShowAllHobbies(!showAllHobbies)}
                  >
                    {showAllHobbies ? 'Show less hobbies ↑' : 'Show more hobbies ↓'}
                  </button>
                </div>
              )}
            </motion.section>

            {/* Quick Explore */}
            <motion.section className="explore__section explore__quick-explore-section" variants={staggerItem}>
              <h2 className="explore__section-title">Quick explore</h2>
              <div className="explore__tags-cloud">
                {quickExploreList.map(item => (
                  <motion.button
                    key={item.id}
                    className="explore__quick-pill"
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleHobbyClick(item.id)}
                  >
                    <span className="explore__quick-pill-icon">{getHobbyIcon(item.id, 16)}</span>
                    <span className="explore__quick-pill-label">{item.name}</span>
                    <span className="explore__quick-pill-arrow">→</span>
                  </motion.button>
                ))}
              </div>
            </motion.section>

          </main>

          {/* ==========================================
              RIGHT COLUMN / SIDEBAR (WIDGETS)
              ========================================== */}
          <aside className="explore-widgets-column">
            
            {/* Trending Communities Widget */}
            <section className="explore-widget-card explore-trending-widgets">
              <div className="explore-widget-card__header">
                <h3 className="explore-widget-card__title">Trending communities</h3>
                <span className="explore-widget-card__link" onClick={() => navigate('/ground')}>See all →</span>
              </div>
              <div className="explore-widget-card__body">
                {trendingCommunities.map(community => (
                  <div 
                    key={community.id} 
                    className="explore-trending-item"
                    onClick={() => navigate(`/community/${community.id}`)}
                  >
                    <div className="explore-trending-item__icon-wrap">
                      {getHobbyIcon(community.hobbyId, 24)}
                    </div>
                    <div className="explore-trending-item__details">
                      <h4 className="explore-trending-item__name">{community.name}</h4>
                      <p className="explore-trending-item__meta text-muted">
                        {community.memberCount} people · {community.postCount} posts
                      </p>
                    </div>
                    <span className="explore-trending-item__arrow">→</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Create Community Card Widget */}
            <section className="explore-create-community-card">
              <div className="explore-create-community-card__tape" />
              <div className="explore-create-community-card__content">
                <h3 className="explore-create-community-card__title">
                  Create your<br />own community
                </h3>
                <p className="explore-create-community-card__subtitle">
                  Bring people together around what you love.
                </p>
                <button 
                  className="explore-create-community-card__btn"
                  onClick={() => navigate('/create')}
                >
                  Create Community +
                </button>
              </div>
              <div className="explore-create-community-card__illustration">
                <PlantPotMascot size={70} />
              </div>
            </section>

            {/* Upcoming Events Widget */}
            <section className="explore-widget-card explore-events-widgets">
              <div className="explore-widget-card__header">
                <h3 className="explore-widget-card__title">Upcoming Events</h3>
                <span className="explore-widget-card__link">See all →</span>
              </div>
              <div className="explore-widget-card__body">
                <div className="explore-events-list">
                  {upcomingEvents.map(event => {
                    const isSaved = savedEvents.includes(event.id);
                    const visuals = eventVisuals[event.id] || { color: 'var(--explore-border)', bg: 'var(--explore-surface)', icon: null };
                    return (
                      <div 
                        key={event.id} 
                        className="explore-event-item"
                        style={{ 
                          '--event-accent': visuals.color,
                          '--event-bg-light': visuals.bg
                        }}
                      >
                        <div className="explore-event-item__date-block" style={{ backgroundColor: 'var(--explore-surface)' }}>
                          <span className="explore-event-item__date-month">{event.dateMonth}</span>
                          <span className="explore-event-item__date-day">{event.dateDay}</span>
                        </div>
                        <div className="explore-event-item__details">
                          <h4 className="explore-event-item__title">{event.title}</h4>
                          <p className="explore-event-item__location text-muted">{event.location}</p>
                          <p className="explore-event-item__time text-muted">
                            {event.time} · <span className="explore-event-item__going">{event.attendees} going</span>
                          </p>
                        </div>
                        <div className="explore-event-item__icon-wrap">
                          {visuals.icon}
                        </div>
                        <button 
                          className={`explore-event-item__heart ${isSaved ? 'explore-event-item__heart--saved' : ''}`}
                          onClick={(e) => toggleSaveEvent(event.id, e)}
                          aria-label="Save event"
                        >
                          <Heart size={16} fill={isSaved ? "var(--explore-pink-accent)" : "none"} stroke={isSaved ? "var(--explore-pink-accent)" : "currentColor"} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Today's Tiny Adventure Sticky Widget */}
            <div className="explore-sticky-note-widget">
              <div className="explore-sticky-note-widget__tape" />
              <div className="explore-sticky-note-widget__header">
                <h4 className="explore-sticky-note-widget__title">Today's Tiny Adventure</h4>
                <TelescopeIcon size={24} className="explore-sticky-note-widget__icon" />
              </div>
              <ul className="explore-sticky-note-widget__list">
                <li>
                  <span className="explore-sticky-note-widget__bullet">✦</span>
                  Take a photo of something green today.
                </li>
                <li>
                  <span className="explore-sticky-note-widget__bullet">✦</span>
                  Learn one new chord or search for a local jam.
                </li>
                <li>
                  <span className="explore-sticky-note-widget__bullet">✦</span>
                  Say hi to someone with a cool camera.
                </li>
              </ul>
              <div className="explore-sticky-note-widget__footer">
                <span className="explore-sticky-note-widget__hashtag">#tinyadventure</span>
                <SparkleStar size={12} className="explore-sticky-note-widget__sparkle" />
              </div>
            </div>

          </aside>

        </div>

      </div>
    </PageCanvas>
  );
}
