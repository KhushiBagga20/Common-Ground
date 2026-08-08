import { useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import HobbyCard from './HobbyCard';
import './HobbyDeck.css';

/* ================================================================
   PILE CARD — small ghosted card shown in left/right pile
   ================================================================ */
function PileCard({ hobby, index, side }) {
  // Each card gets a unique-ish rotation & offset based on index
  const seed = hobby.id.length + index;
  const baseRotate = side === 'left' ? -(12 + (seed % 15)) : (10 + (seed % 12));
  const yOffset = (index * 18) + (seed % 10);
  const xOffset = side === 'left' ? -(index * 6) : (index * 6);

  return (
    <motion.div
      className={`hobby-deck__pile-card hobby-deck__pile-card--${side}`}
      initial={{
        opacity: 0,
        scale: 0.5,
        rotate: 0,
        x: side === 'left' ? 100 : -100,
      }}
      animate={{
        opacity: 0.55 - index * 0.12,
        scale: 0.42 - index * 0.04,
        rotate: baseRotate,
        x: xOffset,
        y: yOffset,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 22,
      }}
      style={{ zIndex: 5 - index }}
    >
      <div
        className="hobby-deck__pile-card-inner"
        style={{
          borderColor: side === 'right' ? hobby.color : 'var(--border)',
        }}
      >
        <span className="hobby-deck__pile-emoji">{hobby.emoji}</span>
        <span className="hobby-deck__pile-name">{hobby.name}</span>
      </div>
    </motion.div>
  );
}

/* ================================================================
   HOBBY DECK — center stack + left/right diagonal piles
   ================================================================ */
export default function HobbyDeck({ hobbies, onSelect, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState(null);
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [skippedHobbies, setSkippedHobbies] = useState([]);

  const handleSwipe = useCallback((direction) => {
    const hobby = hobbies[currentIndex];
    setExitDirection(direction);

    let newSelected = selectedHobbies;
    if (direction === 'right') {
      newSelected = [...selectedHobbies, hobby];
      setSelectedHobbies(newSelected);
      onSelect?.(hobby, newSelected);
    } else {
      setSkippedHobbies(prev => [...prev, hobby]);
    }

    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= hobbies.length) {
        onComplete?.(newSelected);
      } else {
        setCurrentIndex(nextIndex);
        setExitDirection(null);
      }
    }, 300);
  }, [currentIndex, hobbies, selectedHobbies, onSelect, onComplete]);

  const progress = (currentIndex / hobbies.length) * 100;

  // Get visible cards (top + next 2 in stack)
  const visibleCards = [];
  for (let i = 0; i < 3; i++) {
    const idx = currentIndex + i;
    if (idx < hobbies.length) {
      visibleCards.push({ hobby: hobbies[idx], stackIndex: i });
    }
  }

  // Last 3 from each pile (most recent first)
  const leftPile = skippedHobbies.slice(-3).reverse();
  const rightPile = selectedHobbies.slice(-3).reverse();

  return (
    <div className="hobby-deck">
      {/* Progress bar */}
      <div className="hobby-deck__progress">
        <motion.div
          className="hobby-deck__progress-fill"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <div className="hobby-deck__progress-text text-muted">
        {currentIndex} of {hobbies.length}
      </div>

      {/* 3-column layout: left pile | center stack | right pile */}
      <div className="hobby-deck__arena">
        {/* Left pile — skipped cards */}
        <div className="hobby-deck__pile hobby-deck__pile--left">
          <AnimatePresence>
            {leftPile.map((hobby, i) => (
              <PileCard key={hobby.id} hobby={hobby} index={i} side="left" />
            ))}
          </AnimatePresence>
          {skippedHobbies.length > 0 && (
            <span className="hobby-deck__pile-label text-muted font-accent">skipped</span>
          )}
        </div>

        {/* Center — active card stack */}
        <div className="hobby-deck__stack">
          <AnimatePresence mode="popLayout">
            {visibleCards.reverse().map(({ hobby, stackIndex }) => (
              <motion.div
                key={hobby.id}
                className="hobby-deck__card-wrapper"
                initial={stackIndex === 0 ? { scale: 0.95, y: 10, opacity: 0.5 } : undefined}
                animate={{
                  scale: stackIndex === 0 ? 1 : 1 - stackIndex * 0.05,
                  y: stackIndex * 8,
                  opacity: stackIndex === 0 ? 1 : 1 - stackIndex * 0.3,
                  zIndex: 3 - stackIndex,
                }}
                exit={
                  exitDirection === 'right'
                    ? { x: 250, y: -60, rotate: 18, opacity: 0 }
                    : exitDirection === 'left'
                    ? { x: -250, y: -60, rotate: -18, opacity: 0 }
                    : { opacity: 0 }
                }
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                }}
              >
                <HobbyCard
                  hobby={hobby}
                  isTop={stackIndex === 0}
                  onSwipe={handleSwipe}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Right pile — liked cards */}
        <div className="hobby-deck__pile hobby-deck__pile--right">
          <AnimatePresence>
            {rightPile.map((hobby, i) => (
              <PileCard key={hobby.id} hobby={hobby} index={i} side="right" />
            ))}
          </AnimatePresence>
          {selectedHobbies.length > 0 && (
            <span className="hobby-deck__pile-label hobby-deck__pile-label--right text-muted font-accent">liked ♥</span>
          )}
        </div>
      </div>
    </div>
  );
}
