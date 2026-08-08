import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../common/Button';
import { hobbies } from '../../data/hobbies';
import { getTrendingCommunities } from '../../data/communities';
import './SurpriseMe.css';

/* ================================================================
   SURPRISE ME — random hobby reveal on click
   ================================================================ */
export default function SurpriseMe() {
  const navigate = useNavigate();
  const [revealed, setRevealed] = useState(null);
  const [shuffling, setShuffling] = useState(false);
  const [key, setKey] = useState(0);

  const handleSurprise = useCallback(() => {
    setShuffling(true);
    setRevealed(null);

    // Brief shuffle delay for drama
    setTimeout(() => {
      const randomHobby = hobbies[Math.floor(Math.random() * hobbies.length)];
      const communities = getTrendingCommunities();
      const relatedCommunity = communities.find(c =>
        c.interest?.toLowerCase() === randomHobby.category?.toLowerCase()
      ) || communities[Math.floor(Math.random() * communities.length)];

      setRevealed({ hobby: randomHobby, community: relatedCommunity });
      setShuffling(false);
      setKey(prev => prev + 1);
    }, 600);
  }, []);

  return (
    <motion.section
      className="surprise"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
    >
      <div className="surprise__inner">
        <motion.div
          className="surprise__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="surprise__label font-accent">feeling adventurous?</span>
          <h2 className="surprise__title">Don't know what you're into?</h2>
        </motion.div>

        <div className="surprise__arena">
          {/* The button */}
          <AnimatePresence mode="wait">
            {!revealed && !shuffling && (
              <motion.button
                className="surprise__trigger"
                onClick={handleSurprise}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <span className="surprise__trigger-text">SURPRISE ME</span>
                <span className="surprise__trigger-arrow">↗</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Shuffling state */}
          <AnimatePresence>
            {shuffling && (
              <motion.div
                className="surprise__shuffling"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.span
                  className="surprise__shuffling-emoji"
                  animate={{ rotate: [0, 15, -15, 10, -10, 0], scale: [1, 1.1, 0.9, 1.05, 1] }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                >
                  🎲
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Revealed hobby */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                key={key}
                className="surprise__result"
                initial={{ opacity: 0, scale: 0.8, rotate: -5, y: 30 }}
                animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              >
                <div className="surprise__result-card" style={{ borderColor: revealed.hobby.color }}>
                  <span className="surprise__result-emoji">{revealed.hobby.emoji}</span>
                  <h3 className="surprise__result-name">{revealed.hobby.name}</h3>
                  <p className="surprise__result-desc text-muted">{revealed.hobby.description}</p>
                  <span className="surprise__result-category" style={{ borderColor: revealed.hobby.color }}>
                    {revealed.hobby.category}
                  </span>
                </div>

                <p className="surprise__result-copy font-accent">
                  You didn't plan on this. But maybe this is your thing.
                </p>

                <div className="surprise__result-actions">
                  <Button
                    size="md"
                    onClick={() => navigate('/onboarding')}
                    iconRight={<ArrowRight size={16} />}
                  >
                    Explore
                  </Button>
                  <button className="surprise__result-again" onClick={handleSurprise}>
                    Try again →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
