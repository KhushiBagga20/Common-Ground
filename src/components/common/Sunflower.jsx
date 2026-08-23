import { motion } from 'framer-motion';

export default function Sunflower({
  size = 48,
  color = '#FFD43B',
  animate = true,
  className = '',
  style = {},
}) {
  const petalCount = 8;
  const centerR = size * 0.18;
  const petalR = size * 0.14;
  const petalDist = size * 0.28;
  const cx = size / 2;
  const cy = size / 2;

  const petals = Array.from({ length: petalCount }, (_, i) => {
    const angle = (i / petalCount) * Math.PI * 2 - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * petalDist,
      y: cy + Math.sin(angle) * petalDist,
      delay: i * 0.05,
    };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={`sunflower ${className}`}
      style={style}
      aria-hidden="true"
    >
      {/* Petals */}
      {petals.map((petal, i) => (
        <motion.ellipse
          key={i}
          cx={petal.x}
          cy={petal.y}
          rx={petalR}
          ry={petalR * 1.3}
          fill={color}
          transform={`rotate(${(i / petalCount) * 360} ${petal.x} ${petal.y})`}
          initial={animate ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={animate ? {
            delay: 0.3 + petal.delay,
            duration: 0.5,
            ease: [0.34, 1.56, 0.64, 1],
          } : {}}
        />
      ))}
      {/* Center */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={centerR}
        fill="#8B6914"
        initial={animate ? { scale: 0 } : { scale: 1 }}
        animate={{ scale: 1 }}
        transition={animate ? {
          delay: 0.15,
          duration: 0.4,
          ease: [0.34, 1.56, 0.64, 1],
        } : {}}
      />
      {/* Center dots */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        const d = centerR * 0.45;
        return (
          <motion.circle
            key={`dot-${i}`}
            cx={cx + Math.cos(a) * d}
            cy={cy + Math.sin(a) * d}
            r={1.5}
            fill="#6B5010"
            initial={animate ? { scale: 0 } : { scale: 1 }}
            animate={{ scale: 1 }}
            transition={animate ? { delay: 0.6 + i * 0.04, duration: 0.3 } : {}}
          />
        );
      })}
    </svg>
  );
}
