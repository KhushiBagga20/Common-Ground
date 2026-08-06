import { motion } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import './SwipeControls.css';

export default function SwipeControls({ onLike, onSkip, disabled = false }) {
  return (
    <div className="swipe-controls">
      <motion.button
        className="swipe-controls__btn swipe-controls__btn--skip"
        onClick={onSkip}
        disabled={disabled}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        aria-label="Skip this hobby"
      >
        <X size={28} strokeWidth={2.5} />
      </motion.button>

      <motion.button
        className="swipe-controls__btn swipe-controls__btn--like"
        onClick={onLike}
        disabled={disabled}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        aria-label="Like this hobby"
      >
        <Heart size={28} strokeWidth={2.5} />
      </motion.button>
    </div>
  );
}
