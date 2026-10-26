import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import PageCanvas from '../components/layout/PageCanvas';
import PageHeader from '../components/common/PageHeader';
import KineticCheckerboard from '../components/common/KineticCheckerboard';
import StickerStack from '../components/common/StickerStack';
import Burst from '../components/common/Burst';
import InterestTag from '../components/common/InterestTag';
import Smiley from '../components/common/Smiley';
import { hobbyCategories } from '../data/hobbies';
import { useAppData } from '../context/AppDataContext';
import { staggerContainer, staggerItem } from '../animations/variants';
import { revealAt, isDarkColor } from '../lib/motion';
import './Explore.css';

export default function Explore() {
  const navigate = useNavigate();
  const { hobbies, communities, trendingCommunities, getHobby } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredHobbies = useMemo(() => {
    let result = hobbies;
    if (activeCategory !== 'All') {
      result = result.filter(h => h.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(h =>
        h.name.toLowerCase().includes(q) ||
        h.category.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [hobbies, searchQuery, activeCategory]);

  // Hobbies without a community land on Community's "might not exist yet" state
  const openHobby = (hobby) => {
    const community = communities.find(c => c.hobbyId === hobby.id);
    navigate(`/community/${community ? community.id : hobby.id}`);
  };

  return (
    <PageCanvas>
      <KineticCheckerboard tint="var(--yellow)" />
      <motion.div
        className="explore"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <PageHeader
          channel={1}
          name="Explore"
          title="Find your"
          highlight="thing."
          subtitle="Browse every hobby, peek into the communities around them, and follow whatever makes you curious."
          color="var(--yellow)"
          highlightColor="var(--pink)"
          pattern="dots"
          art={<StickerStack items={['📸', '🎸', '🧗', '🎨']} colors={['var(--paper)', 'var(--blue)', 'var(--green)', 'var(--pink)']} />}
        />

        {/* Search */}
        <motion.div className="explore__search" variants={staggerItem}>
          <Search size={18} className="explore__search-icon" />
          <input
            type="text"
            className="explore__search-input"
            placeholder="Search hobbies, communities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </motion.div>

        {/* Categories */}
        <motion.div className="explore__categories" variants={staggerItem}>
          <button
            className={`explore__category-btn ${activeCategory === 'All' ? 'explore__category-btn--active' : ''}`}
            onClick={() => setActiveCategory('All')}
          >
            All
          </button>
          {hobbyCategories.map(cat => (
            <button
              key={cat}
              className={`explore__category-btn ${activeCategory === cat ? 'explore__category-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Hobbies grid */}
        <motion.section className="explore__section" variants={staggerItem}>
          <h2 className="explore__section-title section-title">
            {activeCategory === 'All' ? 'All Hobbies' : activeCategory}
            <span className="explore__count mono-label">{String(filteredHobbies.length).padStart(2, '0')}</span>
          </h2>
          <div className="explore__hobby-grid">
            {filteredHobbies.map((hobby, i) => (
              <motion.div
                key={hobby.id}
                className={`explore__poster sticker sticker--hover ${isDarkColor(hobby.color) ? 'explore__poster--dark' : ''}`}
                style={{ '--poster-color': hobby.color, '--card-accent': 'var(--border)' }}
                {...revealAt(i, 4)}
                onClick={() => openHobby(hobby)}
              >
                <div className="explore__poster-top mono-label">
                  <span>No.{String(hobbies.indexOf(hobby) + 1).padStart(2, '0')}</span>
                  <span className="explore__poster-cat">{hobby.category}</span>
                </div>
                <div className="explore__poster-art">
                  <span className="explore__poster-emoji wiggle-on-hover">{hobby.emoji}</span>
                </div>
                <h3 className="explore__poster-title display">{hobby.name}</h3>
                <p className="explore__poster-label">{hobby.description}</p>
              </motion.div>
            ))}
          </div>

          {filteredHobbies.length === 0 && (
            <div className="explore__empty">
              <Smiley size={40} mood="neutral" />
              <p className="text-muted">No hobbies found. Try a different search?</p>
            </div>
          )}
        </motion.section>

        {/* Trending communities */}
        <motion.section className="explore__section" variants={staggerItem}>
          <h2 className="explore__section-title section-title">Trending communities 🔥</h2>
          <div className="explore__trending">
            {trendingCommunities.map((community, i) => (
              <motion.div
                key={community.id}
                className="explore__trending-card sticker sticker--hover"
                style={{ '--card-accent': community.color, '--comm-color': community.color }}
                {...revealAt(i, 4)}
                onClick={() => navigate(`/community/${community.id}`)}
              >
                <div className="explore__trending-band">
                  <span className="explore__trending-emoji">{getHobby(community.hobbyId)?.emoji ?? '✨'}</span>
                  {i === 0 && <Burst text="HOT" color="var(--yellow)" size={58} className="explore__trending-burst" />}
                </div>
                <h3 className="explore__trending-name">{community.name}</h3>
                <p className="explore__trending-desc text-muted">{community.description}</p>
                <div className="explore__trending-meta text-muted">
                  {community.memberCount} people · {community.postCount} posts
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Interest tags cloud */}
        <motion.section className="explore__section" variants={staggerItem}>
          <h2 className="explore__section-title section-title">Quick explore</h2>
          <div className="explore__tags-cloud">
            {hobbies.map(hobby => (
              <InterestTag
                key={hobby.id}
                label={hobby.name}
                emoji={hobby.emoji}
                color={hobby.color}
                onClick={() => openHobby(hobby)}
              />
            ))}
          </div>
        </motion.section>
      </motion.div>
    </PageCanvas>
  );
}
