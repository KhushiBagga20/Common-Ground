import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, Sun, Moon } from 'lucide-react';
import Button from '../components/common/Button';
import InterestTag from '../components/common/InterestTag';
import { hobbies } from '../data/hobbies';
import { getTrendingCommunities } from '../data/communities';
import { useTheme } from '../hooks/useTheme';
import { staggerContainer, staggerItem } from '../animations/variants';
import './Landing.css';

/* ---- Inline SVG: Cartoon Daisy-Smiley character (inspired by reference) ---- */
function CartoonFlowerChar() {
  return (
    <svg
      className="landing__hero-char"
      viewBox="0 0 320 460"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* ---- STEM ---- */}
      <line x1="160" y1="280" x2="140" y2="430" stroke="#1A1A1A" strokeWidth="10" strokeLinecap="round"/>
      <line x1="160" y1="300" x2="180" y2="430" stroke="#1A1A1A" strokeWidth="10" strokeLinecap="round"/>

      {/* ---- SNEAKERS ---- */}
      {/* Left shoe */}
      <ellipse cx="125" cy="438" rx="30" ry="14" fill="#3AAFA9" stroke="#1A1A1A" strokeWidth="3"/>
      <rect x="100" y="428" width="50" height="18" rx="6" fill="#3AAFA9" stroke="#1A1A1A" strokeWidth="3"/>
      {/* shoe sole stripes */}
      <line x1="106" y1="442" x2="145" y2="442" stroke="#F5F5F5" strokeWidth="2" strokeLinecap="round"/>
      <line x1="108" y1="446" x2="143" y2="446" stroke="#F5F5F5" strokeWidth="2" strokeLinecap="round"/>
      {/* Right shoe */}
      <ellipse cx="192" cy="438" rx="30" ry="14" fill="#3AAFA9" stroke="#1A1A1A" strokeWidth="3"/>
      <rect x="167" y="428" width="50" height="18" rx="6" fill="#3AAFA9" stroke="#1A1A1A" strokeWidth="3"/>
      <line x1="173" y1="442" x2="212" y2="442" stroke="#F5F5F5" strokeWidth="2" strokeLinecap="round"/>
      <line x1="175" y1="446" x2="210" y2="446" stroke="#F5F5F5" strokeWidth="2" strokeLinecap="round"/>

      {/* ---- PETALS ---- */}
      {/* 8 petals around center */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const cx = 160 + 78 * Math.sin(rad);
        const cy = 150 - 78 * Math.cos(rad);
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx={28}
            ry={42}
            fill="#F8F4EC"
            stroke="#1A1A1A"
            strokeWidth="3.5"
            transform={`rotate(${deg}, ${cx}, ${cy})`}
          />
        );
      })}

      {/* ---- FACE CENTER ---- */}
      <circle cx="160" cy="150" r="58" fill="#F5C842" stroke="#1A1A1A" strokeWidth="4"/>

      {/* Eyes */}
      <ellipse cx="142" cy="140" rx="9" ry="12" fill="#1A1A1A"/>
      <ellipse cx="178" cy="140" rx="9" ry="12" fill="#1A1A1A"/>
      {/* Eye shine */}
      <circle cx="146" cy="135" r="3" fill="white"/>
      <circle cx="182" cy="135" r="3" fill="white"/>

      {/* Smile */}
      <path
        d="M 140 165 Q 160 185 180 165"
        stroke="#1A1A1A"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Cheek blush */}
      <ellipse cx="130" cy="163" rx="11" ry="7" fill="#F47B7B" opacity="0.4"/>
      <ellipse cx="190" cy="163" rx="11" ry="7" fill="#F47B7B" opacity="0.4"/>
    </svg>
  );
}

