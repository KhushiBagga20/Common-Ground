import { useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight, Heart, X, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CardSwap.css';

export const HOBBIES_DECK = [
  {
    id: 'photography',
    name: 'Photography',
    emoji: '📸',
    description: 'Find stories hiding in ordinary places.',
    count: '1.2k people interested',
    annotation: 'curious eye',
    color: '#FFD43B'
  },
  {
    id: 'guitar',
    name: 'Guitar',
    emoji: '🎸',
    description: 'Three chords away from a personality.',
    count: '842 people interested',
    annotation: 'late night jams',
    color: '#FF72B6'
  },
  {
    id: 'film',
    name: 'Film',
    emoji: '🎬',
    description: 'Watch critically, discuss passionately.',
    count: '1.1k people interested',
    annotation: 'indie gems',
    color: '#4D7CFE'
  },
  {
    id: 'astronomy',
    name: 'Astronomy',
    emoji: '🔭',
    description: 'Stargaze, wonder, look at distant galaxies.',
    count: '650 people interested',
    annotation: 'cosmic scale',
    color: '#9B72FF'
  },
  {
    id: 'cooking',
    name: 'Cooking',
    emoji: '🍳',
    description: 'Feed yourself something better than ramen.',
    count: '1.5k people interested',
    annotation: 'flavor master',
    color: '#FF914D'
  },
  {
    id: 'drawing',
    name: 'Drawing',
    emoji: '✏️',
    description: "Put what's in your head onto paper.",
    count: '920 people interested',
    annotation: 'doodle mode',
    color: '#5BCB77'
  },
  {
    id: 'running',
    name: 'Running',
    emoji: '🏃',
    description: 'Just you, the road, and your thoughts.',
    count: '1.4k people interested',
    annotation: 'runner high',
    color: '#5BCB77'
  },
  {
    id: 'writing',
    name: 'Writing',
    emoji: '✍️',
    description: 'Stories, poems, essays, journals.',
    count: '780 people interested',
    annotation: 'ink & words',
    color: '#FF72B6'
  },
  {
    id: 'dance',
    name: 'Dance',
    emoji: '💃',
    description: 'Move to the rhythm, express yourself.',
    count: '610 people interested',
    annotation: 'feel the beat',
    color: '#FF914D'
  },
  {
    id: 'gaming',
    name: 'Gaming',
    emoji: '🎮',
    description: 'Enter new worlds with great stories.',
    count: '1.8k people interested',
    annotation: 'pixel quest',
    color: '#9B72FF'
  },
  {
    id: 'pottery',
    name: 'Pottery',
    emoji: '🏺',
    description: 'Get your hands dirty with clay.',
    count: '530 people interested',
    annotation: 'spin the wheel',
    color: '#FFD43B'
  },
  {
    id: 'skateboarding',
    name: 'Skateboarding',
    emoji: '🛹',
    description: 'Find lines in the concrete city.',
    count: '490 people interested',
    annotation: 'street flow',
    color: '#4D7CFE'
  }
];

const RIGHT_ANNOTATIONS = [
  'nice choice.',
  'we had a feeling.',
  'spot on.',
  'great taste.',
  'into it!'
];

const LEFT_ANNOTATIONS = [
  'fair enough.',
  "not everyone's thing.",
  'moving on...',
  'next up!'
];

function SwapCard({ hobby, isTop, stackIndex, totalVisible, onSwipe, exitDirection }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-16, 16]);
  const likeOpacity = useTransform(x, [15, 80], [0, 1]);
  const skipOpacity = useTransform(x, [-15, -80], [0, 1]);

  function handleDragEnd(_, info) {
    const threshold = 80;
    if (info.offset.x > threshold) {
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      onSwipe('left');
    }
  }

  return (
    <motion.div
      className={`cardswap__card ${isTop ? 'cardswap__card--top' : ''}`}
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
      }}
      initial={{ scale: 0.88, y: 40, opacity: 0 }}
      animate={{
        scale: 1 - stackIndex * 0.04,
        y: stackIndex * 14,
        opacity: 1 - stackIndex * 0.15,
        zIndex: totalVisible - stackIndex,
      }}
      exit={
        exitDirection === 'right'
          ? { x: 380, y: -20, rotate: 22, opacity: 0 }
          : exitDirection === 'left'
          ? { x: -380, y: -20, rotate: -22, opacity: 0 }
          : { opacity: 0 }
      }
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.75}
      onDragEnd={isTop ? handleDragEnd : undefined}
      whileHover={isTop ? { cursor: 'grab' } : {}}
      whileDrag={{ cursor: 'grabbing' }}
    >
      {/* Top Accent Stripe */}
      <div className="cardswap__card-stripe" style={{ background: hobby.color }} />

      {/* Dynamic Drag Stamp Indicators */}
      {isTop && (
        <>
          <motion.div
            className="cardswap__stamp cardswap__stamp--like"
            style={{ opacity: likeOpacity }}
          >
            INTO IT! ✦
          </motion.div>
          <motion.div
            className="cardswap__stamp cardswap__stamp--left cardswap__stamp--skip"
            style={{ opacity: skipOpacity }}
          >
            SKIP ✗
          </motion.div>
        </>
      )}

      {/* Card Header */}
      <div className="cardswap__card-header">
        <span className="cardswap__card-emoji">{hobby.emoji}</span>
        <span className="cardswap__card-tag">{hobby.annotation}</span>
      </div>

      {/* Card Body */}
      <div className="cardswap__card-body">
        <h3 className="cardswap__card-title">{hobby.name}</h3>
        <p className="cardswap__card-desc">{hobby.description}</p>
      </div>

      {/* Card Footer */}
      <div className="cardswap__card-footer">
        <span className="cardswap__card-count">{hobby.count}</span>
        <span className="font-accent" style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
          CommonGround
        </span>
      </div>
    </motion.div>
  );
}

