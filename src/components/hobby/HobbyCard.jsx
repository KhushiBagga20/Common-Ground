import { motion, useMotionValue, useTransform } from 'framer-motion';
import './HobbyCard.css';

export default function HobbyCard({
  hobby,
  isTop = false,
  onSwipe,
  style = {},
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const skipOpacity = useTransform(x, [-80, 0], [1, 0]);

  function handleDragEnd(_, info) {
    const threshold = 80;
    if (info.offset.x > threshold) {
      onSwipe?.('right');
    } else if (info.offset.x < -threshold) {
      onSwipe?.('left');
    }
  }

  return (
    <motion.div
      className={`hobby-card ${isTop ? 'hobby-card--top' : ''}`}
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        ...style,
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={isTop ? handleDragEnd : undefined}
      whileHover={isTop ? { cursor: 'grab' } : {}}
      whileDrag={{ cursor: 'grabbing' }}
    >
      {/* Swipe indicators */}
      {isTop && (
        <>
          <motion.div className="hobby-card__indicator hobby-card__indicator--like" style={{ opacity: likeOpacity }}>
            INTO IT ✦
          </motion.div>
          <motion.div className="hobby-card__indicator hobby-card__indicator--skip" style={{ opacity: skipOpacity }}>
            SKIP ✗
          </motion.div>
        </>
      )}

      {/* Card content */}
      <div className="hobby-card__inner" style={{ '--hobby-color': hobby.color }}>
        <div className="hobby-card__emoji">{hobby.emoji}</div>
        <h2 className="hobby-card__name">{hobby.name}</h2>
        <p className="hobby-card__desc">{hobby.description}</p>
        <div className="hobby-card__meta">
          <span className="hobby-card__category">{hobby.category}</span>
          <span className="hobby-card__members">{hobby.memberCount} people</span>
        </div>

        {/* Decorative accent bar */}
        <div className="hobby-card__accent-bar" style={{ backgroundColor: hobby.color }} />
      </div>
    </motion.div>
  );
}
