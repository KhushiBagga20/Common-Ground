import { useState } from 'react';
import { motion } from 'framer-motion';
import { useChannel, finishChannel } from '../../lib/channel';
import './ChannelCurtain.css';

/**
 * The channel-change transition. A disc in the destination's colour grows
 * from the pressed key, carrying the channel number; once the screen is
 * covered the page swaps underneath and the disc lifts away as a curved wipe.
 */
export default function ChannelCurtain() {
  const run = useChannel();
  const [phase, setPhase] = useState({ id: null, step: 'cover' });
  if (run && phase.id !== run.id) {
    setPhase({ id: run.id, step: 'cover' });
  }

  if (!run) return null;

  const w = window.innerWidth;
  const h = window.innerHeight;
  // Big enough to reach the farthest corner from where the key was pressed
  const radius = Math.hypot(Math.max(run.x, w - run.x), Math.max(run.y, h - run.y)) + 24;
  const covering = phase.step === 'cover';
  const fullDisc = `circle(${radius}px at ${run.x}px ${run.y}px)`;

  return (
    <motion.div
      key={run.id}
      className="curtain"
      style={{ '--curtain-color': run.color }}
      aria-hidden="true"
      initial={{ clipPath: `circle(0px at ${run.x}px ${run.y}px)`, y: 0 }}
      animate={covering
        ? { clipPath: fullDisc, y: 0, transition: { duration: 0.3, ease: [0.7, 0, 0.84, 0] } }
        // Keep the disc full (framer would otherwise shrink it back to `initial`)
        // and lift it far enough that its curved lower edge clears the screen
        : { clipPath: fullDisc, y: -(run.y + radius), transition: { duration: 0.5, ease: [0.7, 0, 0.2, 1], delay: 0.08 } }}
      onAnimationComplete={() => {
        if (covering) {
          run.go();
          setPhase({ id: run.id, step: 'reveal' });
        } else {
          finishChannel();
        }
      }}
    >
      <motion.div
        className="curtain__label"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 420, damping: 20, delay: 0.08 }}
      >
        <span className="curtain__no pixel">CH {String(run.no).padStart(2, '0')}</span>
        <span className="curtain__name">{run.label}</span>
      </motion.div>
    </motion.div>
  );
}
