import { useRef, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Compass, Sun, Moon } from 'lucide-react';
import Button from '../components/common/Button';
import InteractiveCheckerboard from '../components/common/InteractiveCheckerboard';
import SunflowerGroup from '../components/common/SunflowerGroup';
import TextLoop from '../components/common/TextLoop';
import HobbyCloud from '../components/landing/HobbyCloud';
import HobbyPath from '../components/landing/HobbyPath';
import HobbyCardStack from '../components/landing/HobbyCardStack';
import LandingJourney from '../components/landing/LandingJourney';
import Footer from '../components/layout/Footer';
import { useTheme } from '../hooks/useTheme';
import { staggerContainer, staggerItem } from '../animations/variants';
import './Landing.css';

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
   LANDING PAGE
   ================================================================ */
export default function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

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
      <section className="landing__hero">

        {/* Left — Interactive Copy */}
        <motion.div
          className="landing__hero-left"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div className="landing__hero-label" variants={staggerItem}>
            <span className="font-accent" style={{ fontSize: '1.4rem', letterSpacing: '-0.02em', color: 'var(--text)', fontWeight: 800 }}>CommonGround</span>
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
                onClick={() => handleCtaClick('/ground')}
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

        {/* Right — Sunflower group */}
        <div className="landing__hero-right">
          <SunflowerGroup />
        </div>
      </section>

      {/* ======================================================
          TEXT LOOP BANNER — React Bits Animated Text Ribbon
          ====================================================== */}
      <section className="landing__loop-banner" aria-label="About CommonGround">
        <TextLoop
          text="FIND YOUR PEOPLE ✦ DISCOVER NEW HOBBIES ✦ JOIN REAL COMMUNITIES ✦ NOT A SOCIAL FEED ✦ COMMON GROUND"
          shape="wave"
          speed={85}
          direction="forward"
          separator="✦"
          curviness={50}
          fontSize={38}
          fontWeight={800}
          letterSpacing={2}
          uppercase
          color="var(--text)"
          ribbon
          ribbonColor="var(--yellow)"
          ribbonWidth={72}
          pauseOnHover
        />
      </section>

      {/* ======================================================
          POST-HERO SECTIONS
          ====================================================== */}
      <HobbyCloud />
      <HobbyPath />
      <HobbyCardStack />
      <LandingJourney />
      <Footer />
    </div>
  );
}
