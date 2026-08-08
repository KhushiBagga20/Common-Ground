import { useRef, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Compass, Sun, Moon } from 'lucide-react';
import Button from '../components/common/Button';
import InteractiveCheckerboard from '../components/common/InteractiveCheckerboard';
import SunflowerMascot from '../components/common/SunflowerMascot';
import RabbitHole from '../components/landing/RabbitHole';
import SurpriseMe from '../components/landing/SurpriseMe';
import { getTrendingCommunities } from '../data/communities';
import { useTheme } from '../hooks/useTheme';
import { staggerContainer, staggerItem } from '../animations/variants';
import './Landing.css';

/* ================================================================
   FLOATING INTEREST WORDS — appear around the hero on hover
   ================================================================ */
const FLOAT_WORDS = [
  { text: 'film', x: '62%', y: '18%' },
  { text: 'guitar', x: '55%', y: '42%' },
  { text: 'cooking', x: '70%', y: '58%' },
  { text: 'astronomy', x: '48%', y: '72%' },
  { text: 'running', x: '75%', y: '32%' },
  { text: 'drawing', x: '58%', y: '85%' },
  { text: 'chess', x: '82%', y: '48%' },
  { text: 'dance', x: '45%', y: '55%' },
];

function FloatingWord({ word, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.span
          className="landing__float-word font-accent"
          style={{ left: word.x, top: word.y }}
          initial={{ opacity: 0, scale: 0.7, y: 8 }}
          animate={{ opacity: 0.6, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -6 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {word.text}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

/* ================================================================
   INTERACTIVE TITLE WORD — hover reveals underline + shift
   ================================================================ */
function TitleWord({ children, color = 'var(--yellow)', delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.span
      className="landing__title-word"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        x: hovered ? 3 : 0,
        scale: hovered ? 1.02 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {children}
      <svg className="landing__title-squiggle" viewBox="0 0 120 8" preserveAspectRatio="none" aria-hidden="true">
        <motion.path
          d="M2 6 Q 15 1, 30 6 Q 45 11, 60 6 Q 75 1, 90 6 Q 105 11, 118 6"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: hovered ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
    </motion.span>
  );
}

/* ================================================================
   3D TILT CARD — spring-physics tilt on hover
   ================================================================ */
function TiltCard({ children, className = '', onClick, delay = 0 }) {
  const cardRef = useRef(null);
  const rawRotX = useMotionValue(0);
  const rawRotY = useMotionValue(0);
  const rotX = useSpring(rawRotX, { stiffness: 300, damping: 24 });
  const rotY = useSpring(rawRotY, { stiffness: 300, damping: 24 });

  const handleMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    rawRotX.set(-ny * 10);
    rawRotY.set(nx * 10);
  };

  const handleLeave = () => {
    rawRotX.set(0);
    rawRotY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={className}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 900 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.18 } }}
    >
      {children}
    </motion.div>
  );
}

/* ================================================================
   LANDING PAGE
   ================================================================ */
