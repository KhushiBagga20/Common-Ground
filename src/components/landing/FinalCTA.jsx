import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Compass } from 'lucide-react';
import Button from '../common/Button';
import SunflowerMascot from '../common/SunflowerMascot';
import './FinalCTA.css';

/* ---------------------------------------------------------------
   FINAL CTA — Clean ending with sunflower

   Large handwritten text, two buttons, small sunflower.
   Brings the visual language back to simplicity.
   --------------------------------------------------------------- */

export default function FinalCTA() {
  const navigate = useNavigate();

  const handleClick = (path) => {
    window.dispatchEvent(new Event('sunflower-react'));
    setTimeout(() => navigate(path), 400);
  };

  return (
    <motion.section
      className="finalcta"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Subtle checker edges */}
      <div className="finalcta__checker" aria-hidden="true" />

      <div className="finalcta__inner">
        {/* Mini sunflower */}
        <motion.div
          className="finalcta__sunflower"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
        >
          <SunflowerMascot className="finalcta__sunflower-mascot" />
        </motion.div>

        {/* Copy */}
        <motion.h2
          className="finalcta__text font-accent"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          there's something out there for you.
        </motion.h2>

        {/* Buttons */}
        <motion.div
          className="finalcta__actions"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <Button
            size="lg"
            onClick={() => handleClick('/onboarding')}
            iconRight={<ArrowRight size={20} />}
          >
            Discover Hobbies
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleClick('/ground')}
            icon={<Compass size={18} />}
          >
            Explore first
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
