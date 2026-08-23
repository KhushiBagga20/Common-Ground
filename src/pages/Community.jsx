import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, MessageCircle, ArrowLeft, Heart, Share2,
  Plus, Sparkles, Info,
} from 'lucide-react';
import PageCanvas from '../components/layout/PageCanvas';
import Button from '../components/common/Button';
import InterestTag from '../components/common/InterestTag';
import Smiley from '../components/common/Smiley';
import Sunflower from '../components/common/Sunflower';
import KineticCheckerboard from '../components/common/KineticCheckerboard';
import { getCommunityById } from '../data/communities';
import { getPostsByCommunity } from '../data/posts';
import { getHobbyById } from '../data/hobbies';
import { users } from '../data/users';
import { staggerContainer, staggerItem } from '../animations/variants';
import './Community.css';

/* ── Helpers ─────────────────────────────────────────────────── */

// Returns a pastel class index (0–6) based on a tag string
const PASTEL_KEYS = ['pink', 'yellow', 'green', 'blue', 'purple', 'peach', 'mint'];
function pastelForTag(tag, index) {
  return PASTEL_KEYS[index % PASTEL_KEYS.length];
}

// Post-type badge colors
const POST_TYPE_PASTEL = {
  discussion: 'blue',
  question:   'yellow',
  project:    'green',
  idea:       'purple',
  default:    'peach',
};

function postTypePastel(type) {
  return POST_TYPE_PASTEL[type] || POST_TYPE_PASTEL.default;
}

// Format relative time (very simple)
function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return `${Math.floor(d / 7)}w ago`;
}

// Avatar background colors cycling
const AVATAR_COLORS = ['#FFD43B', '#FF8FAB', '#B8F0D0', '#D9BBFF', '#FFCCAA', '#A8D8FF'];
function avatarColor(index) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

