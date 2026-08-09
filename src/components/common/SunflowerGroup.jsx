import { motion } from 'framer-motion';
import SunflowerMascot from '../common/SunflowerMascot';
import './SunflowerGroup.css';

/* ---------------------------------------------------------------
   SUNFLOWER GROUP — Main mascot + companion sunflowers

   Companions are simple SVGs (no eye tracking), each at a
   different rotation and floating phase. Static personality.
   --------------------------------------------------------------- */

const COMPANIONS = [
  { id: 1, top: '4%', left: '4%', size: 48, rot: -25, delay: 0.1, floatDuration: 3.8 },
  { id: 2, top: '6%', left: '16%', size: 62, rot: 15, delay: 0.27, floatDuration: 4.11 },
  { id: 3, top: '3%', left: '28%', size: 40, rot: -40, delay: 0.44, floatDuration: 4.42 },
  { id: 4, top: '14%', left: '8%', size: 55, rot: 30, delay: 0.61, floatDuration: 4.73 },
  { id: 5, top: '16%', left: '22%', size: 68, rot: -10, delay: 0.78, floatDuration: 5.04 },
  { id: 6, top: '24%', left: '4%', size: 44, rot: 50, delay: 0.95, floatDuration: 5.35 },
  { id: 7, top: '26%', left: '15%', rot: -35, size: 58, delay: 0.22, floatDuration: 5.66 },
  { id: 8, top: '34%', left: '8%', size: 64, rot: 20, delay: 0.39, floatDuration: 5.97 },
  { id: 9, top: '36%', left: '20%', size: 42, rot: -15, delay: 0.56, floatDuration: 6.28 },
  { id: 10, top: '10%', left: '36%', size: 52, rot: 45, delay: 0.73, floatDuration: 6.59 },
  { id: 11, top: '20%', left: '32%', size: 46, rot: -55, delay: 0.9, floatDuration: 6.9 },
  { id: 12, top: '28%', left: '28%', size: 60, rot: 10, delay: 0.17, floatDuration: 7.21 },

  { id: 13, top: '4%', right: '4%', size: 52, rot: 35, delay: 0.34, floatDuration: 7.52 },
  { id: 14, top: '5%', right: '18%', size: 65, rot: -20, delay: 0.51, floatDuration: 7.83 },
  { id: 15, top: '3%', right: '32%', size: 42, rot: 45, delay: 0.68, floatDuration: 3.94 },
  { id: 16, top: '13%', right: '10%', size: 58, rot: -15, delay: 0.85, floatDuration: 4.25 },
  { id: 17, top: '15%', right: '25%', size: 46, rot: 30, delay: 0.12, floatDuration: 4.56 },
  { id: 18, top: '23%', right: '5%', size: 64, rot: -45, delay: 0.29, floatDuration: 4.87 },
  { id: 19, top: '25%', right: '16%', size: 50, rot: 25, delay: 0.46, floatDuration: 5.18 },
  { id: 20, top: '33%', right: '8%', size: 70, rot: -30, delay: 0.63, floatDuration: 5.49 },
  { id: 21, top: '35%', right: '22%', size: 44, rot: 15, delay: 0.8, floatDuration: 5.8 },
  { id: 22, top: '9%', right: '38%', size: 56, rot: -60, delay: 0.97, floatDuration: 6.11 },
  { id: 23, top: '19%', right: '34%', size: 48, rot: 40, delay: 0.24, floatDuration: 6.42 },
  { id: 24, top: '27%', right: '29%', size: 62, rot: -10, delay: 0.41, floatDuration: 6.73 },

  { id: 25, top: '46%', left: '5%', size: 56, rot: -30, delay: 0.58, floatDuration: 7.04 },
  { id: 26, top: '48%', left: '18%', size: 42, rot: 25, delay: 0.75, floatDuration: 7.35 },
  { id: 27, top: '56%', left: '8%', size: 66, rot: -15, delay: 0.92, floatDuration: 7.66 },
  { id: 28, top: '58%', left: '24%', size: 50, rot: 40, delay: 0.19, floatDuration: 7.97 },
  { id: 29, top: '66%', left: '4%', size: 45, rot: -50, delay: 0.36, floatDuration: 4.08 },
  { id: 30, top: '68%', left: '15%', size: 60, rot: 20, delay: 0.53, floatDuration: 4.39 },
  { id: 31, top: '76%', left: '8%', size: 72, rot: -35, delay: 0.7, floatDuration: 4.7 },
  { id: 32, top: '78%', left: '22%', size: 48, rot: 15, delay: 0.87, floatDuration: 5.01 },
  { id: 33, top: '86%', left: '5%', size: 54, rot: -20, delay: 0.14, floatDuration: 5.32 },
  { id: 34, top: '88%', left: '18%', size: 64, rot: 35, delay: 0.31, floatDuration: 5.63 },
  { id: 35, top: '62%', left: '32%', size: 40, rot: -45, delay: 0.48, floatDuration: 5.94 },
  { id: 36, top: '72%', left: '30%', size: 58, rot: 10, delay: 0.65, floatDuration: 6.25 },
  { id: 37, top: '82%', left: '32%', size: 46, rot: -60, delay: 0.82, floatDuration: 6.56 },

  { id: 38, top: '45%', right: '6%', size: 60, rot: 25, delay: 0.99, floatDuration: 6.87 },
  { id: 39, top: '47%', right: '20%', size: 44, rot: -35, delay: 0.26, floatDuration: 7.18 },
  { id: 40, top: '55%', right: '8%', size: 68, rot: 15, delay: 0.43, floatDuration: 7.49 },
  { id: 41, top: '57%', right: '22%', size: 52, rot: -45, delay: 0.6, floatDuration: 7.8 },
  { id: 42, top: '65%', right: '4%', size: 48, rot: 30, delay: 0.77, floatDuration: 3.91 },
  { id: 43, top: '67%', right: '16%', size: 62, rot: -20, delay: 0.94, floatDuration: 4.22 },
  { id: 44, top: '75%', right: '7%', size: 54, rot: 40, delay: 0.21, floatDuration: 4.53 },
  { id: 45, top: '77%', right: '24%', size: 70, rot: -15, delay: 0.38, floatDuration: 4.84 },
  { id: 46, top: '85%', right: '5%', size: 42, rot: 60, delay: 0.55, floatDuration: 5.15 },
  { id: 47, top: '87%', right: '18%', size: 65, rot: -30, delay: 0.72, floatDuration: 5.46 },
  { id: 48, top: '61%', right: '31%', size: 46, rot: 20, delay: 0.89, floatDuration: 5.77 },
  { id: 49, top: '71%', right: '33%', size: 56, rot: -50, delay: 0.16, floatDuration: 6.08 },
  { id: 50, top: '83%', right: '30%', size: 50, rot: 15, delay: 0.33, floatDuration: 6.39 },
];

