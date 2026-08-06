import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, MessageCircle, ArrowLeft } from 'lucide-react';
import PageCanvas from '../components/layout/PageCanvas';
import Button from '../components/common/Button';
import InterestTag from '../components/common/InterestTag';
import Smiley from '../components/common/Smiley';
import { getCommunityById } from '../data/communities';
import { getPostsByCommunity } from '../data/posts';
import { getHobbyById, hobbies } from '../data/hobbies';
import { users } from '../data/users';
import { staggerContainer, staggerItem } from '../animations/variants';
import './Community.css';

export default function Community() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [joined, setJoined] = useState(false);

  const community = getCommunityById(id);
  const communityPosts = useMemo(() => community ? getPostsByCommunity(id) : [], [id, community]);
  const hobby = community ? getHobbyById(community.hobbyId) : null;

  // Get related hobbies
  const relatedHobbies = useMemo(() => {
    if (!community?.relatedHobbies) return [];
    return community.relatedHobbies.map(id => getHobbyById(id)).filter(Boolean);
  }, [community]);

  // Get some members
  const members = useMemo(() => {
    if (!community) return [];
    return users.filter(u => u.communities.includes(id)).slice(0, 5);
  }, [id, community]);

  if (!community) {
    return (
      <PageCanvas>
        <div className="community__not-found">
          <Smiley size={48} mood="neutral" />
          <h2>Community not found</h2>
          <p className="text-muted">This community might not exist yet.</p>
          <Button onClick={() => navigate('/explore')}>Explore communities</Button>
        </div>
      </PageCanvas>
    );
  }

  return (
    <PageCanvas>
      <motion.div
        className="community"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Back */}
        <motion.button
          className="community__back"
          onClick={() => navigate(-1)}
          variants={staggerItem}
          whileHover={{ x: -3 }}
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </motion.button>

        {/* Header */}
        <motion.div className="community__header" variants={staggerItem}>
          <div className="community__accent-bar" style={{ backgroundColor: community.color }} />
          <div className="community__header-content">
            <div className="community__header-info">
              {hobby && (
                <span className="community__category text-muted">{hobby.emoji} {hobby.name}</span>
              )}
              <h1 className="community__name">{community.name}</h1>
              <p className="community__description">{community.description}</p>
              <div className="community__stats">
                <div className="community__stat">
                  <Users size={15} />
                  <span>{community.memberCount} people</span>
                </div>
                <div className="community__stat">
                  <MessageCircle size={15} />
                  <span>{community.postCount} posts</span>
                </div>
              </div>
            </div>
            <div className="community__header-actions">
              <Button
                variant={joined ? 'secondary' : 'primary'}
                onClick={() => setJoined(!joined)}
                accent={!joined ? community.color : undefined}
              >
                {joined ? 'Joined ✓' : 'Join'}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Tags */}
        <motion.div className="community__tags" variants={staggerItem}>
          {community.tags.map(tag => (
            <InterestTag key={tag} label={tag} size="sm" />
          ))}
        </motion.div>

        {/* Content grid */}
        <div className="community__grid">
          {/* Posts column */}
          <motion.div className="community__main" variants={staggerItem}>
            <h2 className="community__section-title">
              {communityPosts.length > 0 ? 'Discussions' : 'No posts yet'}
            </h2>
            <div className="community__posts">
              {communityPosts.map((post, i) => {
                const author = users.find(u => u.id === post.authorId);
                return (
                  <motion.div
                    key={post.id}
                    className="community__post"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.35 }}
                    whileHover={{ x: 3, transition: { duration: 0.15 } }}
                  >
                    <div className="community__post-type">{post.type}</div>
                    <h3 className="community__post-title">{post.title}</h3>
                    <p className="community__post-body text-muted">{post.body}</p>
                    <div className="community__post-meta text-muted">
                      <span>{author?.name || 'Anonymous'}</span>
                      <span>·</span>
                      <span>{post.replyCount} replies</span>
                    </div>
                  </motion.div>
                );
              })}

              {communityPosts.length === 0 && (
                <div className="community__empty-posts">
                  <Smiley size={36} mood="wink" />
                  <p className="text-muted">Be the first to start a discussion!</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/create')}
                  >
                    Create Post
                  </Button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.aside className="community__sidebar" variants={staggerItem}>
            {/* Members */}
            {members.length > 0 && (
              <div className="community__sidebar-section">
                <h3 className="community__sidebar-title">People here</h3>
                <div className="community__members">
                  {members.map(member => (
                    <div key={member.id} className="community__member" onClick={() => navigate('/profile')}>
                      <div className="community__member-avatar">
                        {member.name.charAt(0)}
                      </div>
                      <div className="community__member-info">
                        <span className="community__member-name">{member.name}</span>
                        <span className="community__member-bio text-muted">{member.bio}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related hobbies */}
            {relatedHobbies.length > 0 && (
              <div className="community__sidebar-section">
                <h3 className="community__sidebar-title">Related interests</h3>
                <div className="community__related-tags">
                  {relatedHobbies.map(h => (
                    <InterestTag
                      key={h.id}
                      label={h.name}
                      emoji={h.emoji}
                      color={h.color}
                      onClick={() => navigate('/explore')}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      </motion.div>
    </PageCanvas>
  );
}