/* ── Decorative doodle SVGs (inline, pointer-events:none) ─────── */
function DoodleStar({ size = 18, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      aria-hidden="true" style={{ pointerEvents: 'none', ...style }}>
      <path d="M12 2 L13.5 9.5 L21 12 L13.5 14.5 L12 22 L10.5 14.5 L3 12 L10.5 9.5 Z"
        fill="#FFD43B" stroke="#111" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

function DoodleHeart({ size = 16, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      aria-hidden="true" style={{ pointerEvents: 'none', ...style }}>
      <path d="M12 21 C12 21 3 14 3 8.5 C3 5.42 5.42 3 8.5 3 C10.24 3 11.91 3.81 13 5.08 C14.09 3.81 15.76 3 17.5 3 C20.58 3 23 5.42 23 8.5 C23 14 14 21 12 21Z"
        fill="#FF8FAB" stroke="#111" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

function DoodleSparkle({ size = 20, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      aria-hidden="true" style={{ pointerEvents: 'none', ...style }}>
      <path d="M12 3 L12.8 10 L19 12 L12.8 14 L12 21 L11.2 14 L5 12 L11.2 10 Z"
        fill="#B8F0D0" stroke="#111" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="5" cy="5" r="1.5" fill="#FFD43B" />
      <circle cx="19" cy="19" r="1.5" fill="#FF8FAB" />
    </svg>
  );
}

function DoodleSquiggle({ style = {} }) {
  return (
    <svg width="56" height="28" viewBox="0 0 56 28" fill="none"
      aria-hidden="true" style={{ pointerEvents: 'none', ...style }}>
      <path d="M2 14 C8 4 16 24 24 14 C32 4 40 24 48 14 C51 9 53 12 54 14"
        stroke="#D9BBFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function DoodleArrow({ style = {} }) {
  return (
    <svg width="44" height="32" viewBox="0 0 44 32" fill="none"
      aria-hidden="true" style={{ pointerEvents: 'none', ...style }}>
      <path d="M4 24 C12 8 28 6 38 14"
        stroke="#FFCCAA" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M34 10 L40 16 L32 17"
        stroke="#FFCCAA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function DoodleLeaf({ style = {} }) {
  return (
    <svg width="22" height="28" viewBox="0 0 22 28" fill="none"
      aria-hidden="true" style={{ pointerEvents: 'none', ...style }}>
      <path d="M11 26 C11 26 2 18 2 10 C2 5.58 6.13 2 11 2 C15.87 2 20 5.58 20 10 C20 18 11 26 11 26Z"
        fill="#B8F0D0" stroke="#111" strokeWidth="1.2" />
      <line x1="11" y1="26" x2="11" y2="8" stroke="#111" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/* ── Main Component ───────────────────────────────────────────── */
export default function Community() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [joined, setJoined] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});

  const community    = getCommunityById(id);
  const communityPosts = useMemo(() => community ? getPostsByCommunity(id) : [], [id, community]);
  const hobby        = community ? getHobbyById(community.hobbyId) : null;

  const relatedHobbies = useMemo(() => {
    if (!community?.relatedHobbies) return [];
    return community.relatedHobbies.map(hid => getHobbyById(hid)).filter(Boolean);
  }, [community]);

  const members = useMemo(() => {
    if (!community) return [];
    return users.filter(u => u.communities.includes(id)).slice(0, 5);
  }, [id, community]);

  function toggleLike(postId) {
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  }

  /* ── Not found ─────────────────────────────────────────────── */
  if (!community) {
    return (
      <PageCanvas>
        <KineticCheckerboard />
        <div className="comm__not-found">
          <Smiley size={48} mood="neutral" />
          <h2>Community not found</h2>
          <p className="text-muted">This community might not exist yet.</p>
          <Button onClick={() => navigate('/ground')}>Explore communities</Button>
        </div>
      </PageCanvas>
    );
  }

  const accentColor = community.color || '#4D7CFE';

  return (
    <PageCanvas maxWidth="1200px">
      {/* Kinetic checkerboard background */}
      <KineticCheckerboard />

      {/* Page decorations — behind all cards */}
      <div className="comm__deco-layer" aria-hidden="true">
        <div className="comm__deco comm__deco--sf-topleft">
          <Sunflower size={72} animate={false} />
        </div>
        <div className="comm__deco comm__deco--sf-bottomright">
          <Sunflower size={52} animate={false} />
        </div>
        <div className="comm__deco comm__deco--star1">
          <DoodleStar size={22} />
        </div>
        <div className="comm__deco comm__deco--star2">
          <DoodleStar size={14} />
        </div>
        <div className="comm__deco comm__deco--heart1">
          <DoodleHeart size={18} />
        </div>
        <div className="comm__deco comm__deco--heart2">
          <DoodleHeart size={13} />
        </div>
        <div className="comm__deco comm__deco--sparkle1">
          <DoodleSparkle size={24} />
        </div>
        <div className="comm__deco comm__deco--sparkle2">
          <DoodleSparkle size={16} />
        </div>
        <div className="comm__deco comm__deco--squiggle">
          <DoodleSquiggle />
        </div>
        <div className="comm__deco comm__deco--arrow">
          <DoodleArrow />
        </div>
        <div className="comm__deco comm__deco--leaf">
          <DoodleLeaf />
        </div>
      </div>

      {/* Page content */}
      <motion.div
        className="comm"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Back button */}
        <motion.button
          className="comm__back"
          onClick={() => navigate(-1)}
          variants={staggerItem}
          whileHover={{ x: -4 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </motion.button>

        {/* ── Hero card ─────────────────────────────────────────── */}
        <motion.div
          className="comm__hero"
          variants={staggerItem}
          style={{ '--comm-accent': accentColor }}
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Accent bar — clipped by overflow:hidden on .comm__hero */}
          <div className="comm__hero-accent" />

          <div className="comm__hero-body">
            <div className="comm__hero-left">
              {hobby && (
                <span className="comm__hero-category">
                  {hobby.emoji}&nbsp;{hobby.name}
                  {hobby.category && (
                    <span className="comm__hero-cat-badge">{hobby.category}</span>
                  )}
                </span>
              )}

              <h1 className="comm__hero-name">{community.name}</h1>

              <p className="comm__hero-desc">{community.description}</p>

              <div className="comm__hero-stats">
                <div className="comm__hero-stat">
                  <Users size={14} strokeWidth={2.2} />
                  <span><strong>{community.memberCount}</strong> people</span>
                </div>
                <div className="comm__hero-stat">
                  <MessageCircle size={14} strokeWidth={2.2} />
                  <span><strong>{community.postCount}</strong> posts</span>
                </div>
              </div>
            </div>

            <div className="comm__hero-right">
              {/* Community identity icon */}
              <div className="comm__hero-icon" style={{ background: `${accentColor}22`, borderColor: accentColor }}>
                <span className="comm__hero-icon-emoji">
                  {hobby?.emoji || '🌿'}
                </span>
              </div>

              <motion.button
                className={`comm__join-btn ${joined ? 'comm__join-btn--joined' : ''}`}
                onClick={() => setJoined(!joined)}
                whileHover={{ y: -2, boxShadow: joined ? '2px 2px 0 #191919' : '4px 4px 0 #191919' }}
                whileTap={{ scale: 0.96, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {joined ? (
                  <>✓ Joined</>
                ) : (
                  <><Plus size={15} strokeWidth={2.5} /> Join Community</>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ── Tags ──────────────────────────────────────────────── */}
        {community.tags.length > 0 && (
          <motion.div className="comm__tags" variants={staggerItem}>
            {community.tags.map((tag, i) => (
              <motion.span
                key={tag}
                className={`comm__tag comm__tag--${pastelForTag(tag, i)}`}
                whileHover={{ y: -2, scale: 1.04 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        )}

        {/* ── Two-column grid ───────────────────────────────────── */}
        <div className="comm__grid">

          {/* ── LEFT: Feed ─────────────────────────────────────── */}
          <motion.div className="comm__main" variants={staggerItem}>
            {/* Section header */}
            <div className="comm__feed-header">
              <h2 className="comm__feed-title">
                <Sparkles size={18} strokeWidth={2} />
                What's happening here
              </h2>
            </div>

            {/* Create post CTA */}
            <motion.div
              className="comm__create-cta"
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            >
              <div className="comm__create-cta-text">
                <span className="comm__create-cta-label">Have something to share?</span>
                <span className="comm__create-cta-sub text-muted">Start a discussion, ask a question, or share a project.</span>
              </div>
              <motion.button
                className="comm__create-btn"
                onClick={() => navigate('/create')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Plus size={15} strokeWidth={2.5} />
                Create a Post
              </motion.button>
            </motion.div>

            {/* Posts */}
            <div className="comm__posts">
              {communityPosts.map((post, i) => {
                const author = users.find(u => u.id === post.authorId);
                const isLiked = !!likedPosts[post.id];
                const pastel  = postTypePastel(post.type);

                return (
                  <motion.article
                    key={post.id}
                    className="comm__post"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.06, duration: 0.38 }}
                    whileHover={{ y: -3, boxShadow: '3px 3px 0 #D6D5D0' }}
                  >
                    {/* Post header */}
                    <div className="comm__post-head">
                      <div
                        className="comm__post-avatar"
                        style={{ background: avatarColor(i) }}
                        onClick={() => navigate('/profile')}
                        role="button"
                        tabIndex={0}
                      >
                        {author?.name?.charAt(0) || '?'}
                      </div>
                      <div className="comm__post-author-info">
                        <span className="comm__post-author-name" onClick={() => navigate('/profile')} role="button" tabIndex={0}>
                          {author?.name || 'Anonymous'}
                        </span>
                        <span className="comm__post-timestamp text-muted">
                          {timeAgo(post.createdAt)}
                        </span>
                      </div>
                      <span className={`comm__post-type-badge comm__post-type-badge--${pastel}`}>
                        {post.type}
                      </span>
                    </div>

                    {/* Post content */}
                    <h3 className="comm__post-title">{post.title}</h3>
                    {post.body && (
                      <p className="comm__post-body text-muted">{post.body}</p>
                    )}

                    {/* Post tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="comm__post-tags">
                        {post.tags.slice(0, 3).map((t, ti) => (
                          <span key={t} className={`comm__tag comm__tag--sm comm__tag--${pastelForTag(t, ti + 2)}`}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Post actions */}
                    <div className="comm__post-actions">
                      <motion.button
                        className={`comm__post-action ${isLiked ? 'comm__post-action--liked' : ''}`}
                        onClick={() => toggleLike(post.id)}
                        whileTap={{ scale: 0.85 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        aria-label="Like post"
                      >
                        <Heart size={14} strokeWidth={2} fill={isLiked ? '#FF8FAB' : 'none'} />
                        <span>{isLiked ? 'Liked' : 'Like'}</span>
                      </motion.button>

                      <div className="comm__post-action comm__post-action--replies">
                        <MessageCircle size={14} strokeWidth={2} />
                        <span>{post.replyCount} {post.replyCount === 1 ? 'reply' : 'replies'}</span>
                      </div>

                      <motion.button
                        className="comm__post-action"
                        whileTap={{ scale: 0.9 }}
                        aria-label="Share post"
                      >
                        <Share2 size={14} strokeWidth={2} />
                        <span>Share</span>
                      </motion.button>
                    </div>
                  </motion.article>
                );
              })}

              {/* Empty state */}
              {communityPosts.length === 0 && (
                <div className="comm__posts-empty">
                  <Smiley size={40} mood="wink" />
                  <p className="text-muted">Be the first to start a discussion!</p>
                  <Button variant="secondary" size="sm" onClick={() => navigate('/create')}>
                    Create Post
                  </Button>
                </div>
              )}
            </div>
          </motion.div>

          {/* ── RIGHT: Sidebar ─────────────────────────────────── */}
          <motion.aside className="comm__sidebar" variants={staggerItem}>

            {/* Card 1 — People Here */}
            {members.length > 0 && (
              <div className="comm__sidebar-card comm__sidebar-card--mint">
                <div className="comm__sidebar-card-accent" style={{ background: '#B8F0D0' }} />
                <div className="comm__sidebar-card-inner">
                  <h3 className="comm__sidebar-title">People Here 🌻</h3>
                  <div className="comm__members">
                    {members.map((member, i) => (
                      <motion.div
                        key={member.id}
                        className="comm__member"
                        onClick={() => navigate('/profile')}
                        whileHover={{ x: 3 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      >
                        <div
                          className="comm__member-avatar"
                          style={{ background: avatarColor(i), borderColor: avatarColor(i) }}
                        >
                          {member.name.charAt(0)}
                        </div>
                        <div className="comm__member-info">
                          <span className="comm__member-name">{member.name}</span>
                          <span className="comm__member-bio text-muted">{member.bio}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Card 2 — You might also like */}
            {relatedHobbies.length > 0 && (
              <div className="comm__sidebar-card comm__sidebar-card--lavender">
                <div className="comm__sidebar-card-accent" style={{ background: '#D9BBFF' }} />
                <div className="comm__sidebar-card-inner">
                  <h3 className="comm__sidebar-title">You might also like ✨</h3>
                  <div className="comm__related-chips">
                    {relatedHobbies.map(h => (
                      <InterestTag
                        key={h.id}
                        label={h.name}
                        emoji={h.emoji}
                        color={h.color}
                        onClick={() => navigate('/ground')}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Card 3 — About this community */}
            <div className="comm__sidebar-card comm__sidebar-card--peach">
              <div className="comm__sidebar-card-accent" style={{ background: accentColor }} />
              <div className="comm__sidebar-card-inner">
                <h3 className="comm__sidebar-title">
                  <Info size={14} strokeWidth={2} style={{ marginRight: 4 }} />
                  About this community
                </h3>
                <div className="comm__about-list">
                  <div className="comm__about-row">
                    <Users size={13} strokeWidth={2} />
                    <span><strong>{community.memberCount}</strong> members</span>
                  </div>
                  <div className="comm__about-row">
                    <MessageCircle size={13} strokeWidth={2} />
                    <span><strong>{community.postCount}</strong> posts</span>
                  </div>
                  {hobby && (
                    <div className="comm__about-row">
                      <span>{hobby.emoji}</span>
                      <span>{hobby.name} · {hobby.category}</span>
                    </div>
                  )}
                </div>
                {/* Community tags compact */}
                {community.tags.length > 0 && (
                  <div className="comm__about-tags">
                    {community.tags.map((tag, i) => (
                      <span key={tag} className={`comm__tag comm__tag--sm comm__tag--${pastelForTag(tag, i)}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </motion.aside>
        </div>
      </motion.div>
    </PageCanvas>
  );
}
