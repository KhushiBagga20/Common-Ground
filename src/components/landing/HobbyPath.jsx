import { motion } from 'framer-motion';
import ScrollStack, { ScrollStackItem } from '../common/ScrollStack';
import './HobbyPath.css';

/* ---------------------------------------------------------------
   HOBBY PATH — ScrollStack discovery chain
   --------------------------------------------------------------- */

const PATH_CARDS = [
  {
    title: '1. Start with Photography 📸',
    subtitle: 'It begins with taking pictures on your phone...',
    description: 'You start noticing light, composition, shadows, and ordinary moments that feel extraordinary.',
    badge: 'Step 01',
    color: '#4D7CFE',
  },
  {
    title: '2. Fall into Street Photography 🏙️',
    subtitle: 'One weekend you walk around downtown...',
    description: 'You start capturing candid moments, urban textures, and human connection in public spaces.',
    badge: 'Step 02',
    color: '#FF914D',
  },
  {
    title: '3. Discover Film & Vintage Cameras 🎬',
    subtitle: 'Someone hands you an 80s SLR camera...',
    description: 'You learn patience, 36 exposures per roll, grain, manual focus, and the joy of unexpected light leaks.',
    badge: 'Step 03',
    color: '#9B72FF',
  },
  {
    title: '4. Step into the Darkroom 🖤',
    subtitle: 'Red light, chemicals, silver gelatin prints...',
    description: 'Watching an image slowly materialize in a tray of developer feels like magic every single time.',
    badge: 'Step 04',
    color: '#5BCB77',
  },
  {
    title: '5. Find Your Community 🌻',
    subtitle: 'And now you run a local photo club!',
    description: 'You connect with fellow photographers, organize photowalks, and exhibit your prints together on CommonGround.',
    badge: 'Destination',
    color: '#FFD43B',
  },
];

export default function HobbyPath() {
  return (
    <motion.section
      className="hobbypath"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
    >
      <div className="hobbypath__inner">
        {/* Header */}
        <motion.div
          className="hobbypath__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="hobbypath__label">One Thing Leads To Another</span>
        </motion.div>

        {/* ScrollStack Component */}
        <div style={{ height: '620px', position: 'relative', width: '100%', borderRadius: '24px', overflow: 'hidden' }}>
          <ScrollStack
            itemDistance={50}
            itemScale={0.035}
            itemStackDistance={24}
            stackPosition="15%"
            scaleEndPosition="8%"
            baseScale={0.88}
            rotationAmount={1}
            blurAmount={1}
          >
            {PATH_CARDS.map((card, i) => (
              <ScrollStackItem key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{
                    background: card.color,
                    color: '#111111',
                    padding: '4px 14px',
                    borderRadius: '999px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {card.badge}
                  </span>
                  <span className="font-accent" style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                    0{i + 1} / 05
                  </span>
                </div>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px', letterSpacing: '-0.02em', color: 'var(--text)' }}>
                  {card.title}
                </h3>
                <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--muted)', marginBottom: '12px' }}>
                  {card.subtitle}
                </p>
                <p style={{ lineHeight: 1.5, fontSize: '0.95rem', opacity: 0.9, color: 'var(--text)' }}>
                  {card.description}
                </p>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>
      </div>
    </motion.section>
  );
}
