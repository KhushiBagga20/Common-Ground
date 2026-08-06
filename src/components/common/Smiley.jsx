import { motion } from 'framer-motion';

export default function Smiley({
  size = 32,
  mood = 'happy',
  color = 'currentColor',
  animate = true,
  className = '',
  style = {},
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.42;
  const eyeR = size * 0.05;
  const eyeY = cy - r * 0.15;
  const eyeSpacing = r * 0.38;
  const sw = size * 0.06;

  const mouths = {
    happy: `M${cx - r * 0.35} ${cy + r * 0.15} Q${cx} ${cy + r * 0.55} ${cx + r * 0.35} ${cy + r * 0.15}`,
    wink: `M${cx - r * 0.3} ${cy + r * 0.2} Q${cx} ${cy + r * 0.45} ${cx + r * 0.3} ${cy + r * 0.2}`,
    surprised: `M${cx - r * 0.15} ${cy + r * 0.25} Q${cx} ${cy + r * 0.45} ${cx + r * 0.15} ${cy + r * 0.25}`,
    neutral: `M${cx - r * 0.25} ${cy + r * 0.2} L${cx + r * 0.25} ${cy + r * 0.2}`,
  };

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={`smiley ${className}`}
      style={style}
      aria-hidden="true"
      initial={animate ? { scale: 0, rotate: -15 } : {}}
      animate={{ scale: 1, rotate: 0 }}
      transition={animate ? { type: 'spring', stiffness: 300, damping: 15, delay: 0.2 } : {}}
    >
      {/* Face circle */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        stroke={color}
        strokeWidth={sw}
        fill="none"
      />
      {/* Left eye */}
      <circle
        cx={cx - eyeSpacing}
        cy={eyeY}
        r={eyeR}
        fill={color}
      />
      {/* Right eye */}
      {mood === 'wink' ? (
        <path
          d={`M${cx + eyeSpacing - eyeR * 1.5} ${eyeY} L${cx + eyeSpacing + eyeR * 1.5} ${eyeY}`}
          stroke={color}
          strokeWidth={sw * 0.8}
          strokeLinecap="round"
        />
      ) : (
        <circle
          cx={cx + eyeSpacing}
          cy={eyeY}
          r={eyeR}
          fill={color}
        />
      )}
      {/* Mouth */}
      <path
        d={mouths[mood] || mouths.happy}
        stroke={color}
        strokeWidth={sw * 0.8}
        strokeLinecap="round"
        fill="none"
      />
    </motion.svg>
  );
}