export default function CardSwap({
  items = HOBBIES_DECK,
  onFeedbackChange,
  onSelectionChange
}) {
  const navigate = useNavigate();
  const [deck, setDeck] = useState(items);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [exitDirection, setExitDirection] = useState(null);

  const totalItems = items.length;
  const isCompleted = currentIndex >= totalItems;

  const handleSwipe = useCallback(
    direction => {
      if (currentIndex >= totalItems) return;
      const currentHobby = deck[currentIndex];
      setExitDirection(direction);

      let newFeedback = '';
      if (direction === 'right') {
        newFeedback = RIGHT_ANNOTATIONS[Math.floor(Math.random() * RIGHT_ANNOTATIONS.length)];
        const updatedSelected = [...selectedHobbies, currentHobby];
        setSelectedHobbies(updatedSelected);
        onSelectionChange?.(updatedSelected);
        // Trigger mascot reaction event
        window.dispatchEvent(new Event('sunflower-react'));
      } else {
        newFeedback = LEFT_ANNOTATIONS[Math.floor(Math.random() * LEFT_ANNOTATIONS.length)];
      }

      onFeedbackChange?.(newFeedback);

      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setExitDirection(null);
      }, 260);
    },
    [currentIndex, totalItems, deck, selectedHobbies, onFeedbackChange, onSelectionChange]
  );

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setSelectedHobbies([]);
    setExitDirection(null);
    onFeedbackChange?.('');
    onSelectionChange?.([]);
  }, [onFeedbackChange, onSelectionChange]);

  const visibleCards = deck.slice(currentIndex, currentIndex + 4);

  return (
    <div className="cardswap">
      {!isCompleted ? (
        <>
          {/* Card Stack Area */}
          <div className="cardswap__stage">
            <AnimatePresence mode="popLayout">
              {visibleCards
                .map((hobby, i) => (
                  <SwapCard
                    key={hobby.id}
                    hobby={hobby}
                    isTop={i === 0}
                    stackIndex={i}
                    totalVisible={visibleCards.length}
                    onSwipe={handleSwipe}
                    exitDirection={i === 0 ? exitDirection : null}
                  />
                ))
                .reverse()}
            </AnimatePresence>
          </div>

          {/* Action Control Buttons */}
          <div className="cardswap__controls">
            <button
              type="button"
              className="cardswap__btn"
              onClick={() => handleSwipe('left')}
              aria-label="Not for me"
            >
              <ArrowLeft size={16} />
              <span>← NOT FOR ME</span>
            </button>

            <button
              type="button"
              className="cardswap__btn cardswap__btn--like"
              onClick={() => handleSwipe('right')}
              aria-label="I'm into this"
            >
              <span>I'M INTO THIS →</span>
              <Heart size={16} fill="currentColor" />
            </button>
          </div>
        </>
      ) : (
        /* Card End State */
        <motion.div
          className="cardswap__completion"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          <div className="cardswap__completion-emoji">🌻</div>
          <h3 className="cardswap__completion-title">
            {selectedHobbies.length > 0
              ? 'okay, we see a pattern.'
              : "That's a pretty good mix."}
          </h3>

          {selectedHobbies.length > 0 && (
            <div className="cardswap__completion-tags">
              {selectedHobbies.map(h => (
                <span
                  key={h.id}
                  className="cardswap__completion-tag"
                  style={{ background: h.color }}
                >
                  {h.name}
                </span>
              ))}
            </div>
          )}

          <p className="cardswap__completion-sub">
            These might be your kind of people.
          </p>

          <button
            type="button"
            className="cardswap__btn cardswap__btn--like"
            style={{ width: '100%', marginTop: '12px' }}
            onClick={() => navigate('/explore')}
          >
            <span>EXPLORE COMMUNITIES →</span>
          </button>

          <button
            type="button"
            className="cardswap__reset-btn"
            onClick={handleReset}
          >
            <RotateCcw size={14} style={{ display: 'inline', marginRight: 4 }} />
            Start over ↺
          </button>
        </motion.div>
      )}
    </div>
  );
}
