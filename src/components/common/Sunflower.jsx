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
    <motion.img
      src="/logo.png"
      alt="CommonGround Logo"
      width={size}
      height={size}
      className={`sunflower ${className}`}
      style={{ objectFit: 'contain', borderRadius: '50%', ...style }}
      initial={animate ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={animate ? { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] } : {}}
      aria-hidden="true"
    />
  );
}