export default function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const trendingCommunities = getTrendingCommunities().slice(0, 4);
  const [heroHovered, setHeroHovered] = useState(false);
  const [floatIndices, setFloatIndices] = useState([]);

  /* Floating words: cycle 2-3 at a time while hero is hovered */
  useEffect(() => {
    if (!heroHovered) {
      setFloatIndices([]);
      return;
    }
    const cycle = () => {
      const count = 2 + Math.floor(Math.random() * 2); // 2-3 words
      const indices = [];
      while (indices.length < count) {
        const idx = Math.floor(Math.random() * FLOAT_WORDS.length);
        if (!indices.includes(idx)) indices.push(idx);
      }
      setFloatIndices(indices);
    };
    cycle();
    const interval = setInterval(cycle, 2800);
    return () => clearInterval(interval);
  }, [heroHovered]);

  /* CTA hover → sunflower looks at button */
  const handleCtaHover = useCallback((e) => {
    window.dispatchEvent(new CustomEvent('sunflower-look', { detail: { element: e.currentTarget } }));
  }, []);

  const handleCtaLeave = useCallback(() => {
    window.dispatchEvent(new CustomEvent('sunflower-look', { detail: {} }));
  }, []);

  const handleCtaClick = useCallback((path) => {
    window.dispatchEvent(new Event('sunflower-react'));
    setTimeout(() => navigate(path), 400);
  }, [navigate]);

  return (
    <div className="landing">

      {/* Theme toggle */}
      <motion.button
        className="landing__theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
      >
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </motion.button>

      {/* Full-page checkerboard background */}
      <InteractiveCheckerboard />
      <div className="landing__page-overlay" aria-hidden="true" />

      {/* ======================================================
          HERO
          ====================================================== */}
      <section
        className="landing__hero"
        onMouseEnter={() => setHeroHovered(true)}
        onMouseLeave={() => setHeroHovered(false)}
      >

        {/* Floating interest words */}
        <div className="landing__float-container" aria-hidden="true">
          {FLOAT_WORDS.map((word, i) => (
            <FloatingWord key={word.text} word={word} visible={floatIndices.includes(i)} />
          ))}
        </div>

        {/* Logo */}
        <motion.a
          href="/"
          className="landing__logo"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="landing__logo-mark">⬛</span>
          <span>CommonGround</span>
        </motion.a>

        {/* Left — Interactive Copy */}
        <motion.div
          className="landing__hero-left"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div className="landing__hero-label" variants={staggerItem}>
            <span className="font-accent">a place for curious people</span>
          </motion.div>

          <h1 className="landing__hero-title">
            <TitleWord color="var(--yellow)">FIND</TitleWord>
            <TitleWord color="var(--blue)">YOUR</TitleWord>
            <br />
            <TitleWord color="var(--pink)">PEOPLE<span className="landing__title-dot">.</span></TitleWord>
          </h1>

          <motion.p className="landing__hero-subtitle" variants={staggerItem}>
            Discover hobbies, find your community, and connect with people
            who are into the same strange little things you are.
          </motion.p>

          <motion.div className="landing__hero-actions" variants={staggerItem}>
            <div
              onMouseEnter={handleCtaHover}
              onMouseLeave={handleCtaLeave}
            >
              <Button
                size="lg"
                onClick={() => handleCtaClick('/onboarding')}
                iconRight={<ArrowRight size={20} />}
              >
                Discover Hobbies
              </Button>
            </div>
            <div
              onMouseEnter={handleCtaHover}
              onMouseLeave={handleCtaLeave}
            >
              <Button
                variant="secondary"
                size="lg"
                onClick={() => handleCtaClick('/explore')}
                icon={<Compass size={18} />}
              >
                Explore first
              </Button>
            </div>
          </motion.div>

          <motion.div className="landing__hero-tagline" variants={staggerItem}>
            <span className="landing__hero-tagline-text font-accent">↓ start here!</span>
          </motion.div>
        </motion.div>

        {/* Right — Alive Sunflower */}
        <div className="landing__hero-right">
          <SunflowerMascot />
        </div>
      </section>



      {/* ======================================================
          RABBIT HOLE — progressive discovery
          ====================================================== */}
      <RabbitHole />

      {/* ======================================================
          SURPRISE ME — random hobby reveal
          ====================================================== */}
      <SurpriseMe />

      {/* ======================================================
          TRENDING COMMUNITIES — 3D tilt cards
          ====================================================== */}
      <motion.section
        className="landing__trending"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="landing__section-header">
          <h2 className="landing__section-title">Trending communities</h2>
          <p className="landing__section-subtitle text-muted">
            People are talking right now
          </p>
        </div>

        <div className="landing__trending-grid">
          {trendingCommunities.map((community, i) => (
            <TiltCard
              key={community.id}
              className="landing__trending-card"
              onClick={() => navigate(`/community/${community.id}`)}
              delay={i * 0.08}
            >
              <div
                className="landing__trending-accent"
                style={{ backgroundColor: community.color }}
              />
              <h3 className="landing__trending-name">{community.name}</h3>
              <p className="landing__trending-desc text-muted">{community.description}</p>
              <div className="landing__trending-meta">
                <span>{community.memberCount} people</span>
                <span>·</span>
                <span>{community.postCount} posts</span>
              </div>
            </TiltCard>
          ))}
        </div>
      </motion.section>

      {/* ======================================================
          CTA
          ====================================================== */}
      <motion.section
        className="landing__cta"
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="landing__cta-checker" aria-hidden="true" />
        <div className="landing__cta-inner">
          <p className="landing__cta-text font-accent">
            Ready to find your people?
          </p>
          <Button
            size="lg"
            onClick={() => handleCtaClick('/onboarding')}
            iconRight={<ArrowRight size={20} />}
          >
            Let's go
          </Button>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="landing__footer">
        <span className="landing__footer-mark">⬛</span>
        <span>CommonGround</span>
        <span className="text-muted">·</span>
        <span className="text-muted font-accent">find your people</span>
      </footer>
    </div>
  );
}
