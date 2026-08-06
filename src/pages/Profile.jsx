import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import PageCanvas from '../components/layout/PageCanvas';
import InterestTag from '../components/common/InterestTag';
import Smiley from '../components/common/Smiley';
import Sunflower from '../components/common/Sunflower';
import Button from '../components/common/Button';
import JourneySteps from '../components/profile/JourneySteps';
import { getHobbyById } from '../data/hobbies';
import { getCommunityById } from '../data/communities';
import { posts } from '../data/posts';
import { staggerContainer, staggerItem } from '../animations/variants';
import './Profile.css';

export default function Profile() {
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

  // Simulated user data
  const profile = {
    name: 'You',
    bio: 'Still figuring it out, one hobby at a time.',
    wantToTry: ['pottery', 'astronomy', 'calligraphy'].map(id => getHobbyById(id)).filter(Boolean),
    joinedCommunities: ['street-photography', 'sketch-daily', 'student-chefs']
      .map(id => getCommunityById(id)).filter(Boolean),
  };

  const userPosts = posts.slice(0, 2);

  return (
    <PageCanvas>
      <motion.div
        className="profile"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div className="profile__header" variants={staggerItem}>
          <div className="profile__header-top">
            <div className="profile__avatar">
              <Smiley size={40} mood="happy" animate={false} color="var(--muted)" />
            </div>
            <motion.button
              className="profile__settings-btn"
              whileHover={{ rotate: 45 }}
              transition={{ duration: 0.3 }}
            >
              <Settings size={20} />
            </motion.button>
          </div>
          <h1 className="profile__name">{profile.name}</h1>
          <p className="profile__bio text-muted">{profile.bio}</p>
        </motion.div>

        {/* Journey steps / Stairs motif */}
        <motion.section className="profile__section" variants={staggerItem}>
          <JourneySteps currentStep="join" />
        </motion.section>

        {/* Interests */}
        <motion.section className="profile__section" variants={staggerItem}>
          <div className="profile__section-header">
            <h2 className="profile__section-title">My interests</h2>
            <Sunflower size={24} animate={false} />
          </div>
          {userInterests.length > 0 ? (
            <div className="profile__tags">
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
          ) : (
            <div className="profile__empty-section">
              <p className="text-muted">No interests yet.</p>
              <Button variant="secondary" size="sm" onClick={() => navigate('/onboarding')}>
                Discover hobbies
              </Button>
            </div>
          )}
        </motion.section>

        {/* Want to try */}
        <motion.section className="profile__section" variants={staggerItem}>
          <h2 className="profile__section-title">Want to try</h2>
          <div className="profile__tags">
            {profile.wantToTry.map(hobby => (
              <InterestTag
                key={hobby.id}
                label={hobby.name}
                emoji={hobby.emoji}
                color={hobby.color}
              />
            ))}
          </div>
        </motion.section>

        {/* Communities */}
        <motion.section className="profile__section" variants={staggerItem}>
          <h2 className="profile__section-title">Communities</h2>
          <div className="profile__communities">
            {profile.joinedCommunities.map((community, i) => (
              <motion.div
                key={community.id}
                className="profile__community-item"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                whileHover={{ x: 3 }}
                onClick={() => navigate(`/community/${community.id}`)}
              >
                <div className="profile__community-accent" style={{ backgroundColor: community.color }} />
                <div className="profile__community-info">
                  <span className="profile__community-name">{community.name}</span>
                  <span className="profile__community-members text-muted">
                    {community.memberCount} people
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Posts */}
        <motion.section className="profile__section" variants={staggerItem}>
          <h2 className="profile__section-title">My posts</h2>
          <div className="profile__posts">
            {userPosts.map(post => (
              <div key={post.id} className="profile__post-item">
                <span className="profile__post-type">{post.type}</span>
                <h3 className="profile__post-title">{post.title}</h3>
                <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                  {post.replyCount} replies
                </span>
              </div>
            ))}
          </div>
        </motion.section>
      </motion.div>
    </PageCanvas>
  );
}
