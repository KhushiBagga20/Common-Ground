import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import CardSwap, { HOBBIES_DECK } from '../components/CardSwap/CardSwap';
import KineticCheckerboard from '../components/common/KineticCheckerboard';
import { useTheme } from '../hooks/useTheme';
import { staggerContainer, staggerItem } from '../animations/variants';
import './Discover.css';

/* ================================================================
   DISCOVER PAGE — Full-screen "Hobby Tinder" experience
   ================================================================ */
export default function Discover() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [feedback, setFeedback] = useState('');
  const [selectedHobbies, setSelectedHobbies] = useState([]);

  const progressCount = Math.min(selectedHobbies.length, HOBBIES_DECK.length);

  const handleSelectionChange = useCallback((hobbies) => {
    setSelectedHobbies(hobbies);
    // Persist to localStorage so Ground page picks up the selections
    if (hobbies.length > 0) {
      localStorage.setItem('cg-interests', JSON.stringify(hobbies.map(h => h.id)));
      localStorage.setItem('cg-onboarded', 'true');
    }
  }, []);

  return (
    <div className="discover">
      {/* Animated checkered background */}
      <KineticCheckerboard />

      {/* Back button */}
      <motion.button
        className="discover__back"
        onClick={() => navigate(-1)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <ArrowLeft size={16} />
        Back
      </motion.button>

      {/* Theme toggle */}
      <motion.button
        className="discover__theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
      >
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </motion.button>

      {/* Header */}
      <motion.div
        className="discover__header"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.h1 className="discover__title" variants={staggerItem}>
          What Are You Into?
        </motion.h1>
        <motion.p className="discover__subtitle" variants={staggerItem}>
          Swipe right on things you like. Left on things you don't.
        </motion.p>

        {/* Counter & Feedback */}
        <motion.div className="discover__meta" variants={staggerItem}>
          <div className="discover__progress-badge">
            <span style={{ fontSize: '10px' }}>⬛</span>
            <span>
              {String(progressCount + 1).padStart(2, '0')} / {String(HOBBIES_DECK.length).padStart(2, '0')} hobbies
            </span>
          </div>

          <AnimatePresence mode="wait">
            {feedback && (
              <motion.span
                key={feedback}
                className="discover__feedback"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {feedback}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Enlarged Card Deck */}
      <div className="discover__deck">
        <CardSwap
          items={HOBBIES_DECK}
          onFeedbackChange={setFeedback}
          onSelectionChange={handleSelectionChange}
        />
      </div>
    </div>
  );
}
