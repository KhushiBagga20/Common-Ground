import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Plus, User, Layers } from 'lucide-react';
import './BottomNav.css';

export default function BottomNav() {
  const location = useLocation();

  const hiddenRoutes = ['/', '/onboarding'];
  if (hiddenRoutes.includes(location.pathname)) return null;

  const links = [
    { to: '/ground', icon: Layers, label: 'Ground' },
    { to: '/explore', icon: Compass, label: 'Explore' },
    { to: '/create', icon: Plus, label: 'Create' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <motion.nav
      className="bottom-nav"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <div className="bottom-nav__icon-wrap">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <motion.div
                    className="bottom-nav__dot"
                    layoutId="bottomNavDot"
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  />
                )}
              </div>
              <span className="bottom-nav__label">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </motion.nav>
  );
}
