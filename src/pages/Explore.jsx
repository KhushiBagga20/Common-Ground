import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import PageCanvas from '../components/layout/PageCanvas';
import InterestTag from '../components/common/InterestTag';
import Smiley from '../components/common/Smiley';
import { hobbies, hobbyCategories } from '../data/hobbies';
import { communities, getTrendingCommunities } from '../data/communities';
import { staggerContainer, staggerItem } from '../animations/variants';
import './Explore.css';

export default function Explore() {
  const navigate = useNavigate();
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
  }, [searchQuery, activeCategory]);

  const trendingCommunities = getTrendingCommunities();

  return (
    <PageCanvas>
      <motion.div
        className="explore"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div className="explore__header" variants={staggerItem}>
          <div className="explore__header-row">
            <h1 className="explore__title">Explore</h1>
            <Smiley size={28} mood="happy" animate={false} />
          </div>
          <p className="text-muted">Browse hobbies, discover communities, find your thing.</p>
        </motion.div>

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
          <h2 className="explore__section-title">
            {activeCategory === 'All' ? 'All Hobbies' : activeCategory}
            <span className="text-muted" style={{ fontWeight: 400, fontSize: 'var(--text-sm)', marginLeft: 8 }}>
              {filteredHobbies.length}
            </span>
          </h2>
          <div className="explore__hobby-grid">
            {filteredHobbies.map((hobby, i) => (
              <motion.div
                key={hobby.id}
                className="explore__hobby-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.35 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => navigate(`/community/${communities.find(c => c.hobbyId === hobby.id)?.id || ''}`)}
              >
                <div className="explore__hobby-emoji">{hobby.emoji}</div>
                <div className="explore__hobby-info">
                  <h3 className="explore__hobby-name">{hobby.name}</h3>
                  <p className="explore__hobby-desc text-muted">{hobby.description}</p>
                </div>
                <div className="explore__hobby-accent" style={{ backgroundColor: hobby.color }} />
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
          <h2 className="explore__section-title">Trending communities</h2>
          <div className="explore__trending">
            {trendingCommunities.map((community, i) => (
              <motion.div
                key={community.id}
                className="explore__trending-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.35 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                onClick={() => navigate(`/community/${community.id}`)}
              >
                <div className="explore__trending-accent" style={{ backgroundColor: community.color }} />
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
          <h2 className="explore__section-title">Quick explore</h2>
          <div className="explore__tags-cloud">
            {hobbies.map(hobby => (
              <InterestTag
                key={hobby.id}
                label={hobby.name}
                emoji={hobby.emoji}
                color={hobby.color}
                onClick={() => navigate(`/community/${communities.find(c => c.hobbyId === hobby.id)?.id || ''}`)}
              />
            ))}
          </div>
        </motion.section>
      </motion.div>
    </PageCanvas>
  );
}
