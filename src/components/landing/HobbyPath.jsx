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
        <div className="hobbypath__stack-container">
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
                <div className="hobbypath__card-header">
                  <span className="hobbypath__card-badge" style={{ background: card.color }}>
                    {card.badge}
                  </span>
                  <span className="hobbypath__card-step-num font-accent">
                    0{i + 1} / 05
                  </span>
                </div>

                <h3 className="hobbypath__card-title">
                  {card.title}
                </h3>
                <p className="hobbypath__card-subtitle">
                  {card.subtitle}
                </p>
                <p className="hobbypath__card-desc">
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