function MiniSunflower({ size, rot, delay, floatDuration }) {
  const r = size / 2;
  const cx = r;
  const cy = r;
  const petalR = r * 0.55;
  const petalRx = r * 0.18;
  const petalRy = r * 0.28;
  const faceR = r * 0.38;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -12, 0],
        rotate: [rot, rot + 4, rot],
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay },
        y: {
          duration: floatDuration,
          delay: delay,
          repeat: Infinity,
          ease: 'easeInOut',
        },
        rotate: {
          duration: floatDuration,
          delay: delay,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
      style={{ display: 'inline-block' }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        aria-hidden="true"
      >
        {/* Petals */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const px = cx + petalR * Math.sin(rad);
          const py = cy - petalR * Math.cos(rad);
          return (
            <ellipse
              key={i}
              cx={px} cy={py}
              rx={petalRx} ry={petalRy}
              fill="#F8F4EC"
              stroke="#1A1A1A"
              strokeWidth={size * 0.025}
              transform={`rotate(${deg}, ${px}, ${py})`}
            />
          );
        })}
        {/* Face */}
        <circle cx={cx} cy={cy} r={faceR} fill="#F5C842" stroke="#1A1A1A" strokeWidth={size * 0.025} />
        {/* Simple dot eyes */}
        <circle cx={cx - faceR * 0.28} cy={cy - faceR * 0.2} r={faceR * 0.12} fill="#1A1A1A" />
        <circle cx={cx + faceR * 0.28} cy={cy - faceR * 0.2} r={faceR * 0.12} fill="#1A1A1A" />
        {/* Smile */}
        <path
          d={`M ${cx - faceR * 0.3} ${cy + faceR * 0.15} Q ${cx} ${cy + faceR * 0.45} ${cx + faceR * 0.3} ${cy + faceR * 0.15}`}
          stroke="#1A1A1A"
          strokeWidth={size * 0.025}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </motion.div>
  );
}

export default function SunflowerGroup() {
  return (
    <div className="sfgroup">
      {/* Companion sunflowers */}
      {COMPANIONS.map(c => (
        <div
          key={c.id}
          className="sfgroup__companion"
          style={{
            width: c.size,
            height: c.size,
            top: c.top,
            left: c.left,
            right: c.right,
          }}
        >
          <MiniSunflower
            size={c.size}
            rot={c.rot}
            delay={c.delay}
            floatDuration={c.floatDuration}
          />
        </div>
      ))}

      {/* Main mascot — bigger */}
      <div className="sfgroup__main">
        <SunflowerMascot />
      </div>
    </div>
  );
}
