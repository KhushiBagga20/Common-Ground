import { motion } from 'framer-motion';

export default function HobbiesCard({ hobbies }) {
  return (
    <div className="profile-card profile-card--hobbies">
      <div className="profile-card__header">
        <h3 className="profile-card__title">My Top Hobbies</h3>
      </div>
      
      <div className="profile-card__body">
        <div className="profile-hobbies-grid">
          {hobbies.map((hobby, index) => (
            <motion.div
              key={hobby.id}
              className="profile-hobby-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -3 }}
            >
              <div className="profile-hobby-card__emoji">{hobby.emoji}</div>
              <div className="profile-hobby-card__content">
                <h4 className="profile-hobby-card__name">{hobby.name}</h4>
                <p className="profile-hobby-card__desc">{hobby.description}</p>
              </div>
              <div className="profile-hobby-card__accent" style={{ backgroundColor: hobby.color }} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
