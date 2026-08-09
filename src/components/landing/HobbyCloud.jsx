import { motion } from 'framer-motion';
import FlowingMenu from '../common/FlowingMenu';
import './HobbyCloud.css';

/* ---------------------------------------------------------------
   HOBBY CLOUD / FLOWING MENU — Interactive flowing interest marquee
   --------------------------------------------------------------- */

const HOBBY_MENU_ITEMS = [
  { text: 'Photography', link: '/explore', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&h=400&fit=crop&auto=format' },
  { text: 'Film & Cinema', link: '/explore', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&h=400&fit=crop&auto=format' },
  { text: 'Music & Guitar', link: '/explore', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&h=400&fit=crop&auto=format' },
  { text: 'Pottery & Craft', link: '/explore', image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=600&h=400&fit=crop&auto=format' },
  { text: 'Cooking & Food', link: '/explore', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600&h=400&fit=crop&auto=format' },
  { text: 'Bouldering & Sport', link: '/explore', image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=600&h=400&fit=crop&auto=format' },
];

export default function HobbyCloud() {
  return (
    <motion.section
      className="hobbycloud"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
    >
      <div className="hobbycloud__inner">
        {/* Section header */}
        <motion.div
          className="hobbycloud__header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="hobbycloud__label">What Are You Into?</span>
        </motion.div>

        {/* Flowing Menu Component */}
        <div style={{ height: '520px', position: 'relative', borderRadius: '24px', overflow: 'hidden', border: '2.5px solid var(--border)' }}>
          <FlowingMenu
            items={HOBBY_MENU_ITEMS}
            speed={14}
            textColor="var(--text)"
            bgColor="var(--surface)"
            marqueeBgColor="var(--yellow)"
            marqueeTextColor="#111111"
            borderColor="var(--border)"
          />
        </div>
      </div>
    </motion.section>
  );
}
