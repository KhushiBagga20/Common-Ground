import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardSwap, { HOBBIES_DECK } from '../CardSwap/CardSwap';
import './HobbyCardStack.css';

/* ---------------------------------------------------------------
   HOBBY CARD STACK SECTION — Yellow Ribbon Title & Centered Deck
   --------------------------------------------------------------- */

export default function HobbyCardStack() {
  const [feedback, setFeedback] = useState('');
  const [selectedHobbies, setSelectedHobbies] = useState([]);

  const progressCount = Math.min(selectedHobbies.length, HOBBIES_DECK.length);

  return (
    <motion.section
      className="cardstack"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
    >
      {/* Clean Header Area with Yellow Ribbon Title */}
      <div className="cardstack__header-clean">
        <h2 className="cardstack__clean-title">
          What Are You Into?
        </h2>

        {/* Counter & Feedback inline */}
        <div className="cardstack__header-meta">
          <div className="cardstack__progress-badge">
            <span style={{ fontSize: '10px' }}>⬛</span>
            <span className="cardstack__progress-text">
              {String(progressCount + 1).padStart(2, '0')} / {String(HOBBIES_DECK.length).padStart(2, '0')} hobbies
            </span>
          </div>

          <AnimatePresence mode="wait">
            {feedback && (
              <motion.span
                key={feedback}
                className="cardstack__feedback-note"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {feedback}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* CardSwap Deck Centered Below Heading */}
      <div className="cardstack__deck-wrapper">
        <CardSwap
          items={HOBBIES_DECK}
          onFeedbackChange={setFeedback}
          onSelectionChange={setSelectedHobbies}
        />
      </div>
    </motion.section>
  );
}
