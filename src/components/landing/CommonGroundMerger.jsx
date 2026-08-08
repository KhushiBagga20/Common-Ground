import { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import './CommonGroundMerger.css';

/* ================================================================
   COMBINATIONS — hardcoded interest pairs that merge
   ================================================================ */
const COMBOS = [
  { left: { name: 'Film', emoji: '🎬', color: '#9B72FF' }, right: { name: 'Astronomy', emoji: '🔭', color: '#4D7CFE' }, result: 'Astrophotography', resultEmoji: '🌌' },
  { left: { name: 'Cooking', emoji: '🍳', color: '#FF5C5C' }, right: { name: 'Science', emoji: '🧪', color: '#4D7CFE' }, result: 'Food Science', resultEmoji: '🧫' },
  { left: { name: 'Drawing', emoji: '✏️', color: '#FFD43B' }, right: { name: 'Coding', emoji: '💻', color: '#9B72FF' }, result: 'Creative Coding', resultEmoji: '🎨' },
  { left: { name: 'Music', emoji: '🎵', color: '#FF72B6' }, right: { name: 'Running', emoji: '🏃', color: '#5BCB77' }, result: 'Running Playlists', resultEmoji: '🎧' },
];

const SNAP_DISTANCE = 100; // how close cards need to be to merge (px)

/* ================================================================
   MERGER CARD — draggable interest
   ================================================================ */
function MergerCard({ interest, side, onPositionUpdate, merged }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleDrag = useCallback((_, info) => {
    onPositionUpdate?.(side, info.point.x, info.point.y);
  }, [side, onPositionUpdate]);

  return (
    <motion.div
      className={`merger__card merger__card--${side}`}
      style={{ x: springX, y: springY }}
      drag
      dragElastic={0.15}
      dragMomentum={false}
      onDrag={handleDrag}
      onDragEnd={() => {
        // Spring back if not merged
        if (!merged) {
          x.set(0);
          y.set(0);
        }
      }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      animate={merged ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div className="merger__card-accent" style={{ backgroundColor: interest.color }} />
      <span className="merger__card-emoji">{interest.emoji}</span>
      <span className="merger__card-name">{interest.name}</span>
    </motion.div>
  );
}

/* ================================================================
   COMMON GROUND MERGER
   ================================================================ */
export default function CommonGroundMerger() {
  const [comboIdx, setComboIdx] = useState(0);
  const [merged, setMerged] = useState(false);
  const positionsRef = useRef({ left: null, right: null });

  const combo = COMBOS[comboIdx];

  const handlePositionUpdate = useCallback((side, px, py) => {
    positionsRef.current[side] = { x: px, y: py };

    const { left, right } = positionsRef.current;
    if (!left || !right) return;

    const dist = Math.sqrt(
      (left.x - right.x) ** 2 + (left.y - right.y) ** 2
    );

    if (dist < SNAP_DISTANCE && !merged) {
      setMerged(true);
    }
  }, [merged]);

  const handleNext = useCallback(() => {
    setMerged(false);
    positionsRef.current = { left: null, right: null };
    setComboIdx((prev) => (prev + 1) % COMBOS.length);
  }, []);

  return (
    <motion.section
      className="merger"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
    >
      <div className="merger__inner">
        <motion.div
          className="merger__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="merger__label font-accent">try it</span>
          <h2 className="merger__title">What happens when interests collide?</h2>
          <p className="merger__subtitle text-muted">Drag them together and find out.</p>
        </motion.div>

        <div className="merger__arena">
          {/* Draggable cards */}
          <AnimatePresence mode="wait">
            {!merged && (
              <>
                <MergerCard
                  key={`left-${comboIdx}`}
                  interest={combo.left}
                  side="left"
                  onPositionUpdate={handlePositionUpdate}
                  merged={merged}
                />

                <div className="merger__plus font-accent" aria-hidden="true">+</div>

                <MergerCard
                  key={`right-${comboIdx}`}
                  interest={combo.right}
                  side="right"
                  onPositionUpdate={handlePositionUpdate}
                  merged={merged}
                />
              </>
            )}
          </AnimatePresence>

          {/* Merged result */}
          <AnimatePresence>
            {merged && (
              <motion.div
                className="merger__result"
                initial={{ scale: 0, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <span className="merger__result-label font-accent">common ground!</span>
                <span className="merger__result-emoji">{combo.resultEmoji}</span>
                <span className="merger__result-name">{combo.result}</span>
                <span className="merger__result-from text-muted">
                  {combo.left.emoji} {combo.left.name} + {combo.right.emoji} {combo.right.name}
                </span>
                <button className="merger__result-again" onClick={handleNext}>
                  Try another →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
