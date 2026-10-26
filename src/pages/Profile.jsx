import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, LogIn, LogOut } from 'lucide-react';
import Lenis from 'lenis';

// Layout & Common Components
import PageCanvas from '../components/layout/PageCanvas';
import KineticCheckerboard from '../components/common/KineticCheckerboard';
import Button from '../components/common/Button';
import Smiley from '../components/common/Smiley';

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
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';

// Animation Variants
import { staggerContainer, staggerItem } from '../animations/variants';
import { revealOnScroll } from '../lib/motion';

// Stylesheet
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const { profile, updateProfile, loading } = useProfile();
  const { communities, isJoined, deletePost } = useAppData();
  const { configured, user, openSignIn, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('about');

  // Smooth scroll activation on desktop views
  useEffect(() => {
    let lenis;
    let frameId;
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
        frameId = requestAnimationFrame(raf);
      };

      frameId = requestAnimationFrame(raf);
    }

    return () => {
      cancelAnimationFrame(frameId);
      if (lenis) {
        lenis.destroy();
      }
    };
  }, []);

  // Deleting an activity also removes the post it points to
  const handleDeleteActivity = (activityId) => {
    const activity = profile.activities.find(a => a.id === activityId);
    if (activity?.postId) deletePost(activity.postId);
    updateProfile({ activities: profile.activities.filter(a => a.id !== activityId) });
  };

  // Get relevant communities
  // Joined communities, plus the ones matching your hobbies
  const userCommunities = useMemo(() => {
    if (!profile) return [];
    const hobbyIds = profile.hobbies.map(h => h.id);
    return communities.filter(c => isJoined(c.id) || hobbyIds.includes(c.hobbyId));
  }, [profile, communities, isJoined]);

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
            
            <motion.div {...revealOnScroll} style={{ marginBottom: 'var(--space-lg)' }}>
              <HobbiesCard hobbies={profile.hobbies} />
            </motion.div>
            
            <motion.div {...revealOnScroll} style={{ marginBottom: 'var(--space-lg)' }}>
              <ActivityCard activities={profile.activities} onDelete={handleDeleteActivity} />
            </motion.div>
            
            <motion.div {...revealOnScroll}>
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
            <ActivityCard activities={profile.activities} onDelete={handleDeleteActivity} />
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
              <div className="profile-account">
                <span className="mono-label text-muted">Account</span>
                {!configured && (
                  <p className="profile-account__text">
                    Demo mode — your profile and activity are saved in this browser only.
                  </p>
                )}
                {configured && !user && (
                  <>
                    <p className="profile-account__text">You're browsing as a guest.</p>
                    <Button size="sm" icon={<LogIn size={15} />} onClick={() => openSignIn()}>Sign in with email</Button>
                  </>
                )}
                {configured && user && (
                  <>
                    <p className="profile-account__text">Signed in as <strong>{user.email}</strong></p>
                    <Button size="sm" variant="secondary" icon={<LogOut size={15} />} onClick={signOut}>Sign out</Button>
                  </>
                )}
              </div>
              <div style={{ borderTop: '1.5px solid var(--border-light)', paddingTop: 'var(--space-md)' }}>
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

  if (loading || !profile) {
    return (
      <PageCanvas maxWidth="1320px">
        <KineticCheckerboard tint="var(--green)" />
        <div className="profile-loading">
          <Smiley size={44} mood="happy" />
          <p className="text-muted">Loading your profile…</p>
        </div>
      </PageCanvas>
    );
  }

  return (
    <PageCanvas maxWidth="1320px">
      {/* Background Checkerboard Texture */}
      <KineticCheckerboard tint="var(--green)" />

      <motion.div
        className="profile-container"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <div className="profile-grid">
          {/* Main Column */}
          <main className="profile-grid__main">
            {/* Guests see the sample profile until they sign in */}
            {configured && !user && (
              <motion.button
                type="button"
                className="profile-guest-banner"
                variants={staggerItem}
                onClick={() => openSignIn('Sign in to make this profile yours.')}
              >
                <span className="mono-label">Guest</span>
                <span>You're viewing a sample profile. <strong>Sign in to make it yours →</strong></span>
              </motion.button>
            )}

            {/* Header section — keyed so its edit form picks up a freshly loaded profile */}
            <motion.section variants={staggerItem}>
              <ProfileHeader key={profile.id ?? 'local'} data={profile} onUpdate={updateProfile} />
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
            
            <motion.div {...revealOnScroll}>
              <ConnectionsCard connections={profile.connections} />
            </motion.div>
            
            <motion.div {...revealOnScroll}>
              <AchievementsCard achievements={profile.achievements} />
            </motion.div>
          </aside>
        </div>
      </motion.div>
    </PageCanvas>
  );
}