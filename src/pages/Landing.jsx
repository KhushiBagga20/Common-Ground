import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, Sun, Moon } from 'lucide-react';
import Button from '../components/common/Button';
import Sunflower from '../components/common/Sunflower';
import Smiley from '../components/common/Smiley';
import SketchArrow from '../components/common/SketchArrow';
import ChessPattern from '../components/common/ChessPattern';
import InterestTag from '../components/common/InterestTag';
import { hobbies } from '../data/hobbies';
import { communities, getTrendingCommunities } from '../data/communities';
import { useTheme } from '../hooks/useTheme';
import { staggerContainer, staggerItem } from '../animations/variants';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const trendingCommunities = getTrendingCommunities().slice(0, 4);
  const featuredHobbies = hobbies.slice(0, 8);

  return (
    <div className="landing">
      {/* Theme toggle */}
      <motion.button
        className="landing__theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </motion.button>

      {/* Hero */}
      <section className="landing__hero">
        {/* Decorative motifs */}
        <div className="landing__motif landing__motif--chess-tl">
          <ChessPattern rows={3} cols={4} cellSize={14} opacity={0.07} />
        </div>
        <div className="landing__motif landing__motif--chess-br">
          <ChessPattern rows={4} cols={3} cellSize={12} opacity={0.05} />
        </div>
        <div className="landing__motif landing__motif--sunflower">
          <Sunflower size={56} />
        </div>
        <div className="landing__motif landing__motif--smiley">
          <Smiley size={28} mood="wink" />
        </div>

        <motion.div
          className="landing__hero-content"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div className="landing__hero-label" variants={staggerItem}>
            <span className="font-accent">a place for</span>
          </motion.div>

          <motion.h1 className="landing__hero-title" variants={staggerItem}>
            FIND YOUR<br />PEOPLE.
          </motion.h1>

          <motion.p className="landing__hero-subtitle" variants={staggerItem}>
            Discover hobbies, communities, and people who are into<br className="landing__br-desktop" />
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

          <motion.div className="landing__hero-arrow" variants={staggerItem}>
            <SketchArrow direction="down-right" size={50} color="var(--muted)" />
            <span className="font-accent landing__hero-arrow-text">start here!</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Hobbies preview */}
      <motion.section
        className="landing__hobbies"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="landing__section-header">
          <h2 className="landing__section-title">What are you into?</h2>
          <p className="landing__section-subtitle text-muted">
            There's a community for everything you love
          </p>
        </div>
        <div className="landing__hobby-tags">
          {featuredHobbies.map((hobby, i) => (
            <motion.div
              key={hobby.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <InterestTag
                label={hobby.name}
                emoji={hobby.emoji}
                color={hobby.color}
                size="lg"
                onClick={() => navigate('/onboarding')}
              />
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.3 }}
          >
            <InterestTag
              label="+ 12 more"
              size="lg"
              onClick={() => navigate('/onboarding')}
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Trending */}
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
            <Smiley size={24} mood="happy" animate={false} />
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

      {/* Bottom CTA */}
      <motion.section
        className="landing__cta"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="landing__cta-deco">
          <Sunflower size={40} />
        </div>
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
