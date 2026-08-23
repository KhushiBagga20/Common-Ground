import { useState, useMemo, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Heart, Calendar, Clock, MapPin, Wifi, ChevronDown, X, Users, CheckCircle } from 'lucide-react';
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

/* ── Event detail copy ───────────────────────── */
const EVENT_DESCRIPTIONS = {
  'evt-1': 'Join us for a relaxed pottery workshop where you can learn basic hand-building and wheel-throwing techniques, meet other creative people, and go home with something you made yourself. All materials provided. No experience needed.',
  'evt-2': 'Start from absolute zero and play your first real song by the end of this session. Our instructor will walk you through chords, strumming patterns, and how to read tabs. Just bring yourself.',
  'evt-3': 'An energetic, beginner-friendly K-Pop dance class covering popular choreography. No dance experience required. Great for meeting people and having a genuinely fun evening.',
  'evt-4': 'A casual meetup for anyone who loves watercolor painting or wants to try it for the first time. Bring your paints if you have them, or borrow ours. Good music, good company, great vibes.',
  'evt-5': 'Start your Sunday with a guided yoga session by the lake. Suitable for all levels. Bring a mat, arrive five minutes early, and be ready to feel fantastic for the rest of the day.',
  'evt-6': 'A slow, exploratory walk through the city with film cameras in hand. We will stop at interesting spots, chat about technique, and share rolls afterward. Bring any film camera.',
  'evt-7': 'Learn to cook three simple, delicious meals you will actually want to make again. Online session with live Q&A. All you need is basic kitchen equipment and a willingness to get your hands dirty.',
  'evt-8': 'An evening exploring the overlap between AI-generated visuals and human creativity. Part discussion, part live demo, part collaborative experiment. Open to everyone curious.',
};

const EVENT_HOSTS = {
  'evt-1': 'Priya S. · CommonGround Member',
  'evt-2': 'Rohan K. · Music Enthusiast',
  'evt-3': 'Anika L. · Dance Community Lead',
  'evt-4': 'Meera T. · Watercolor Circle',
  'evt-5': 'Yoga with Dev · Sukhna Circle',
  'evt-6': 'Film Collective CHD',
  'evt-7': 'Cook with Nisha · Online Kitchen',
  'evt-8': 'Aarav M. · AI and Art Community',
};

