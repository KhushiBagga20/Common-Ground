import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './Ticker.css';

/** A number that rolls up (or down) like an odometer when it changes */
export default function Ticker({ value, className = '' }) {
  const [roll, setRoll] = useState({ value, dir: 1 });
  if (roll.value !== value) {
    setRoll({ value, dir: value > roll.value ? 1 : -1 });
  }

  return (
    <span className={`ticker ${className}`}>
      <AnimatePresence initial={false} custom={roll.dir}>
        <motion.span
          key={value}
          className="ticker__value"
          custom={roll.dir}
          variants={{
            enter: dir => ({ y: dir > 0 ? '100%' : '-100%', opacity: 0 }),
            center: { y: '0%', opacity: 1 },
            exit: dir => ({ y: dir > 0 ? '-100%' : '100%', opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 420, damping: 26 }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
