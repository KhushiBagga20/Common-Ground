import { motion } from 'framer-motion';
import './Button.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  accent,
  icon,
  iconRight,
  fullWidth = false,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  ...props
}) {
  const accentStyle = accent ? { '--btn-accent': accent } : {};

  return (
    <motion.button
      type={type}
      className={`cg-btn cg-btn--${variant} cg-btn--${size} ${fullWidth ? 'cg-btn--full' : ''} ${className}`}
      style={accentStyle}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {icon && <span className="cg-btn__icon">{icon}</span>}
      {children && <span className="cg-btn__label">{children}</span>}
      {iconRight && <span className="cg-btn__icon cg-btn__icon--right">{iconRight}</span>}
    </motion.button>
  );
}
