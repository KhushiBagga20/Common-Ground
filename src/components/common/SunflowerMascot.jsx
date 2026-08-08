import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './SunflowerMascot.css';

/* ---------------------------------------------------------------
   SunflowerMascot — The alive character of CommonGround

   Features:
   - Cursor-tracking eyes (spring-based, smooth)
   - Random idle blinking every 3–6s
   - Idle float animation (CSS)
   - Button awareness: looks toward hovered CTA
   - Click reaction: brief wobble
   --------------------------------------------------------------- */

const EYE_RANGE = 6; // max px the pupil can move

export default function SunflowerMascot({ buttonRef, className = '' }) {
  const svgRef    = useRef(null);
  const [blink, setBlink]   = useState(false);
  const [react, setReact]   = useState(false);

  // Raw target for pupil offset (set by mouse or button hover)
  const rawPupilX = useMotionValue(0);
  const rawPupilY = useMotionValue(0);

  // Smooth spring-based pupil position
  const pupilX = useSpring(rawPupilX, { stiffness: 150, damping: 20 });
  const pupilY = useSpring(rawPupilY, { stiffness: 150, damping: 20 });

  /* --- Cursor tracking --- */
  const handleMouseMove = useCallback((e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const faceCX = rect.left + rect.width * 0.5;
    const faceCY = rect.top + rect.height * 0.5;

    const dx = e.clientX - faceCX;
    const dy = e.clientY - faceCY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 500;

    if (dist > 0) {
      const t = Math.min(dist / maxDist, 1);
      rawPupilX.set((dx / dist) * t * EYE_RANGE);
      rawPupilY.set((dy / dist) * t * EYE_RANGE);
    }
  }, [rawPupilX, rawPupilY]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  /* --- Idle blinking --- */
  useEffect(() => {
    const blinkLoop = () => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
      const next = 3000 + Math.random() * 3000; // 3–6s
      return setTimeout(() => blinkLoop(), next);
    };
    const id = setTimeout(() => blinkLoop(), 2000);
    return () => clearTimeout(id);
  }, []);

  /* --- Click reaction --- */
  const triggerReaction = useCallback(() => {
    setReact(true);
    setTimeout(() => setReact(false), 600);
  }, []);

  useEffect(() => {
    const handler = () => triggerReaction();
    window.addEventListener('sunflower-react', handler);
    return () => window.removeEventListener('sunflower-react', handler);
  }, [triggerReaction]);

  /* --- Button awareness --- */
  const lookAtButton = useCallback((btnEl) => {
    if (!btnEl || !svgRef.current) return;
    const svg = svgRef.current.getBoundingClientRect();
    const btn = btnEl.getBoundingClientRect();
    const faceCX = svg.left + svg.width * 0.5;
    const faceCY = svg.top + svg.height * 0.5;
    const dx = (btn.left + btn.width / 2) - faceCX;
    const dy = (btn.top + btn.height / 2) - faceCY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0) {
      rawPupilX.set((dx / dist) * EYE_RANGE * 0.8);
      rawPupilY.set((dy / dist) * EYE_RANGE * 0.8);
    }
  }, [rawPupilX, rawPupilY]);

  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.element) {
        lookAtButton(e.detail.element);
      } else {
        rawPupilX.set(0);
        rawPupilY.set(0);
      }
    };
    window.addEventListener('sunflower-look', handler);
    return () => window.removeEventListener('sunflower-look', handler);
  }, [lookAtButton, rawPupilX, rawPupilY]);

  return (
    <motion.div
      className={`sunflower-mascot ${react ? 'sunflower-mascot--react' : ''} ${className}`}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <svg
        ref={svgRef}
        className="sunflower-mascot__svg"
        viewBox="20 10 280 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* PETALS */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const px = 160 + 78 * Math.sin(rad);
          const py = 150 - 78 * Math.cos(rad);
          return (
            <ellipse
              key={i}
              cx={px}
              cy={py}
              rx={28}
              ry={42}
              fill="#F8F4EC"
              stroke="#1A1A1A"
              strokeWidth="3.5"
              transform={`rotate(${deg}, ${px}, ${py})`}
            />
          );
        })}

        {/* FACE — circle */}
        <circle cx="160" cy="150" r="58" fill="#F5C842" stroke="#1A1A1A" strokeWidth="4" />

        {/* EYES — motion pupils that follow cursor */}
        {/* Left eye white */}
        <ellipse cx="142" cy="140" rx="12" ry="14" fill="white" stroke="#1A1A1A" strokeWidth="2" />
        {/* Right eye white */}
        <ellipse cx="178" cy="140" rx="12" ry="14" fill="white" stroke="#1A1A1A" strokeWidth="2" />

        {/* Left pupil — moves */}
        <motion.ellipse
          cx="142"
          cy="140"
          rx={blink ? 9 : 7}
          ry={blink ? 2 : 9}
          fill="#1A1A1A"
          style={{ x: pupilX, y: pupilY }}
        />
        {/* Right pupil — moves */}
        <motion.ellipse
          cx="178"
          cy="140"
          rx={blink ? 9 : 7}
          ry={blink ? 2 : 9}
          fill="#1A1A1A"
          style={{ x: pupilX, y: pupilY }}
        />

        {/* Eye shine */}
        {!blink && (
          <>
            <motion.circle cx="146" cy="135" r="3" fill="white" style={{ x: pupilX, y: pupilY }} />
            <motion.circle cx="182" cy="135" r="3" fill="white" style={{ x: pupilX, y: pupilY }} />
          </>
        )}

        {/* MOUTH */}
        <path d="M 140 165 Q 160 185 180 165" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" fill="none" />

        {/* Blush */}
        <ellipse cx="130" cy="163" rx="11" ry="7" fill="#F47B7B" opacity="0.4" />
        <ellipse cx="190" cy="163" rx="11" ry="7" fill="#F47B7B" opacity="0.4" />
      </svg>
    </motion.div>
  );
}
