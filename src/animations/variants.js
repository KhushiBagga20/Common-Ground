/* ============================================
   COMMONGROUND — FRAMER MOTION VARIANTS
   ============================================ */

// Page entrance
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
  }
};

// Stagger children
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  }
};

// Card hover
export const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -4,
    scale: 1.01,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
  }
};

// Button interactions
export const buttonTap = {
  whileTap: { scale: 0.96 },
  whileHover: { scale: 1.02 },
  transition: { type: 'spring', stiffness: 400, damping: 17 }
};

// Fade in
export const fadeIn = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.4 }
  }
};

// Scale in
export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  }
};

// Slide up
export const slideUp = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

// Draw SVG path
export const drawPath = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
  }
};

// Hobby card swipe
export const swipeCardVariants = {
  center: {
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  },
  exitLeft: {
    x: -300,
    rotate: -20,
    opacity: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  },
  exitRight: {
    x: 300,
    rotate: 20,
    opacity: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  },
  stack1: {
    scale: 0.95,
    y: 8,
    opacity: 0.7,
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  },
  stack2: {
    scale: 0.9,
    y: 16,
    opacity: 0.4,
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  }
};

// Bloom animation for sunflower
export const bloomVariants = {
  initial: { scale: 0, rotate: -30, opacity: 0 },
  animate: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.34, 1.56, 0.64, 1]
    }
  }
};

// Nav item
export const navItemVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};
