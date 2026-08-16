import { motion } from 'framer-motion';
import PageCanvas from '../components/layout/PageCanvas';
import Smiley from '../components/common/Smiley';
import KineticCheckerboard from '../components/common/KineticCheckerboard';
import { staggerContainer, staggerItem } from '../animations/variants';

export default function Events() {
  return (
    <PageCanvas>
      <KineticCheckerboard />
      <motion.div
        className="events-page"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          padding: 'var(--space-xl) var(--space-m)'
        }}
      >
        <motion.div variants={staggerItem} style={{ marginBottom: 'var(--space-m)' }}>
          <Smiley size={64} mood="happy" />
        </motion.div>
        
        <motion.h1 
          variants={staggerItem} 
          style={{ 
            fontSize: 'var(--text-2xl)', 
            fontWeight: 700, 
            marginBottom: 'var(--space-s)',
            fontFamily: 'inherit'
          }}
        >
          Events
        </motion.h1>
        
        <motion.p 
          variants={staggerItem} 
          className="text-muted" 
          style={{ 
            maxWidth: '400px',
            fontSize: 'var(--text-sm)',
            lineHeight: 1.5
          }}
        >
          Find offline meetups, workshops, and gatherings around your interests. Coming soon in V2!
        </motion.p>
      </motion.div>
    </PageCanvas>
  );
}
