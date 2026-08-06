import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import HobbyDeck from '../components/hobby/HobbyDeck';
import SwipeControls from '../components/hobby/SwipeControls';
import Sunflower from '../components/common/Sunflower';
import Smiley from '../components/common/Smiley';
import Button from '../components/common/Button';
import InterestTag from '../components/common/InterestTag';
import { hobbies } from '../data/hobbies';
import { staggerContainer, staggerItem } from '../animations/variants';
import './Onboarding.css';

export default function Onboarding() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('intro'); // intro | swiping | complete
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const deckRef = useRef(null);

  const handleSelect = useCallback((hobby, allSelected) => {
    setSelectedHobbies(allSelected);
  }, []);

  const handleComplete = useCallback((finalSelected) => {
    setSelectedHobbies(finalSelected);
    // Store in localStorage for the prototype
    localStorage.setItem('cg-interests', JSON.stringify(finalSelected.map(h => h.id)));
    localStorage.setItem('cg-onboarded', 'true');
    setPhase('complete');
  }, []);

  const handleSkipToGround = () => {
    if (selectedHobbies.length > 0) {
      localStorage.setItem('cg-interests', JSON.stringify(selectedHobbies.map(h => h.id)));
      localStorage.setItem('cg-onboarded', 'true');
    }
    navigate('/ground');
  };

  // Shuffle hobbies for variety
  const shuffledHobbies = useRef(
    [...hobbies].sort(() => Math.random() - 0.5).slice(0, 12)
  ).current;

  return (
    <div className="onboarding">
      <AnimatePresence mode="wait">
        {/* --- INTRO PHASE --- */}
        {phase === 'intro' && (
          <motion.div
            key="intro"
            className="onboarding__intro"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
          >
            <motion.div variants={staggerItem}>
              <Smiley size={48} mood="happy" />
            </motion.div>
            <motion.h1 className="onboarding__title" variants={staggerItem}>
              What are you into?
            </motion.h1>
            <motion.p className="onboarding__subtitle text-muted" variants={staggerItem}>
              Swipe right on things you like. Left on things you don't.<br />
              No pressure — you can always change this later.
            </motion.p>
            <motion.div variants={staggerItem}>
              <Button
                size="lg"
                onClick={() => setPhase('swiping')}
                iconRight={<ArrowRight size={20} />}
              >
                Let's go
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* --- SWIPING PHASE --- */}
        {phase === 'swiping' && (
          <motion.div
            key="swiping"
            className="onboarding__swiping"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <HobbyDeck
              ref={deckRef}
              hobbies={shuffledHobbies}
              onSelect={handleSelect}
              onComplete={handleComplete}
            />

            <SwipeControls
              onSkip={() => {
                // Programmatic swipe left
                const event = new CustomEvent('hobby-swipe', { detail: 'left' });
                window.dispatchEvent(event);
                // Fallback: simulate via deck
                deckRef.current?.handleSwipe?.('left');
              }}
              onLike={() => {
                const event = new CustomEvent('hobby-swipe', { detail: 'right' });
                window.dispatchEvent(event);
                deckRef.current?.handleSwipe?.('right');
              }}
            />

            {/* Selected count */}
            {selectedHobbies.length > 0 && (
              <motion.div
                className="onboarding__selected-count"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="font-accent">
                  {selectedHobbies.length} interest{selectedHobbies.length !== 1 ? 's' : ''} selected
                </span>
              </motion.div>
            )}

            {/* Skip link */}
            <button
              className="onboarding__skip-link text-muted"
              onClick={handleSkipToGround}
            >
              Skip for now →
            </button>
          </motion.div>
        )}

        {/* --- COMPLETE PHASE --- */}
        {phase === 'complete' && (
          <motion.div
            key="complete"
            className="onboarding__complete"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={staggerItem}>
              <Sunflower size={72} />
            </motion.div>

            <motion.h1 className="onboarding__title" variants={staggerItem}>
              {selectedHobbies.length > 0
                ? "We know a little more about you."
                : "That's okay!"
              }
            </motion.h1>

            {selectedHobbies.length > 0 ? (
              <>
                <motion.p className="onboarding__subtitle text-muted" variants={staggerItem}>
                  You're into {selectedHobbies.length} thing{selectedHobbies.length !== 1 ? 's' : ''}. Let's find your CommonGround.
                </motion.p>

                <motion.div className="onboarding__selected-tags" variants={staggerItem}>
                  {selectedHobbies.map(h => (
                    <InterestTag
                      key={h.id}
                      label={h.name}
                      emoji={h.emoji}
                      color={h.color}
                      selected
                    />
                  ))}
                </motion.div>
              </>
            ) : (
              <motion.p className="onboarding__subtitle text-muted" variants={staggerItem}>
                You can always explore interests later.
              </motion.p>
            )}

            <motion.div variants={staggerItem}>
              <Button
                size="lg"
                onClick={() => navigate('/ground')}
                iconRight={<ArrowRight size={20} />}
              >
                Find your CommonGround
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
