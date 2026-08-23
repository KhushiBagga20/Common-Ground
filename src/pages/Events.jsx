import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Heart, Calendar, Clock, MapPin, Wifi, ChevronDown } from 'lucide-react';
import PageCanvas from '../components/layout/PageCanvas';
import KineticCheckerboard from '../components/common/KineticCheckerboard';
import { staggerContainer, staggerItem } from '../animations/variants';
import { events as allEventsData, categories } from '../data/events';
import './Events.css';

/* ── Avatar placeholder glyphs ───────────────── */
const AVATAR_GLYPHS = ['🙂', '😄', '🤩', '😊', '🥳', '😎'];

function getAvatars(count) {
  const shown = Math.min(count, 3);
  return Array.from({ length: shown }, (_, i) => AVATAR_GLYPHS[i % AVATAR_GLYPHS.length]);
}

/* ── Category badge color map ─────────────────── */
const CATEGORY_COLOR = {
  Workshop: 'var(--yellow)',
  Meetup: 'var(--green)',
  Online: 'var(--blue)',
  Local: 'var(--pink)',
  Music: 'var(--purple)',
  Art: 'var(--orange)',
  Dance: 'var(--red)',
  Craft: 'var(--green)',
};

/* ── EventCard ────────────────────────────────── */
function EventCard({ event, isInterested, onToggle }) {
  const avatars = getAvatars(event.interested);
  const count = isInterested ? event.interested + 1 : event.interested;

  return (
    <motion.article
      className="event-card"
      variants={staggerItem}
      layout
    >
      {/* Image */}
      <div className="event-card__image-wrap">
        <img
          src={event.image}
          alt={event.title}
          className="event-card__image"
          loading="lazy"
        />
      </div>

      {/* Body */}
      <div className="event-card__body">
        {/* Category label */}
        <span
          className="event-card__category"
          style={{ color: CATEGORY_COLOR[event.category] ?? 'var(--muted)' }}
        >
          {event.category}
        </span>

        {/* Title */}
        <h3 className="event-card__title">{event.title}</h3>

        {/* Meta row */}
        <div className="event-card__meta">
          <span className="event-card__meta-item">
            <Calendar size={12} />
            {event.date}
          </span>
          <span className="event-card__meta-item">
            <Clock size={12} />
            {event.time}
          </span>
          {event.locationType === 'online' ? (
            <span className="event-card__online-badge">
              <Wifi size={10} />
              Online
            </span>
          ) : (
            <span className="event-card__meta-item">
              <MapPin size={12} />
              {event.location}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="event-card__description">{event.description}</p>

        {/* Footer */}
        <div className="event-card__footer">
          {/* Avatar + count */}
          <div className="event-card__interested-count">
            <div className="event-card__avatars">
              {avatars.map((g, i) => (
                <span key={i} className="event-card__avatar">{g}</span>
              ))}
            </div>
            <span>{count} interested</span>
          </div>

          {/* Interested button */}
          <motion.button
            className={`event-card__interested-btn${isInterested ? ' event-card__interested-btn--active' : ''}`}
            onClick={() => onToggle(event.id)}
            whileTap={{ scale: 0.94 }}
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            aria-label={isInterested ? 'Remove interest' : 'Mark as interested'}
            aria-pressed={isInterested}
          >
            <Heart
              size={13}
              fill={isInterested ? 'currentColor' : 'none'}
              strokeWidth={isInterested ? 0 : 2}
            />
            {isInterested ? 'Interested ✓' : 'Interested'}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

/* ── Events Page ──────────────────────────────── */
const INITIAL_VISIBLE = 5;

export default function Events() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [interestedSet, setInterestedSet] = useState(new Set());
  const [showAll, setShowAll] = useState(false);

  /* Toggle interested state */
  const handleToggleInterest = (id) => {
    setInterestedSet(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  /* Filter events */
  const filteredEvents = useMemo(() => {
    let list = [...allEventsData];

    if (activeCategory !== 'all') {
      list = list.filter(e => e.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        e =>
          e.title.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      );
    }

    if (activeTab === 'popular') {
      list = [...list].sort((a, b) => {
        const ai = interestedSet.has(a.id) ? a.interested + 1 : a.interested;
        const bi = interestedSet.has(b.id) ? b.interested + 1 : b.interested;
        return bi - ai;
      });
    }

    return list;
  }, [activeCategory, searchQuery, activeTab, interestedSet]);

  const visibleEvents = showAll ? filteredEvents : filteredEvents.slice(0, INITIAL_VISIBLE);
  const hasMore = filteredEvents.length > INITIAL_VISIBLE && !showAll;

  return (
    <PageCanvas>
      <KineticCheckerboard />

      <motion.div
        className="events-page"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        style={{ position: 'relative' }}
      >
        {/* Minimal background doodles (outside main container) */}
        <span className="events-bg-deco events-bg-deco--sparkle" aria-hidden="true">✦</span>
        <span className="events-bg-deco events-bg-deco--heart" aria-hidden="true">♡</span>
        <span className="events-bg-deco events-bg-deco--heart" aria-hidden="true">♡</span>

        <div className="events-container">

          {/* ── Header ── */}
          <motion.div className="events-header" variants={staggerItem}>
            <h1 className="events-title">Events ✨</h1>
            <p className="events-subtitle">
              Discover workshops, meetups and events happening around you.
            </p>
          </motion.div>

          {/* ── Search + Create ── */}
          <motion.div className="events-toolbar" variants={staggerItem}>
            <div className="events-search-wrap">
              <span className="events-search-icon" aria-hidden="true">
                <Search size={16} />
              </span>
              <input
                id="events-search"
                type="search"
                className="events-search-input"
                placeholder="Search for events, workshops, or interests..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setShowAll(false);
                }}
                aria-label="Search events"
              />
            </div>

            <motion.button
              className="events-create-btn"
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              aria-label="Create event"
            >
              <Plus size={15} strokeWidth={2.5} />
              Create Event
            </motion.button>
          </motion.div>

          {/* ── Category Pills ── */}
          <motion.div
            className="events-categories"
            variants={staggerItem}
            role="group"
            aria-label="Filter by category"
          >
            {categories.map(cat => (
              <motion.button
                key={cat.value}
                className={`events-category-pill${activeCategory === cat.value ? ' events-category-pill--active' : ''}`}
                data-accent={cat.accent ?? undefined}
                onClick={() => {
                  setActiveCategory(cat.value);
                  setShowAll(false);
                }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                aria-pressed={activeCategory === cat.value}
              >
                {cat.label}
              </motion.button>
            ))}
          </motion.div>

          {/* ── Tabs ── */}
          <motion.div
            className="events-tabs"
            variants={staggerItem}
            role="tablist"
            aria-label="Event view"
          >
            {[
              { id: 'all', label: 'All Events' },
              { id: 'popular', label: 'Popular Events' },
            ].map(tab => (
              <button
                key={tab.id}
                id={`events-tab-${tab.id}`}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`events-tab${activeTab === tab.id ? ' events-tab--active' : ''}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowAll(false);
                }}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* ── Event List ── */}
          <AnimatePresence mode="wait">
            {filteredEvents.length === 0 ? (
              <motion.div
                key="empty"
                className="events-empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <span className="events-empty__icon">🔍</span>
                <p className="events-empty__text">
                  No events found.
                  <br />
                  Try a different category or search term.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={`${activeCategory}-${activeTab}-${searchQuery}`}
                className="events-list"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {visibleEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isInterested={interestedSet.has(event.id)}
                    onToggle={handleToggleInterest}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Show More ── */}
          {hasMore && (
            <div className="events-show-more">
              <motion.button
                className="events-show-more-btn"
                onClick={() => setShowAll(true)}
                whileHover={{ y: 2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                aria-label={`Show ${filteredEvents.length - INITIAL_VISIBLE} more events`}
              >
                Show more events
                <ChevronDown size={16} />
              </motion.button>
            </div>
          )}

        </div>
      </motion.div>
    </PageCanvas>
  );
}
