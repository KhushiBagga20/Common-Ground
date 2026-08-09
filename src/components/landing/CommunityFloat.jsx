import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getTrendingCommunities } from '../../data/communities';
import './CommunityFloat.css';

/* ---------------------------------------------------------------
   COMMUNITY FLOAT — Floating community panels with parallax

   Asymmetric layout with cards at different sizes/rotations.
   Parallax scroll at different speeds per card.
   --------------------------------------------------------------- */

const CARD_CONFIGS = [
  { rot: -2, scale: 1,    offsetY: 0,   speed: 0.9, size: 'large' },
  { rot: 1.5, scale: 0.92, offsetY: 40,  speed: 1.1, size: 'medium' },
  { rot: -1, scale: 0.96, offsetY: -20, speed: 0.8, size: 'medium' },
  { rot: 2,  scale: 0.88, offsetY: 60,  speed: 1.2, size: 'small' },
  { rot: -1.5, scale: 0.94, offsetY: 10, speed: 1,   size: 'medium' },
];

export default function CommunityFloat() {
  const sectionRef = useRef(null);
  const communities = getTrendingCommunities().slice(0, 5);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  return (
    <motion.section
      ref={sectionRef}
      className="commfloat"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
    >
      <div className="commfloat__inner">
        {/* Header */}
        <motion.div
          className="commfloat__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="commfloat__label font-accent">people are into this</span>
          <h2 className="commfloat__title">real communities.<br />real conversations.</h2>
        </motion.div>

        {/* Floating cards */}
        <div className="commfloat__grid">
          {communities.map((community, i) => {
            const config = CARD_CONFIGS[i % CARD_CONFIGS.length];
            return (
              <FloatCard
                key={community.id}
                community={community}
                config={config}
                index={i}
                scrollYProgress={scrollYProgress}
              />
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

function FloatCard({ community, config, index, scrollYProgress }) {
  const yParallax = useTransform(
    scrollYProgress,
    [0, 1],
    [40 * config.speed, -40 * config.speed]
  );

  return (
    <motion.div
      className={`commfloat__card commfloat__card--${config.size}`}
      style={{
        y: yParallax,
        rotate: config.rot,
      }}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: config.scale }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        y: -10,
        rotate: 0,
        scale: 1,
        transition: { duration: 0.2 },
      }}
    >
      <div className="commfloat__card-accent" style={{ backgroundColor: community.color }} />
      <h3 className="commfloat__card-name">{community.name}</h3>
      <p className="commfloat__card-desc">{community.description}</p>
      <div className="commfloat__card-meta">
        <span>{community.memberCount} people</span>
        <span>·</span>
        <span>{community.postCount} posts</span>
      </div>
    </motion.div>
  );
}
