import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import './CommonGroundMerge.css';

/* ---------------------------------------------------------------
   COMMON GROUND MERGE — Two interests collide on scroll

   As user scrolls, two hobby blocks move toward each other.
   When they meet → spring reveal of the combined interest.
   --------------------------------------------------------------- */

const COMBOS = [
  { a: { name: 'Photography', emoji: '📸' }, b: { name: 'Writing', emoji: '✍️' }, result: { name: 'Visual Storytelling', emoji: '📖' }, color: '#4D7CFE' },
  { a: { name: 'Film', emoji: '🎬' }, b: { name: 'Writing', emoji: '✍️' }, result: { name: 'Screenwriting', emoji: '🎞️' }, color: '#9B72FF' },
  { a: { name: 'Guitar', emoji: '🎸' }, b: { name: 'Dance', emoji: '💃' }, result: { name: 'Acoustic Sessions', emoji: '🎵' }, color: '#FF914D' },
  { a: { name: 'Astronomy', emoji: '🔭' }, b: { name: 'Photography', emoji: '📸' }, result: { name: 'Astrophotography', emoji: '🌌' }, color: '#4D7CFE' },
];

export default function CommonGroundMerge() {
  const sectionRef = useRef(null);
  const [merged, setMerged] = useState(false);

  // Pick a deterministic combo based on the day
  const combo = COMBOS[new Date().getDate() % COMBOS.length];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.8', 'center center'],
  });

  // Left block: moves from -180 → 0
  const leftX = useTransform(scrollYProgress, [0, 0.7, 1], [-180, -40, 0]);
  // Right block: moves from 180 → 0
  const rightX = useTransform(scrollYProgress, [0, 0.7, 1], [180, 40, 0]);

  // Trigger merge when scroll hits threshold
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v > 0.92 && !merged) {
      setMerged(true);
      window.dispatchEvent(new Event('sunflower-react'));
    }
  });

  return (
    <section ref={sectionRef} className="merge">
      <div className="merge__inner">
        {/* Header */}
        <motion.div
          className="merge__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="merge__label font-accent">common ground</span>
          <h2 className="merge__title">
            different interests.<br />
            same wavelength.
          </h2>
        </motion.div>

        {/* Merge area */}
        <div className="merge__stage">
          {/* Left block */}
          <motion.div
            className="merge__block merge__block--left"
            style={{ x: leftX }}
          >
            <span className="merge__block-emoji">{combo.a.emoji}</span>
            <span className="merge__block-name">{combo.a.name}</span>
          </motion.div>

          {/* Plus sign / merge point */}
          <motion.div
            className="merge__plus"
            animate={{
              scale: merged ? 0 : 1,
              rotate: merged ? 180 : 0,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            +
          </motion.div>

          {/* Right block */}
          <motion.div
            className="merge__block merge__block--right"
            style={{ x: rightX }}
          >
            <span className="merge__block-emoji">{combo.b.emoji}</span>
            <span className="merge__block-name">{combo.b.name}</span>
          </motion.div>

          {/* Result — appears on merge */}
          {merged && (
            <motion.div
              className="merge__result"
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.15,
              }}
            >
              <div className="merge__result-accent" style={{ backgroundColor: combo.color }} />
              <span className="merge__result-emoji">{combo.result.emoji}</span>
              <span className="merge__result-name">{combo.result.name}</span>
              <span className="merge__result-label font-accent">
                that's common ground.
              </span>
            </motion.div>
          )}
        </div>

        {/* Annotation */}
        <motion.span
          className="merge__annotation font-accent"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          ↑ scroll slowly
        </motion.span>
      </div>
    </section>
  );
}
