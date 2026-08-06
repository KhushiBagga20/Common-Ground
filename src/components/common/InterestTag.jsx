import { motion } from 'framer-motion';
import './InterestTag.css';

export default function InterestTag({
  label,
  color,
  emoji,
  size = 'md',
  selected = false,
  onClick,
  removable = false,
  onRemove,
}) {
  const tagStyle = color ? { '--tag-color': color } : {};

  return (
    <motion.button
      className={`interest-tag interest-tag--${size} ${selected ? 'interest-tag--selected' : ''} ${onClick ? 'interest-tag--clickable' : ''}`}
      style={tagStyle}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.03 } : {}}
      whileTap={onClick ? { scale: 0.97 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {/* Accent dot/marker for selective 10-15% color ratio */}
      {color && <span className="interest-tag__dot" style={{ backgroundColor: color }} />}
      {emoji && <span className="interest-tag__emoji">{emoji}</span>}
      <span className="interest-tag__label">{label}</span>
      {removable && (
        <span
          className="interest-tag__remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          role="button"
          aria-label={`Remove ${label}`}
        >
          ×
        </span>
      )}
    </motion.button>
  );
}
