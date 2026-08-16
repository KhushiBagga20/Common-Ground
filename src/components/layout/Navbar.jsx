import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Plus, User, Sun, Moon, Layers } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import './Navbar.css';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Hide navbar on landing and onboarding
  const hiddenRoutes = ['/', '/onboarding'];
  if (hiddenRoutes.includes(location.pathname)) return null;

  const links = [
    { to: '/ground', icon: Layers, label: 'Ground' },
    { to: '/events', icon: Calendar, label: 'Events' },
    { to: '/create', icon: Plus, label: 'Create' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <motion.nav
      className="dock-nav"
      initial={{ y: 50, opacity: 0, x: '-50%' }}
      animate={{ y: 0, opacity: 1, x: '-50%' }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
    >
      <div className="dock-nav__inner">
        {/* Brand Mark */}
        <NavLink to="/" className="dock-nav__logo" title="CommonGround">
          <span className="dock-nav__logo-mark">⬛</span>
        </NavLink>

        <div className="dock-nav__divider" />

        {/* Navigation Links */}
        <div className="dock-nav__links">
          {links.map(({ to, icon: Icon, label }) => {
            const isActive = to === '/ground'
              ? (location.pathname === '/ground' || location.pathname.startsWith('/explore'))
              : (location.pathname === to || (to !== '/ground' && location.pathname.startsWith(to)));

            return (
              <NavLink
                key={to}
                to={to}
                className={`dock-nav__item ${isActive ? 'dock-nav__item--active' : ''}`}
              >
                {isActive && (
                  <motion.div
                    className="dock-nav__active-pill"
                    layoutId="dockActivePill"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                <span className="dock-nav__icon-wrap">
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                </span>
                <span className="dock-nav__label">{label}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="dock-nav__divider" />

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
