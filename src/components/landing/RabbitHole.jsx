import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import './RabbitHole.css';

/* ================================================================
   RABBIT HOLE — progressive discovery chain
   ================================================================ */
const CHAINS = [
  {
    steps: ['Photography', 'Street Photography', 'Film Cameras', 'Darkroom', 'Analog'],
    emoji: ['📸', '🏙️', '📷', '🔴', '📻'],
  },
  {
    steps: ['Cooking', 'Fermentation', 'Kombucha', 'Gut Health', 'Microbiology'],
    emoji: ['🍳', '🫙', '🍵', '🦠', '🔬'],
  },
  {
    steps: ['Guitar', 'Jazz', 'Vinyl', 'Audio Engineering', 'Synthesis'],
    emoji: ['🎸', '🎷', '💿', '🎛️', '🎹'],
  },
];

function ArrowDoodle() {
  return (
    <motion.svg
      className="rabbit__arrow"
      viewBox="0 0 24 40"
      fill="none"
      aria-hidden="true"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.5 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.path
        d="M12 2 L12 30 M6 24 L12 32 L18 24"
        stroke="var(--muted)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.svg>
  );
}

export default function RabbitHole() {
  const navigate = useNavigate();
  const [chainIdx] = useState(() => Math.floor(Math.random() * CHAINS.length));
  const [revealedCount, setRevealedCount] = useState(1);

  const chain = CHAINS[chainIdx];
  const allRevealed = revealedCount >= chain.steps.length;

  const revealNext = useCallback(() => {
    if (!allRevealed) {
      setRevealedCount(prev => prev + 1);
    }
  }, [allRevealed]);

  return (
    <motion.section
      className="rabbit"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
    >
      <div className="rabbit__inner">
        <motion.div
          className="rabbit__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="rabbit__label font-accent">the rabbit hole</span>
          <h2 className="rabbit__title">One thing leads to another.</h2>
          <p className="rabbit__subtitle text-muted">Click each step to go deeper.</p>
        </motion.div>

        <div className="rabbit__chain">
          <AnimatePresence>
            {chain.steps.slice(0, revealedCount).map((step, i) => (
              <motion.div
                key={step}
                className="rabbit__step-group"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {i > 0 && <ArrowDoodle />}
                <motion.button
                  className={`rabbit__step ${i === revealedCount - 1 && !allRevealed ? 'rabbit__step--active' : ''}`}
                  onClick={revealNext}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={allRevealed || i !== revealedCount - 1}
                >
                  <span className="rabbit__step-emoji">{chain.emoji[i]}</span>
                  <span className="rabbit__step-name">{step}</span>
                  {i === revealedCount - 1 && !allRevealed && (
                    <span className="rabbit__step-hint font-accent">click →</span>
                  )}
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Final reveal */}
          <AnimatePresence>
            {allRevealed && (
              <motion.div
                className="rabbit__step-group"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <ArrowDoodle />
                <div className="rabbit__finale">
                  <span className="rabbit__finale-text font-accent">
                    You're already down the rabbit hole.
                  </span>
                  <Button
                    size="md"
                    onClick={() => navigate('/onboarding')}
                    iconRight={<ArrowRight size={16} />}
                  >
                    Keep exploring
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
