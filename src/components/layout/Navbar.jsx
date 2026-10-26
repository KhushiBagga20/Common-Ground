import { useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, useAnimationControls } from 'framer-motion';
import { Calendar, Plus, User, Sun, Moon, Layers } from 'lucide-react';
import Sunflower from '../common/Sunflower';
import { useTheme } from '../../hooks/useTheme';
import { changeChannel } from '../../lib/channel';
import './Navbar.css';

// Hide navbar on landing, onboarding, and discover (immersive pages)
const HIDDEN_ROUTES = ['/', '/onboarding', '/discover'];

const LINKS = [
  { to: '/ground', icon: Layers, label: 'Ground', accent: 'var(--yellow)' },
  { to: '/events', icon: Calendar, label: 'Events', accent: 'var(--blue)' },
  { to: '/create', icon: Plus, label: 'Create', accent: 'var(--pink)' },
  { to: '/profile', icon: User, label: 'Profile', accent: 'var(--green)' },
];

function isTyping(target) {
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  // Routes match case-insensitively, so compare lowercased paths too
  const pathname = location.pathname.toLowerCase();
  const hidden = HIDDEN_ROUTES.includes(pathname);
  const keyRefs = useRef([]);
  const sunflower = useAnimationControls();

  // Switch pages with the channel-change sweep from the pressed key
  const switchTo = (index) => {
    const link = LINKS[index];
    if (pathname === link.to) return;
    changeChannel(keyRefs.current[index], {
      color: link.accent,
      no: index + 1,
      label: link.label,
      go: () => navigate(link.to),
    });
  };

  const handleKeyClick = (e, index) => {
    // Let cmd/ctrl-click open a new tab as usual
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    switchTo(index);
  };

  // Keys 1–4 jump between the dock's pages
  useEffect(() => {
    if (hidden) return;
    const onKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      const index = Number(e.key) - 1;
      if (LINKS[index]) switchTo(index);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  // The sunflower does a happy spin whenever something good happens
  useEffect(() => {
    const onCelebrate = () => sunflower.start({
      rotate: [0, -20, 360],
      scale: [1, 1.35, 1],
      transition: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] },
    });
    window.addEventListener('cg-celebrate', onCelebrate);
    return () => window.removeEventListener('cg-celebrate', onCelebrate);
  }, [sunflower]);

  if (hidden) return null;

  return (
    <motion.nav
      className="dock-nav"
      aria-label="Main"
      initial={{ y: 50, opacity: 0, x: '-50%' }}
      animate={{ y: 0, opacity: 1, x: '-50%' }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
    >
      <div className="dock-nav__inner">
        {/* Navigation keys — the active page's key stays pressed with its LED lit */}
        <div className="dock-nav__links">
          {LINKS.map(({ to, icon: Icon, label, accent }, i) => {
            const isActive = to === '/ground'
              ? (pathname === '/ground' || pathname.startsWith('/explore'))
              : (pathname === to || (to !== '/ground' && pathname.startsWith(to)));

            return (
              <NavLink
                key={to}
                to={to}
                ref={el => { keyRefs.current[i] = el; }}
                onClick={e => handleKeyClick(e, i)}
                className={`dock-key ${isActive ? 'dock-key--active' : ''}`}
                style={{ '--key-accent': accent }}
                aria-current={isActive ? 'page' : undefined}
                title={`${label} (${i + 1})`}
              >
                <span className="dock-key__base" aria-hidden="true" />
                <span className="dock-key__top">
                  <span className="dock-key__meta" aria-hidden="true">
                    <span className="dock-key__legend pixel">{i + 1}</span>
                    <span className="dock-key__led" />
                  </span>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2.2} aria-hidden="true" />
                  <span className="dock-key__label">{label}</span>
                </span>
              </NavLink>
            );
          })}
        </div>

        <div className="dock-nav__divider" />

        {/* Sunflower — Home Button */}
        <NavLink to="/" className="dock-nav__sunflower" title="Back to Home">
          <motion.div
            animate={sunflower}
            whileHover={{ scale: 1.18, rotate: 12 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Sunflower size={28} animate={false} />
          </motion.div>
        </NavLink>

        {/* Theme Toggle */}
        <button
          className="dock-nav__theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <motion.div
            key={theme}
            initial={{ rotate: -30, opacity: 0, scale: 0.8 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </motion.div>
        </button>
      </div>
    </motion.nav>
  );
}
