import { motion } from 'framer-motion';

export default function BadgesCard({ badges }) {
  return (
    <div className="profile-card profile-card--badges">
      <div className="profile-card__header">
        <h3 className="profile-card__title">Badges</h3>
      </div>
      
      <div className="profile-card__body">
        <div className="profile-badges-grid">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.id}
              className="profile-badge-item"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <div 
                className="profile-badge-item__icon-wrap"
                style={{ backgroundColor: badge.color }}
              >
                <span className="profile-badge-item__emoji">{badge.emoji}</span>
              </div>
              <h4 className="profile-badge-item__name">{badge.name}</h4>
              <p className="profile-badge-item__desc">{badge.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
