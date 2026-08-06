import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import HobbyCard from './HobbyCard';
import './HobbyDeck.css';

export default function HobbyDeck({ hobbies, onSelect, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState(null);
  const [selectedHobbies, setSelectedHobbies] = useState([]);

  const handleSwipe = useCallback((direction) => {
    const hobby = hobbies[currentIndex];

    setExitDirection(direction);

    if (direction === 'right') {
      const newSelected = [...selectedHobbies, hobby];
      setSelectedHobbies(newSelected);
      onSelect?.(hobby, newSelected);
    }

    // Small delay for exit animation
    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= hobbies.length) {
        onComplete?.(direction === 'right'
          ? [...selectedHobbies, hobby]
          : selectedHobbies
        );
      } else {
        setCurrentIndex(nextIndex);
        setExitDirection(null);
      }
    }, 300);
  }, [currentIndex, hobbies, selectedHobbies, onSelect, onComplete]);

  const progress = ((currentIndex) / hobbies.length) * 100;

  // Get visible cards (top + next 2 in stack)
  const visibleCards = [];
  for (let i = 0; i < 3; i++) {
    const idx = currentIndex + i;
    if (idx < hobbies.length) {
      visibleCards.push({ hobby: hobbies[idx], stackIndex: i });
    }
  }

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

      {/* Card stack */}
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
                  ? { x: 350, rotate: 20, opacity: 0 }
                  : exitDirection === 'left'
                  ? { x: -350, rotate: -20, opacity: 0 }
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
    </div>
  );
}