/* ---- Inline SVG: Yellow 3D Stairs (from reference image) ---- */
function StairsIllustration() {
  return (
    <svg
      className="landing__hero-stairs"
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Step 3 (back/bottom) */}
      <rect x="0" y="180" width="320" height="60" rx="4" fill="#FFD43B" stroke="#1A1A1A" strokeWidth="3"/>
      <rect x="0" y="178" width="320" height="18" rx="4" fill="#E8BF2A" stroke="#1A1A1A" strokeWidth="3"/>
      {/* Step 3 side stripes */}
      {[20, 60, 100, 140, 180, 220, 260, 300].map(x => (
        <line key={x} x1={x} y1="196" x2={x - 6} y2="240" stroke="#C9A420" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      ))}

      {/* Step 2 (middle) */}
      <rect x="60" y="120" width="260" height="60" rx="4" fill="#FFD43B" stroke="#1A1A1A" strokeWidth="3"/>
      <rect x="60" y="118" width="260" height="18" rx="4" fill="#E8BF2A" stroke="#1A1A1A" strokeWidth="3"/>
      {[80, 120, 160, 200, 240, 280, 315].map(x => (
        <line key={x} x1={x} y1="136" x2={x - 6} y2="180" stroke="#C9A420" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      ))}

      {/* Step 1 (front/top) */}
      <rect x="130" y="60" width="190" height="60" rx="4" fill="#FFD43B" stroke="#1A1A1A" strokeWidth="3"/>
      <rect x="130" y="58" width="190" height="18" rx="4" fill="#E8BF2A" stroke="#1A1A1A" strokeWidth="3"/>
      {[150, 190, 230, 270, 305].map(x => (
        <line key={x} x1={x} y1="76" x2={x - 6} y2="120" stroke="#C9A420" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      ))}
    </svg>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const trendingCommunities = getTrendingCommunities().slice(0, 4);
  const featuredHobbies = hobbies.slice(0, 10);

  /* Duplicate tags for seamless marquee loop */
  const marqueeHobbies = [...featuredHobbies, ...featuredHobbies];

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

      {/* ======== HERO ======== */}
      <section className="landing__hero">

        {/* Animated diagonal checker */}
        <div className="landing__checker-bg" aria-hidden="true" />

        {/* Gradient fade over checker */}
        <div className="landing__hero-overlay" aria-hidden="true" />

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

        {/* Left — Copy */}
        <motion.div
          className="landing__hero-left"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div className="landing__hero-label" variants={staggerItem}>
            <span className="font-accent">a place for curious people</span>
          </motion.div>

          <motion.h1 className="landing__hero-title" variants={staggerItem}>
            FIND YOUR<br />
            <em>PEOPLE.</em>
          </motion.h1>

          <motion.p className="landing__hero-subtitle" variants={staggerItem}>
            Discover hobbies, find your community, and connect with people who are into
            the same strange little things you are.
          </motion.p>

          <motion.div className="landing__hero-actions" variants={staggerItem}>
            <Button
              size="lg"
              onClick={() => navigate('/onboarding')}
              iconRight={<ArrowRight size={20} />}
            >
              Discover Hobbies
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/explore')}
              icon={<Compass size={18} />}
            >
              Explore first
            </Button>
          </motion.div>

          <motion.div className="landing__hero-tagline" variants={staggerItem}>
            <span className="landing__hero-tagline-text font-accent">↓ start here!</span>
          </motion.div>
        </motion.div>

        {/* Right — Illustration */}
        <motion.div
          className="landing__hero-right"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <StairsIllustration />
          <CartoonFlowerChar />
        </motion.div>

      </section>

      {/* ======== HOBBIES MARQUEE ======== */}
      <motion.section
        className="landing__hobbies"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="landing__hobbies-label">What are you into?</p>
        <div className="landing__hobby-strip" aria-label="hobby examples">
          <div className="landing__hobby-tags-wrap">
            {marqueeHobbies.map((hobby, i) => (
              <InterestTag
                key={`${hobby.id}-${i}`}
                label={hobby.name}
                emoji={hobby.emoji}
                color={hobby.color}
                size="lg"
                onClick={() => navigate('/onboarding')}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* ======== TRENDING ======== */}
      <motion.section
        className="landing__trending"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="landing__section-header">
          <div className="landing__section-header-row">
            <h2 className="landing__section-title">Trending communities</h2>
          </div>
          <p className="landing__section-subtitle text-muted">
            People are talking right now
          </p>
        </div>
        <div className="landing__trending-grid">
          {trendingCommunities.map((community, i) => (
            <motion.div
              key={community.id}
              className="landing__trending-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              onClick={() => navigate(`/community/${community.id}`)}
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
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ======== CTA ======== */}
      <motion.section
        className="landing__cta"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
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
            onClick={() => navigate('/onboarding')}
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