/* ── EventDetailModal ─────────────────────────── */
function EventDetailModal({ event, isInterested, onToggleInterest, isJoined, onJoin, onClose }) {
  const interestedCount = isInterested ? event.interested + 1 : event.interested;
  const avatars = getAvatars(interestedCount);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);


  return createPortal(
    <motion.div
      className="ed-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
      aria-hidden="true"
    >
      <motion.div
        className="ed-modal"
        role="dialog"
        aria-modal="true"
        aria-label={event.title}
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="ed-close" onClick={onClose} aria-label="Close event details">
          <X size={18} strokeWidth={2} />
        </button>
        <div className="ed-image-wrap">
          <img src={event.image} alt={event.title} className="ed-image" />
        </div>
        <div className="ed-content">
          <span className="ed-category" style={{ color: CATEGORY_COLOR[event.category] ?? 'var(--muted)' }}>
            {event.category}
          </span>
          <h2 className="ed-title">{event.title}</h2>
          <div className="ed-meta">
            <span className="ed-meta-item"><Calendar size={14} />{event.date}</span>
            <span className="ed-meta-item"><Clock size={14} />{event.time}</span>
            {event.locationType === 'online' ? (
              <span className="event-card__online-badge"><Wifi size={11} />Online</span>
            ) : (
              <span className="ed-meta-item"><MapPin size={14} />{event.location}</span>
            )}
          </div>
          <p className="ed-tagline">&ldquo;{event.description}&rdquo;</p>
          <div className="ed-section">
            <h3 className="ed-section-title">About this event</h3>
            <p className="ed-about">{EVENT_DESCRIPTIONS[event.id] ?? event.description}</p>
          </div>
          <div className="ed-host-row">
            <span className="ed-host-label">Hosted by</span>
            <span className="ed-host-name">{EVENT_HOSTS[event.id] ?? 'CommonGround Community'}</span>
          </div>
          <div className="ed-footer">
            <div className="ed-interested">
              <div className="event-card__avatars">
                {avatars.map((g, i) => <span key={i} className="event-card__avatar">{g}</span>)}
              </div>
              <Users size={13} style={{ color: 'var(--muted)' }} />
              <span className="ed-interested-count">{interestedCount} interested</span>
              <motion.button
                className={`event-card__interested-btn${isInterested ? ' event-card__interested-btn--active' : ''}`}
                onClick={onToggleInterest}
                whileTap={{ scale: 0.94 }}
                whileHover={{ scale: 1.04 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                aria-label={isInterested ? 'Remove interest' : 'Mark as interested'}
                aria-pressed={isInterested}
              >
                <Heart size={13} fill={isInterested ? 'currentColor' : 'none'} strokeWidth={isInterested ? 0 : 2} />
                {isInterested ? 'Interested ✓' : 'Interested'}
              </motion.button>
            </div>
            <motion.button
              className={`ed-join-btn${isJoined ? ' ed-join-btn--joined' : ''}`}
              onClick={onJoin}
              disabled={isJoined}
              whileTap={isJoined ? {} : { scale: 0.96 }}
              whileHover={isJoined ? {} : { scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              aria-label={isJoined ? 'Already joined' : 'Join this event'}
            >
              {isJoined ? (<><CheckCircle size={16} strokeWidth={2} style={{ marginRight: 6 }} />Joined</>) : 'Join Event'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

/* ── EventCard ────────────────────────────────── */
function EventCard({ event, isInterested, onToggle, onOpen }) {
  const avatars = getAvatars(event.interested);
  const count = isInterested ? event.interested + 1 : event.interested;

  return (
    <motion.article
      className="event-card event-card--clickable"
      variants={staggerItem}
      layout
      onClick={onOpen}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${event.title}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpen(); }}
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

          {/* Interested button — stopPropagation prevents opening modal */}
          <motion.button
            className={`event-card__interested-btn${isInterested ? ' event-card__interested-btn--active' : ''}`}
            onClick={(e) => { e.stopPropagation(); onToggle(event.id); }}
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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery]       = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab]           = useState('all');
  const [interestedSet, setInterestedSet]   = useState(new Set());
  const [showAll, setShowAll]               = useState(false);
  const [selectedEvent, setSelectedEvent]   = useState(null);
  const [joinedSet, setJoinedSet]           = useState(new Set());

  /* Toggle interested state */
  const handleToggleInterest = useCallback((id) => {
    setInterestedSet(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  /* Join event (local state only) */
  const handleJoin = useCallback((id) => {
    setJoinedSet(prev => new Set([...prev, id]));
  }, []);

  /* Close modal */
  const handleClose = useCallback(() => setSelectedEvent(null), []);

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

    if (activeTab === 'interested') {
      list = list.filter(e => interestedSet.has(e.id));
    }

    return list;
  }, [activeCategory, searchQuery, activeTab, interestedSet]);

  const visibleEvents = showAll ? filteredEvents : filteredEvents.slice(0, INITIAL_VISIBLE);
  const hasMore = filteredEvents.length > INITIAL_VISIBLE && !showAll;

  return (
    <PageCanvas>
      <KineticCheckerboard />

      {/* ── Event Detail Modal ── */}
      <AnimatePresence>
        {selectedEvent && (
          <EventDetailModal
            key={selectedEvent.id}
            event={selectedEvent}
            isInterested={interestedSet.has(selectedEvent.id)}
            onToggleInterest={() => handleToggleInterest(selectedEvent.id)}
            isJoined={joinedSet.has(selectedEvent.id)}
            onJoin={() => handleJoin(selectedEvent.id)}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>

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
              onClick={() => navigate('/create')}
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
              { id: 'all',        label: 'All Events' },
              { id: 'popular',    label: 'Popular Events' },
              { id: 'interested', label: 'Interested' },
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
                <span className="events-empty__icon">{activeTab === 'interested' ? '♡' : '🔍'}</span>
                <p className="events-empty__text">
                  {activeTab === 'interested'
                    ? <>No interested events yet.<br />Tap the heart on any event to save it here.</>
                    : <>No events found.<br />Try a different category or search term.</>
                  }
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
                    onOpen={() => setSelectedEvent(event)}
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
