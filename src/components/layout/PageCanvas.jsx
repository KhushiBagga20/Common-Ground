import { motion } from 'framer-motion';
import { pageVariants } from '../../animations/variants';
import './PageCanvas.css';

export default function PageCanvas({
  children,
  className = '',
  maxWidth = '1200px',
  noPadding = false,
  withNav = true,
}) {
  return (
    <motion.main
      className={`page-canvas ${withNav ? 'page-with-nav' : ''} ${noPadding ? '' : 'page-canvas--padded'} ${className}`}
      style={{ '--page-max-width': maxWidth }}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="page-canvas__inner">
        {children}
      </div>
    </motion.main>
  );
}
