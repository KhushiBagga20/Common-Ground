import { motion } from 'framer-motion';
import './StickerStack.css';

const TILTS = [-10, 7, -3, 12];
const COLORS = ['var(--paper)', 'var(--yellow)', 'var(--pink)', 'var(--green)'];

/** A loose pile of emoji stickers for hero art — each one wobbles on hover */
export default function StickerStack({ items, colors = COLORS }) {
  return (
    <div className="sticker-stack">
      {items.map((emoji, i) => (
        <motion.span
          key={emoji}
          className="sticker-stack__tile"
          style={{ '--tilt': `${TILTS[i % TILTS.length]}deg`, background: colors[i % colors.length] }}
          initial={{ scale: 0.4, opacity: 0, rotate: TILTS[i % TILTS.length] - 20 }}
          animate={{ scale: 1, opacity: 1, rotate: TILTS[i % TILTS.length] }}
          whileHover={{ scale: 1.12, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 16, delay: 0.15 + i * 0.08 }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
}
