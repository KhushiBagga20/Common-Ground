import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';
import PageCanvas from '../components/layout/PageCanvas';
import Button from '../components/common/Button';
import InterestTag from '../components/common/InterestTag';
import Smiley from '../components/common/Smiley';
import Sunflower from '../components/common/Sunflower';
import { hobbies } from '../data/hobbies';
import { profileData } from '../data/profileData';
import { staggerContainer, staggerItem } from '../animations/variants';
import './CreatePost.css';

const POST_TYPES = [
  { id: 'discussion', label: 'Discussion', emoji: '💬' },
  { id: 'question', label: 'Question', emoji: '❓' },
  { id: 'idea', label: 'Idea', emoji: '💡' },
  { id: 'project', label: 'Project', emoji: '🚀' },
];

export default function CreatePost() {
  const navigate = useNavigate();
  const [postType, setPostType] = useState('discussion');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleInterest = (hobbyId) => {
    setSelectedInterests(prev =>
      prev.includes(hobbyId)
        ? prev.filter(id => id !== hobbyId)
        : [...prev, hobbyId]
    );
  };

  const handleSubmit = () => {
    // Construct the new activity/post object
    const interestNames = selectedInterests
      .map(id => hobbies.find(h => h.id === id)?.name)
      .filter(Boolean);

    const firstHobby = hobbies.find(h => h.id === selectedInterests[0]);
    const communityName = firstHobby ? firstHobby.name : 'General';

    // Get current profile from localStorage
    const savedProfile = localStorage.getItem('cg-profile');
    let currentProfile = profileData;
    if (savedProfile) {
      try {
        currentProfile = JSON.parse(savedProfile);
      } catch (e) {
        console.error("Failed to parse cg-profile from localStorage", e);
      }
    }

    const newActivity = {
      id: Date.now(),
      type: postType, // 'discussion' | 'question' | 'idea' | 'project'
      community: communityName,
      title: title,
      body: body, // Details / content
      interests: interestNames, // Tagged interests
      timestamp: 'Just now', // Creation time text (displays in Recent Activity)
      replies: 0,
      createdAt: new Date().toISOString()
    };

    const updatedProfile = {
      ...currentProfile,
      activities: [newActivity, ...currentProfile.activities]
    };

    localStorage.setItem('cg-profile', JSON.stringify(updatedProfile));

    setSubmitted(true);
    setTimeout(() => navigate('/ground'), 2000);
  };

  const canSubmit = title.trim().length > 0 && selectedInterests.length > 0;

  if (submitted) {
    return (
      <PageCanvas>
        <div className="create-bg-pattern" />
        <motion.div
          className="create-post__success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <Smiley size={56} mood="happy" />
          <h2>Posted!</h2>
          <p className="text-muted">Your post is now live. Taking you back to Ground...</p>
        </motion.div>
      </PageCanvas>
    );
  }

  return (
    <PageCanvas maxWidth="1100px">
      <div className="create-bg-pattern" />

      <div className="create-layout-container">
        {/* Left Side Decoration (Desktop only) */}
        <div className="create-side-decor create-side-decor--left">
          <div className="share-phrase font-accent">share something ↓</div>
          <div className="side-doodles">
            <span className="side-star">★</span>
            <span className="side-sparkle">✦</span>
          </div>
        </div>

        {/* Center Card */}
        <motion.div
          className="create-post-card"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Subtle top accent edge */}
          <div className="create-card-accent" />

          {/* Background doodles behind form content */}
          <div className="card-bg-doodles">
            <span className="card-bg-star card-bg-star--1">✦</span>
            <span className="card-bg-heart">♡</span>
          </div>

          <div className="create-post">
            {/* Back */}
            <motion.button
              className="create-post__back"
              onClick={() => navigate(-1)}
              variants={staggerItem}
              whileHover={{ x: -3 }}
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </motion.button>

            <motion.h1 className="create-post__title" variants={staggerItem}>
              Create a post
            </motion.h1>

            {/* Post type selector */}
            <motion.div className="create-post__types" variants={staggerItem}>
              {POST_TYPES.map(type => (
                <button
                  key={type.id}
                  className={`create-post__type-btn create-post__type-btn--${type.id} ${postType === type.id ? 'create-post__type-btn--active' : ''}`}
                  onClick={() => setPostType(type.id)}
                >
                  <span>{type.emoji}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </motion.div>

            {/* Title */}
            <motion.div className="create-post__field" variants={staggerItem}>
              <input
                type="text"
                className="create-post__input"
                placeholder="What's on your mind?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </motion.div>

            {/* Body */}
            <motion.div className="create-post__field" variants={staggerItem}>
              <textarea
                className="create-post__textarea"
                placeholder="Share more details..."
                rows={5}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </motion.div>

            {/* Interest tags */}
            <motion.div className="create-post__field" variants={staggerItem}>
              <label className="create-post__label">Tag interests</label>
              <div className="create-post__interest-picker">
                {hobbies.slice(0, 12).map(hobby => (
                  <InterestTag
                    key={hobby.id}
                    label={hobby.name}
                    emoji={hobby.emoji}
                    color={hobby.color}
                    size="sm"
                    selected={selectedInterests.includes(hobby.id)}
                    onClick={() => toggleInterest(hobby.id)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div className="create-post__actions" variants={staggerItem}>
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={!canSubmit}
                icon={<Send size={18} />}
              >
                Post
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side Decoration (Desktop only) */}
        <div className="create-side-decor create-side-decor--right">
          <div className="sunflower-container">
            <Sunflower size={64} animate={false} color="var(--yellow)" />
            <div className="sunflower-stem-doodle">
              <svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 0 Q10 25 30 40 T20 60" stroke="var(--border)" strokeWidth="2.5" strokeLinecap="round" fill="none" strokeDasharray="3 5" />
              </svg>
            </div>
          </div>
          <div className="side-doodles">
            <span className="side-heart">♡</span>
          </div>
        </div>
      </div>
    </PageCanvas>
  );
}
