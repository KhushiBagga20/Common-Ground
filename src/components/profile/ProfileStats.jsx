import { motion } from 'framer-motion';

/* ── Tiny hand-drawn doodle icons for each stat card ─────────── */

function DoodleFlower({ color = '#FF8FAB', size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <ellipse cx="12" cy="5" rx="2.8" ry="4.5" fill={color} opacity="0.85" />
      <ellipse cx="12" cy="19" rx="2.8" ry="4.5" fill={color} opacity="0.85" />
      <ellipse cx="5" cy="12" rx="4.5" ry="2.8" fill={color} opacity="0.85" />
      <ellipse cx="19" cy="12" rx="4.5" ry="2.8" fill={color} opacity="0.85" />
      <ellipse cx="7.5" cy="7.5" rx="2.8" ry="4.5" fill={color} opacity="0.75" transform="rotate(-45 7.5 7.5)" />
      <ellipse cx="16.5" cy="16.5" rx="2.8" ry="4.5" fill={color} opacity="0.75" transform="rotate(-45 16.5 16.5)" />
      <ellipse cx="16.5" cy="7.5" rx="2.8" ry="4.5" fill={color} opacity="0.75" transform="rotate(45 16.5 7.5)" />
      <ellipse cx="7.5" cy="16.5" rx="2.8" ry="4.5" fill={color} opacity="0.75" transform="rotate(45 7.5 16.5)" />
      <circle cx="12" cy="12" r="4" fill="white" stroke={color} strokeWidth="1" />
    </svg>
  );
}

function DoodleSunflower({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <ellipse cx="12" cy="5" rx="2.2" ry="3.8" fill="#FFD43B" opacity="0.9" />
      <ellipse cx="12" cy="19" rx="2.2" ry="3.8" fill="#FFD43B" opacity="0.9" />
      <ellipse cx="5" cy="12" rx="3.8" ry="2.2" fill="#FFD43B" opacity="0.9" />
      <ellipse cx="19" cy="12" rx="3.8" ry="2.2" fill="#FFD43B" opacity="0.9" />
      <ellipse cx="7.5" cy="7.5" rx="2.2" ry="3.8" fill="#FFD43B" opacity="0.8" transform="rotate(-45 7.5 7.5)" />
      <ellipse cx="16.5" cy="16.5" rx="2.2" ry="3.8" fill="#FFD43B" opacity="0.8" transform="rotate(-45 16.5 16.5)" />
      <ellipse cx="16.5" cy="7.5" rx="2.2" ry="3.8" fill="#FFD43B" opacity="0.8" transform="rotate(45 16.5 7.5)" />
      <ellipse cx="7.5" cy="16.5" rx="2.2" ry="3.8" fill="#FFD43B" opacity="0.8" transform="rotate(45 7.5 16.5)" />
      <circle cx="12" cy="12" r="4.2" fill="#8B6914" />
    </svg>
  );
}

function DoodleSparkle({ color = '#7DE8B0', size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <line x1="12" y1="2" x2="12" y2="6" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="12" y1="18" x2="12" y2="22" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="2" y1="12" x2="6" y2="12" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="18" y1="12" x2="22" y2="12" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="5" y1="5" x2="7.8" y2="7.8" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="16.2" y1="16.2" x2="19" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="19" y1="5" x2="16.2" y2="7.8" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="7.8" y1="16.2" x2="5" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2.5" fill={color} opacity="0.6" />
    </svg>
  );
}

function DoodleStar({ color = '#A084D8', size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2 L14 9 L21 9 L15.5 13.5 L17.5 20.5 L12 16.5 L6.5 20.5 L8.5 13.5 L3 9 L10 9 Z"
        fill={color} opacity="0.9" />
    </svg>
  );
}

function DoodlePeachFlower({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <ellipse cx="12" cy="5.5" rx="2.5" ry="4" fill="#FFCCAA" opacity="0.9" />
      <ellipse cx="12" cy="18.5" rx="2.5" ry="4" fill="#FFCCAA" opacity="0.9" />
      <ellipse cx="5.5" cy="12" rx="4" ry="2.5" fill="#FFCCAA" opacity="0.9" />
      <ellipse cx="18.5" cy="12" rx="4" ry="2.5" fill="#FFCCAA" opacity="0.9" />
      <ellipse cx="7.8" cy="7.8" rx="2.5" ry="4" fill="#FFCCAA" opacity="0.8" transform="rotate(-45 7.8 7.8)" />
      <ellipse cx="16.2" cy="16.2" rx="2.5" ry="4" fill="#FFCCAA" opacity="0.8" transform="rotate(-45 16.2 16.2)" />
      <ellipse cx="16.2" cy="7.8" rx="2.5" ry="4" fill="#FFCCAA" opacity="0.8" transform="rotate(45 16.2 7.8)" />
      <ellipse cx="7.8" cy="16.2" rx="2.5" ry="4" fill="#FFCCAA" opacity="0.8" transform="rotate(45 7.8 16.2)" />
      <circle cx="12" cy="12" r="3.8" fill="white" stroke="#FFCCAA" strokeWidth="1.2" />
    </svg>
  );
}

const STAT_CONFIGS = [
  {
    label: 'Communities',
    key: 'communities',
    color: '#FF8FAB',
    bgColor: '#FFE8F0',
    tint: '#FFE8F0',
    doodle: <DoodleFlower color="#FF8FAB" size={17} />,
  },
  {
    label: 'Hobbies',
    key: 'hobbies',
    color: '#FFD43B',
    bgColor: '#FFF8CC',
    tint: '#FFF8CC',
    doodle: <DoodleSunflower size={17} />,
  },
  {
    label: 'Connections',
    key: 'connections',
    color: '#6ED8A4',
    bgColor: '#E0FAE9',
    tint: '#E0FAE9',
    doodle: <DoodleSparkle color="#6ED8A4" size={17} />,
  },
  {
    label: 'Events',
    key: 'events',
    color: '#93BCFF',
    bgColor: '#E8F0FF',
    tint: '#E8F0FF',
    doodle: <DoodleStar color="#93BCFF" size={16} />,
  },
  {
    label: 'Badges',
    key: 'badges',
    color: '#C9AEFF',
    bgColor: '#F0EAFF',
    tint: '#FFCCAA',
    doodle: <DoodlePeachFlower size={17} />,
  },
];

export default function ProfileStats({ stats }) {
  return (
    <div className="profile-stats">
      {STAT_CONFIGS.map((item, index) => (
        <motion.div
          key={item.label}
          className="profile-stats__card"
          style={{ '--stat-tint': item.tint }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06, duration: 0.3 }}
          whileHover={{ y: -4, transition: { duration: 0.15 } }}
        >
          {/* Coloured top accent bar */}
          <div className="profile-stats__accent" style={{ backgroundColor: item.color }} />

          {/* Decorative pastel blob in background */}
          <div
            className="profile-stats__bg-blob"
            style={{ background: item.bgColor }}
            aria-hidden="true"
          />

          {/* Hand-drawn doodle icon — top-left corner */}
          <span className="profile-stats__doodle" aria-hidden="true">{item.doodle}</span>

          <span className="profile-stats__value">{stats[item.key]}</span>
          <span className="profile-stats__label">{item.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
