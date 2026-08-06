import { motion } from 'framer-motion';
import { drawPath } from '../../animations/variants';

export default function SketchArrow({
  direction = 'right',
  color = 'currentColor',
  size = 40,
  strokeWidth = 2.5,
  animate = true,
  className = '',
  style = {},
}) {
  const rotations = {
    right: 0,
    down: 90,
    left: 180,
    up: -90,
    'down-right': 45,
    'up-right': -30,
  };

  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 60 36"
      fill="none"
      className={`sketch-arrow ${className}`}
      style={{
        transform: `rotate(${rotations[direction] || 0}deg)`,
        ...style,
      }}
    >
      <motion.path
        d="M4 20 C12 18, 20 14, 28 16 C36 18, 42 22, 50 18"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        variants={animate ? drawPath : undefined}
        initial={animate ? 'initial' : undefined}
        animate={animate ? 'animate' : undefined}
      />
      <motion.path
        d="M44 12 L51 18 L44 24"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={animate ? drawPath : undefined}
        initial={animate ? 'initial' : undefined}
        animate={animate ? 'animate' : undefined}
      />
    </svg>
  );
}
