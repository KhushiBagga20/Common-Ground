import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import PageCanvas from '../components/layout/PageCanvas';
import Button from '../components/common/Button';
import InterestTag from '../components/common/InterestTag';
import Sunflower from '../components/common/Sunflower';
import Smiley from '../components/common/Smiley';
import ChessPattern from '../components/common/ChessPattern';
import KineticCheckerboard from '../components/common/KineticCheckerboard';
import { hobbies, getHobbyById } from '../data/hobbies';
import { communities, getCommunitiesByHobby } from '../data/communities';
import { posts, getPostsByInterest } from '../data/posts';
import { staggerContainer, staggerItem } from '../animations/variants';
import './Ground.css';

export default function Ground() {
  const navigate = useNavigate();

  // Get user interests from localStorage
  const userInterests = useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('cg-interests') || '[]');
      return stored.map(id => getHobbyById(id)).filter(Boolean);
    } catch {
      return [];
    }
  }, []);

  const hasInterests = userInterests.length > 0;

  // Get relevant communities and posts
  const relevantCommunities = useMemo(() => {
    if (!hasInterests) return communities.slice(0, 4);
    const comms = [];
    userInterests.forEach(hobby => {
      comms.push(...getCommunitiesByHobby(hobby.id));
    });
    return comms.length > 0 ? comms.slice(0, 6) : communities.slice(0, 4);
  }, [userInterests, hasInterests]);

  const relevantPosts = useMemo(() => {
    if (!hasInterests) return posts.slice(0, 3);
    const p = [];
    userInterests.forEach(hobby => {
      p.push(...getPostsByInterest(hobby.id));
    });
    return p.length > 0 ? p.slice(0, 4) : posts.slice(0, 3);
  }, [userInterests, hasInterests]);

  // Suggestions: hobbies NOT in user's interests
  const suggestions = useMemo(() => {
    const ids = new Set(userInterests.map(h => h.id));
    return hobbies.filter(h => !ids.has(h.id)).slice(0, 6);
  }, [userInterests]);

  return (
    <PageCanvas>
      <KineticCheckerboard />
      <motion.div
        className="ground"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div className="ground__header" variants={staggerItem}>
          <div className="ground__header-row">
            <div>
              <h1 className="ground__title">Your Ground</h1>
              <p className="ground__subtitle text-muted">
                {hasInterests
                  ? `${userInterests.length} interest${userInterests.length !== 1 ? 's' : ''} · your corner of CommonGround`
                  : 'Discover something new today'
                }
              </p>
            </div>
            <Sunflower size={40} animate={false} />
          </div>
        </motion.div>

        {/* User interests */}
        {hasInterests && (
          <motion.section className="ground__section" variants={staggerItem}>
            <h2 className="ground__section-title">Your interests</h2>
            <div className="ground__interest-tags">
              {userInterests.map(hobby => (
                <InterestTag
                  key={hobby.id}
                  label={hobby.name}
                  emoji={hobby.emoji}
                  color={hobby.color}
                  selected
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* No interests empty state */}
        {!hasInterests && (
          <motion.section className="ground__empty" variants={staggerItem}>
            <div className="ground__empty-inner">
              <Smiley size={56} mood="wink" />
              <h2 className="ground__empty-title">Let's get started</h2>
              <p className="text-muted">Tell us what you're into and we'll build your ground.</p>
              <Button
                onClick={() => navigate('/onboarding')}
                iconRight={<ArrowRight size={18} />}
              >
                Discover Hobbies
              </Button>
            </div>
          </motion.section>
        )}

        {/* Communities for you */}
        {hasInterests && (
          <motion.section className="ground__section" variants={staggerItem}>
            <div className="ground__section-header">
              <h2 className="ground__section-title">
                Because you liked {userInterests[0]?.name}
              </h2>
              <span className="font-accent text-muted">communities for you</span>
            </div>
            <div className="ground__community-grid">
              {relevantCommunities.map((community, i) => (
                <motion.div
                  key={community.id}
                  className="ground__community-card"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  onClick={() => navigate(`/community/${community.id}`)}
                >
                  <div className="ground__community-accent" style={{ backgroundColor: community.color }} />
                  <h3 className="ground__community-name">{community.name}</h3>
                  <p className="ground__community-desc text-muted">{community.description}</p>
                  <div className="ground__community-meta text-muted">
                    <span>{community.memberCount} people</span>
                    <span>·</span>
                    <span>{community.postCount} posts</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Discussions */}
        <motion.section className="ground__section" variants={staggerItem}>
          <div className="ground__section-header">
            <h2 className="ground__section-title">
              {hasInterests ? 'Interesting discussions' : 'People are talking about'}
            </h2>
          </div>
          <div className="ground__posts">
            {relevantPosts.map((post, i) => (
              <motion.div
                key={post.id}
                className="ground__post-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.4 }}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
              >
                <div className="ground__post-type">{post.type}</div>
                <h3 className="ground__post-title">{post.title}</h3>
                <div className="ground__post-meta text-muted">
                  <span>{post.replyCount} replies</span>
                  <span>·</span>
                  <span>{post.interests.map(id => getHobbyById(id)?.name).filter(Boolean).join(', ')}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Discover something new */}
        <motion.section className="ground__section ground__discover" variants={staggerItem}>
          <div className="ground__discover-header">
            <ChessPattern rows={2} cols={3} cellSize={12} opacity={0.06} />
            <div>
              <h2 className="ground__section-title">
                <Sparkles size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                Discover something new
              </h2>
              <p className="text-muted" style={{ fontSize: 'var(--text-sm)', marginTop: 4 }}>
                You might also like
              </p>
            </div>
          </div>
          <div className="ground__discover-tags">
            {suggestions.map(hobby => (
              <InterestTag
                key={hobby.id}
                label={hobby.name}
                emoji={hobby.emoji}
                color={hobby.color}
                onClick={() => navigate(`/explore`)}
              />
            ))}
          </div>
        </motion.section>
      </motion.div>
    </PageCanvas>
  );
}
