import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import Lenis from 'lenis';

// Layout & Common Components
import PageCanvas from '../components/layout/PageCanvas';
import KineticCheckerboard from '../components/common/KineticCheckerboard';

// Profile Sub-components
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileStats from '../components/profile/ProfileStats';
import ProfileTabs from '../components/profile/ProfileTabs';
import AboutCard from '../components/profile/AboutCard';
import HobbiesCard from '../components/profile/HobbiesCard';
import ActivityCard from '../components/profile/ActivityCard';
import BadgesCard from '../components/profile/BadgesCard';
import ShareVibeCard from '../components/profile/ShareVibeCard';
import ProfileCompletionCard from '../components/profile/ProfileCompletionCard';
import ConnectionsCard from '../components/profile/ConnectionsCard';
import AchievementsCard from '../components/profile/AchievementsCard';

// Data
import { profileData } from '../data/profileData';
import { communities } from '../data/communities';

// Animation Variants
import { staggerContainer, staggerItem } from '../animations/variants';

// Stylesheet
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('cg-profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse cg-profile from localStorage", e);
      }
    }
    // Seed localStorage so it's consistently stored
    localStorage.setItem('cg-profile', JSON.stringify(profileData));
    return profileData;
  });
  const [activeTab, setActiveTab] = useState('about');

  // Smooth scroll activation on desktop views
  useEffect(() => {
    let lenis;
    if (window.innerWidth > 768) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
      });

      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };

      requestAnimationFrame(raf);
    }

    return () => {
      if (lenis) {
        lenis.destroy();
      }
    };
  }, []);

  const handleProfileUpdate = (updatedFields) => {
    setProfile(prev => {
      const next = {
        ...prev,
        ...updatedFields
      };
      localStorage.setItem('cg-profile', JSON.stringify(next));
      return next;
    });
  };

  // Get relevant communities
  const userCommunities = useMemo(() => {
    const hobbyIds = profile.hobbies.map(h => h.id);
    return communities.filter(c => hobbyIds.includes(c.hobbyId));
  }, [profile.hobbies]);

  // Tab switcher content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <motion.div
            key="about-tab"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            exit="exit"
            className="profile-tab-pane"
          >
            <motion.div variants={staggerItem} style={{ marginBottom: 'var(--space-lg)' }}>
              <AboutCard aboutMe={profile.aboutMe} />
            </motion.div>
            
            <motion.div variants={staggerItem} style={{ marginBottom: 'var(--space-lg)' }}>
              <HobbiesCard hobbies={profile.hobbies} />
            </motion.div>
            
            <motion.div variants={staggerItem} style={{ marginBottom: 'var(--space-lg)' }}>
              <ActivityCard activities={profile.activities} />
            </motion.div>
            
            <motion.div variants={staggerItem}>
              <BadgesCard badges={profile.badges} />
            </motion.div>
          </motion.div>
        );

      case 'communities':
        return (
          <motion.div
            key="communities-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="profile-card"
          >
            <div className="profile-card__header">
              <h3 className="profile-card__title">My Communities</h3>
              <span className="font-accent text-muted">{userCommunities.length} joined</span>
            </div>
            <div className="profile-card__body">
              <div className="profile-communities-grid-wrapper">
                {userCommunities.map((community) => (
                  <motion.div
                    key={community.id}
                    className="explore__trending-card"
                    whileHover={{ y: -3 }}
                    onClick={() => navigate(`/community/${community.id}`)}
                    style={{ margin: 0 }}
                  >
                    <div className="explore__trending-accent" style={{ backgroundColor: community.color }} />
                    <h4 className="explore__trending-name" style={{ fontSize: 'var(--text-sm)' }}>{community.name}</h4>
                    <p className="explore__trending-desc text-muted" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-sm)' }}>
                      {community.description}
                    </p>
                    <div className="explore__trending-meta text-muted" style={{ fontSize: '9px' }}>
                      {community.memberCount} members · {community.postCount} posts
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 'hobbies':
        return (
          <motion.div
            key="hobbies-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <HobbiesCard hobbies={profile.hobbies} />
          </motion.div>
        );

      case 'activity':
        return (
          <motion.div
            key="activity-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ActivityCard activities={profile.activities} />
          </motion.div>
        );

      case 'saved':
        return (
          <motion.div
            key="saved-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="profile-card"
          >
            <div className="profile-card__header">
              <h3 className="profile-card__title">Saved Items</h3>
            </div>
            <div className="profile-card__body">
              <div className="profile-activity-list">
                <div className="profile-activity-item" style={{ alignItems: 'center', padding: 'var(--space-xl)', textAlign: 'center', background: 'var(--bg)' }}>
                  <Heart size={32} style={{ marginBottom: 'var(--space-sm)', color: 'var(--pink)' }} />
                  <h4 className="profile-activity-item__title">No saved posts yet</h4>
                  <p className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                    Save discussions and resources you want to read again later!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'settings':
        return (
          <motion.div
            key="settings-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="profile-card"
          >
            <div className="profile-card__header">
              <h3 className="profile-card__title">Account Settings</h3>
            </div>
            <div className="profile-card__body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div>
                <label className="text-muted" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase' }}>Theme preference</label>
                <p className="text-secondary" style={{ fontSize: 'var(--text-sm)', marginTop: '2px' }}>
                  You can change the global theme from the floating bottom navigation.
                </p>
              </div>
              <div style={{ borderTop: '1.5px solid var(--border-light)', paddingTop: 'var(--space-md)' }}>
                <label className="text-muted" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase' }}>Notification settings</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked />
                    <span>Email updates for replies to my posts</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked />
                    <span>Weekly digest of trending discussions</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <PageCanvas maxWidth="1320px">
      {/* Background Checkerboard Texture */}
      <KineticCheckerboard />

      <motion.div
        className="profile-container"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <div className="profile-grid">
          {/* Main Column */}
          <main className="profile-grid__main">
            {/* Header section */}
            <motion.section variants={staggerItem}>
              <ProfileHeader data={profile} onUpdate={handleProfileUpdate} />
            </motion.section>

            {/* Stats section */}
            <motion.section variants={staggerItem}>
              <ProfileStats stats={profile.stats} />
            </motion.section>

            {/* Navigation Tabs */}
            <motion.section variants={staggerItem}>
              <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </motion.section>

            {/* Content pane */}
            <div className="profile-tab-content">
              <AnimatePresence mode="wait">
                {renderTabContent()}
              </AnimatePresence>
            </div>
          </main>

          {/* Right Sidebar Column */}
          <aside className="profile-grid__right">
            <motion.div variants={staggerItem}>
              <ShareVibeCard vibe={profile.vibe} />
            </motion.div>
            
            <motion.div variants={staggerItem}>
              <ProfileCompletionCard items={profile.completionItems} />
            </motion.div>
            
            <motion.div variants={staggerItem}>
              <ConnectionsCard connections={profile.connections} />
            </motion.div>
            
            <motion.div variants={staggerItem}>
              <AchievementsCard achievements={profile.achievements} />
            </motion.div>
          </aside>
        </div>
      </motion.div>
    </PageCanvas>
  );
}
