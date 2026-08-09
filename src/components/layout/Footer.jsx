import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Heart } from 'lucide-react';
import SunflowerMascot from '../common/SunflowerMascot';
import './Footer.css';

const DOODLES = [
  { id: 'cam', emoji: '📸', label: 'curious eye', color: '#FF72B6', class: 'cg-footer__doodle--cam', parallaxX: -8, parallaxY: -6 },
  { id: 'guitar', emoji: '🎸', label: 'late night jams', color: '#FFD43B', class: 'cg-footer__doodle--guitar', parallaxX: 8, parallaxY: -8 },
  { id: 'paint', emoji: '🎨', label: 'doodle mode', color: '#5BCB77', class: 'cg-footer__doodle--paint', parallaxX: -10, parallaxY: 6 },
  { id: 'book', emoji: '📚', label: 'indie reads', color: '#4D7CFE', class: 'cg-footer__doodle--book', parallaxX: 10, parallaxY: 8 },
  { id: 'chess', emoji: '♟️', label: 'common ground', color: '#9B72FF', class: 'cg-footer__doodle--chess', parallaxX: -12, parallaxY: 0 },
  { id: 'star', emoji: '✨', label: 'your crowd', color: '#FF914D', class: 'cg-footer__doodle--star', parallaxX: 12, parallaxY: 0 },
];

export default function Footer() {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isSunflowerHovered, setIsSunflowerHovered] = useState(false);
  const [isCtaHovered, setIsCtaHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const normX = (e.clientX - centerX) / (rect.width / 2);
    const normY = (e.clientY - centerY) / (rect.height / 2);
    setMousePos({ x: normX, y: normY });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleCtaClick = () => {
    window.dispatchEvent(new Event('sunflower-react'));
    setTimeout(() => navigate('/explore'), 350);
  };

  return (
    <footer
      className="cg-footer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="cg-footer__inner">
        {/* Storybook Hero CTA Card */}
        <motion.div
          ref={cardRef}
          className="cg-footer__cta-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Flowing Dotted Path & Guided Bee */}
          <svg className="cg-footer__path-canvas" viewBox="0 0 860 480" fill="none">
            <path
              d="M 60,80 Q 220,30 430,90 T 780,120 Q 820,280 430,340"
              stroke="var(--border)"
              strokeWidth="2.5"
              strokeDasharray="6 8"
              strokeLinecap="round"
              opacity="0.35"
            />
          </svg>

          {/* Animated Guided Bee 🐝 */}
          <motion.div
            style={{
              position: 'absolute',
              top: '72px',
              left: '60px',
              pointerEvents: 'none',
              zIndex: 4,
            }}
            animate={{
              x: [0, 160, 360, 560, 360, 0],
              y: [0, -30, 20, 40, -10, 0],
              rotate: [0, 8, -6, 12, -4, 0],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <span style={{ fontSize: '1.8rem' }}>🐝</span>
          </motion.div>

          {/* Interactive Doodles surrounding CTA */}
          {DOODLES.map((doodle) => (
            <motion.div
              key={doodle.id}
              className={`cg-footer__doodle ${doodle.class}`}
              animate={{
                x: mousePos.x * doodle.parallaxX,
                y: mousePos.y * doodle.parallaxY,
                scale: isCtaHovered ? 1.15 : 1,
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              whileHover={{ y: -4, scale: 1.2 }}
            >
              <span className="cg-footer__doodle-icon">{doodle.emoji}</span>
              <span
                className="cg-footer__doodle-tooltip"
                style={{ background: doodle.color }}
              >
                {doodle.label}
              </span>
            </motion.div>
          ))}

          {/* Sunflower Mascot Header */}
          <motion.div
            className="cg-footer__sunflower-wrap"
            onMouseEnter={() => setIsSunflowerHovered(true)}
            onMouseLeave={() => setIsSunflowerHovered(false)}
            animate={{
              rotate: isSunflowerHovered ? [0, -10, 10, -6, 0] : isCtaHovered ? [0, 12, -12, 0] : 0,
              scale: isSunflowerHovered || isCtaHovered ? 1.12 : 1,
            }}
            transition={{ duration: 0.4 }}
          >
            <SunflowerMascot className="cg-footer__sunflower-mascot" />
          </motion.div>

          {/* Core Storybook Headline */}
          <h2 className="cg-footer__headline">
            Find your people.<br />Find your thing.
          </h2>

          <p className="cg-footer__subline">
            There's probably a little corner of the internet waiting for you. Come on in.
          </p>

          {/* Prominent Storybook CTA Button */}
          <motion.button
            type="button"
            className="cg-footer__btn"
            onClick={handleCtaClick}
            onMouseEnter={() => setIsCtaHovered(true)}
            onMouseLeave={() => setIsCtaHovered(false)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>FIND YOUR COMMON GROUND</span>
            <ArrowRight className="cg-footer__btn-arrow" size={22} />
          </motion.button>
        </motion.div>

        {/* Minimalist Bottom Navigation */}
        <div className="cg-footer__bottom-nav">
          <div className="cg-footer__nav-row">
            {/* Brand Mark */}
            <div className="cg-footer__brand">
              <span style={{ fontSize: '1.2rem' }}>⬛</span>
              <span>CommonGround</span>
            </div>

            {/* Product Nav Links */}
            <div className="cg-footer__links">
              <Link to="/explore" className="cg-footer__link">Explore</Link>
              <Link to="/explore" className="cg-footer__link">Communities</Link>
              <Link to="/onboarding" className="cg-footer__link">Hobbies</Link>
              <Link to="/ground" className="cg-footer__link">Ground</Link>
            </div>

            {/* External Links */}
            <div className="cg-footer__links">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="cg-footer__link">
                Instagram
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="cg-footer__link">
                GitHub
              </a>
              <Link to="/explore" className="cg-footer__link">Contact</Link>
            </div>
          </div>

          {/* Copyright Row */}
          <div className="cg-footer__copyright">
            <span>© 2026 CommonGround</span>
            <span>·</span>
            <span>Made with</span>
            <Heart size={14} fill="#FF72B6" color="#FF72B6" />
            <span>for curious people</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
