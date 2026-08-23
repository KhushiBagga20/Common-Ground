import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import {
  Search, Bell, Heart, MessageCircle, Share2, Bookmark,
  ArrowRight, MoreHorizontal, RefreshCw, X, MapPin, Users,
  Music, Camera, Sparkles, BookOpen, PenTool, ArrowUpRight,
  Plus, Compass, Star
} from 'lucide-react';
import PageCanvas from '../components/layout/PageCanvas';
import Button from '../components/common/Button';
import InterestTag from '../components/common/InterestTag';
import Smiley from '../components/common/Smiley';
import Sunflower from '../components/common/Sunflower';
import ChessPattern from '../components/common/ChessPattern';
import KineticCheckerboard from '../components/common/KineticCheckerboard';
import AccordionGallery from '../components/common/AccordionGallery/AccordionGallery';
import { hobbies, hobbyCategories, getHobbyById } from '../data/hobbies';
import { communities, getCommunitiesByHobby } from '../data/communities';
import { posts as defaultPosts, getPostsByInterest } from '../data/posts';
import { users } from '../data/users';
import { staggerContainer, staggerItem } from '../animations/variants';
import './Ground.css';

// Import generated cute 2D sticker illustrations for hobbies
import imgPhoto from '../assets/hobbies/hobby_photography_1786871191346.jpg';
import imgGuitar from '../assets/hobbies/hobby_guitar_1786871505903.jpg';
import imgPottery from '../assets/hobbies/hobby_pottery_1786871778302.jpg';
import imgRunning from '../assets/hobbies/hobby_running_1786871855685.jpg';
import imgFilm from '../assets/hobbies/hobby_film_1786871879712.jpg';
import imgAiml from '../assets/hobbies/hobby_aiml_1786872114650.jpg';
import imgDrawing from '../assets/hobbies/hobby_drawing_1786872318655.jpg';
import imgCooking from '../assets/hobbies/hobby_cooking_1786872493583.jpg';
import imgWriting from '../assets/hobbies/hobby_writing_1787487280393.jpg';
import imgBouldering from '../assets/hobbies/hobby_bouldering_1787487296150.jpg';
import imgDance from '../assets/hobbies/hobby_dance_1787487312624.jpg';
import imgChess from '../assets/hobbies/hobby_chess_1787487328552.png';
import imgGardening from '../assets/hobbies/hobby_gardening_1787487360591.jpg';
import imgGaming from '../assets/hobbies/hobby_gaming_1787487377877.jpg';
import imgFashion from '../assets/hobbies/hobby_fashion_1787487394290.jpg';
import imgWoodworking from '../assets/hobbies/hobby_woodworking_1787487410811.jpg';
import imgCycling from '../assets/hobbies/hobby_cycling_1787487427933.jpg';
import imgAstronomy from '../assets/hobbies/hobby_astronomy_1787487444421.jpg';
import imgCalligraphy from '../assets/hobbies/hobby_calligraphy_1787487461997.jpg';
import imgSkateboarding from '../assets/hobbies/hobby_skateboarding_1787487479158.jpg';

// Import generated 16:9 header illustrations for communities
import commPhotoImg from '../assets/communities/comm_street_photo_1786874778448.jpg';
import commAcousticImg from '../assets/communities/comm_acoustic_1786874991573.jpg';
import commRunningImg from '../assets/communities/comm_running_1786875006787.jpg';
import commCinemaImg from '../assets/communities/comm_cinema_1786875039282.jpg';
import commBookNookImg from '../assets/communities/book_nook.png';
import commBoulderingImg from '../assets/communities/bouldering.png';
import commHomeBakersImg from '../assets/communities/home_bakers.png';
import commUrbanSketchersImg from '../assets/communities/urban_sketchers.png';

// Import generated illustrations for vibes
import vibeChillImg from '../assets/vibes/vibe_chill.svg';
import vibeCreativeImg from '../assets/vibes/vibe_creative.svg';
import vibeSocialImg from '../assets/vibes/vibe_social.svg';
import vibeActiveImg from '../assets/vibes/vibe_active.svg';
import vibeLearnImg from '../assets/vibes/vibe_learn.svg';
import vibeOutdoorsImg from '../assets/vibes/vibe_outdoors.svg';

// ─────────────────────────────────────────────────────
// HELPER SVG COMPONENTS FOR DECORATIVE DOODLES & ICONS
// ─────────────────────────────────────────────────────
const DBubble = ({ size = 18 }) => <MessageCircle size={size} />;
const DPlane = ({ size = 18, color = "currentColor", className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
  </svg>
);
const DTrophy = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H18V12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12V9Z" />
    <path d="M6 9H3V11C3 12.6569 4.34315 14 6 14" />
    <path d="M18 9H21V11C21 12.6569 19.6569 14 18 14" />
    <path d="M12 18V22" />
    <path d="M8 22H16" />
  </svg>
);

const VIBES = [
  {
    id: 'chill',
    label: 'Chill',
    emoji: '☀️',
    color: '#FFD43B',
    bgLight: '#FFF8D0',
    bgDark: '#2B250E',
    image: vibeChillImg,
    description: 'Slow-paced, cozy, relaxing vibes',
    hobbies: ['photography', 'writing', 'gardening', 'cooking']
  },
  {
    id: 'creative',
    label: 'Creative',
    emoji: '🎨',
    color: '#FF72B6',
    bgLight: '#FFE8F3',
    bgDark: '#2C1021',
    image: vibeCreativeImg,
    description: 'Express yourself through art & music',
    hobbies: ['photography', 'guitar', 'drawing', 'film']
  },
  {
    id: 'social',
    label: 'Social',
    emoji: '🎵',
    color: '#9B72FF',
    bgLight: '#EDE8FF',
    bgDark: '#1E1633',
    image: vibeSocialImg,
    description: 'Meet fellow enthusiasts and connect',
    hobbies: ['guitar', 'film', 'photography', 'dance']
  },
  {
    id: 'active',
    label: 'Active',
    emoji: '🏃',
    color: '#FF914D',
    bgLight: '#FFE8D6',
    bgDark: '#2B1B10',
    image: vibeActiveImg,
    description: 'Get moving, sweat, and energize',
    hobbies: ['running', 'cycling', 'dance', 'bouldering']
  },
  {
    id: 'learn',
    label: 'Learn',
    emoji: '🧠',
    color: '#4D7CFE',
    bgLight: '#EBF3FF',
    bgDark: '#101E35',
    image: vibeLearnImg,
    description: 'Expand your mind, skills & ideas',
    hobbies: ['ai-ml', 'writing', 'chess', 'astronomy']
  },
  {
    id: 'outdoors',
    label: 'Outdoors',
    emoji: '🌿',
    color: '#5BCB77',
    bgLight: '#EFFCF4',
    bgDark: '#102B1B',
    image: vibeOutdoorsImg,
    description: 'Fresh air, nature, and adventure',
    hobbies: ['running', 'cycling', 'gardening', 'photography']
  }
];

// FULL HOBBY DATA WITH UNIQUE PASTEL LIGHT AND DARK MODE COLORS & GENERATED STICKER IMAGES
const ALL_HOBBIES_DATA = [
  { id: 'photography', name: 'Photography', count: '1.2K people', bgLight: '#FFF0ED', bgDark: '#2D1612', img: imgPhoto, description: 'Capturing moments, light & streets' },
  { id: 'guitar',      name: 'Guitar',      count: '987 people',  bgLight: '#FFFCEB', bgDark: '#2B250E', img: imgGuitar, description: 'Chords, fingerpicking & jam sessions' },
  { id: 'pottery',     name: 'Pottery',     count: '654 people',  bgLight: '#FFF4EB', bgDark: '#2C1B10', img: imgPottery, description: 'Wheel throwing & ceramic sculptures' },
  { id: 'running',     name: 'Running',     count: '1.8K people', bgLight: '#EFFCF4', bgDark: '#102B1B', img: imgRunning, description: 'Morning 5Ks, trails & marathon goals' },
  { id: 'film',        name: 'Film',        count: '1.1K people', bgLight: '#F3EFFF', bgDark: '#1E1633', img: imgFilm, description: 'Cinema discussions & 35mm shooting' },
  { id: 'ai-ml',       name: 'AI & ML',     count: '2.3K people', bgLight: '#EBF3FF', bgDark: '#101E35', img: imgAiml, description: 'Building neural nets & creative tech' },
  { id: 'drawing',     name: 'Drawing',     count: '1.4K people', bgLight: '#FFF7E6', bgDark: '#2B220C', img: imgDrawing, description: 'Sketching, ink, comics & watercolors' },
  { id: 'cooking',     name: 'Cooking',     count: '1.6K people', bgLight: '#FFF0F0', bgDark: '#2D1212', img: imgCooking, description: 'Baking sourdough, pastas & pastries' },
  { id: 'writing',     name: 'Writing',     count: '890 people',  bgLight: '#FFF0F7', bgDark: '#2C1021', img: imgWriting, description: 'Poetry, fiction & personal essays' },
  { id: 'bouldering',  name: 'Bouldering',  count: '740 people',  bgLight: '#FFF4EB', bgDark: '#2C1B10', img: imgBouldering, description: 'Problem solving on rock faces' },
  { id: 'dance',       name: 'Dance',       count: '1.2K people', bgLight: '#FFEBF3', bgDark: '#2C1021', img: imgDance, description: 'Hip-hop, contemporary & choreo' },
  { id: 'chess',       name: 'Chess',       count: '1.5K people', bgLight: '#F4F4EE', bgDark: '#202020', img: imgChess, description: 'Tactics, openings & friendly matches' },
  { id: 'gardening',   name: 'Gardening',   count: '620 people',  bgLight: '#EFFCF4', bgDark: '#102B1B', img: imgGardening, description: 'Urban balcons, plants & flowers' },
  { id: 'gaming',      name: 'Gaming',      count: '3.1K people', bgLight: '#F3EFFF', bgDark: '#1E1633', img: imgGaming, description: 'Co-op indie adventures & tournaments' },
  { id: 'fashion',     name: 'Fashion',     count: '950 people',  bgLight: '#FFEBF3', bgDark: '#2C1021', img: imgFashion, description: 'Thrifting, styling & upcycling' },
  { id: 'woodworking', name: 'Woodworking', count: '480 people',  bgLight: '#FAF0E6', bgDark: '#2A180E', img: imgWoodworking, description: 'Crafting wooden goods by hand' },
  { id: 'cycling',     name: 'Cycling',     count: '1.3K people', bgLight: '#EFFCF4', bgDark: '#102B1B', img: imgCycling, description: 'Weekend road rides & city cruising' },
  { id: 'astronomy',   name: 'Astronomy',   count: '710 people',  bgLight: '#EBF3FF', bgDark: '#101E35', img: imgAstronomy, description: 'Stargazing, telescopes & cosmology' },
  { id: 'calligraphy', name: 'Calligraphy', count: '540 people',  bgLight: '#FFFCEB', bgDark: '#2B250E', img: imgCalligraphy, description: 'Hand-lettering & ink typography' },
  { id: 'skateboarding', name: 'Skateboarding', count: '1.1K people', bgLight: '#FFF0ED', bgDark: '#2D1612', img: imgSkateboarding, description: 'Street skating & park tricks' },
];

// Rich Community Cards Data with Generated Header Images
const RICH_COMMUNITIES = [
  {
    id: 'street-photography',
    name: 'Street Photography',
    peopleCount: '142 people',
    postCount: '89 posts',
    bgColor: '#FFF0ED',
    image: commPhotoImg,
    avatars: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=80&q=80'
    ]
  },
  {
    id: 'acoustic-sessions',
    name: 'Acoustic Sessions',
    peopleCount: '87 people',
    postCount: '41 posts',
    bgColor: '#FFFCEB',
    image: commAcousticImg,
    avatars: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1494790108755-2616b612b5c4?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80'
    ]
  },
  {
    id: 'couch-to-5k',
    name: 'Couch to 5K',
    peopleCount: '234 people',
    postCount: '167 posts',
    bgColor: '#EFFCF4',
    image: commRunningImg,
    avatars: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80'
    ]
  },
  {
    id: 'cinema-club',
    name: 'Cinema Club',
    peopleCount: '176 people',
    postCount: '134 posts',
    bgColor: '#F3EFFF',
    image: commCinemaImg,
    avatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=80&q=80'
    ]
  },
  {
    id: 'book-nook',
    name: 'Book Nook',
    peopleCount: '96 people',
    postCount: '52 posts',
    bgColor: '#FFF5EE',
    image: commBookNookImg,
    avatars: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b5c4?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80'
    ]
  },
  {
    id: 'bouldering-crew',
    name: 'Bouldering Crew',
    peopleCount: '124 people',
    postCount: '78 posts',
    bgColor: '#FFFCEB',
    image: commBoulderingImg,
    avatars: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80'
    ]
  },
  {
    id: 'home-bakers',
    name: 'Home Bakers',
    peopleCount: '189 people',
    postCount: '112 posts',
    bgColor: '#FFF0ED',
    image: commHomeBakersImg,
    avatars: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b5c4?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'
    ]
  },
  {
    id: 'urban-sketchers',
    name: 'Urban Sketchers',
    peopleCount: '215 people',
    postCount: '143 posts',
    bgColor: '#F3EFFF',
    image: commUrbanSketchersImg,
    avatars: [
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80'
    ]
  }
];

function RenderHobbyIllustration({ hobby }) {
  if (hobby.img) {
    return <img src={hobby.img} alt={hobby.name} className="g-hobby-ref-img" />;
  }
  return <span className="g-hobby-emoji-fallback">{hobby.emoji || '✨'}</span>;
}

function RenderCommunityHeaderImage({ community }) {
  if (community.image) {
    return <img src={community.image} alt={community.name} className="g-comm-header-img" />;
  }
  return null;
}

function CuteStickyNote({ title, text, variant = 'yellow', rotate = '-2deg', style }) {
  return (
    <div className={`g-cute-note g-cute-note--${variant}`} style={{ transform: `rotate(${rotate})`, ...style }}>
      <div className="g-cute-note__pin">📌</div>
      <p className="g-cute-note__title font-rounded">{title}</p>
      <p className="g-cute-note__text">{text}</p>
    </div>
  );
}

function GroundSunflower({ showStem = true, size = 180, className = '' }) {
  const svgRef = useRef(null);
  const [blink, setBlink] = useState(false);

  const rawPupilX = useMotionValue(0);
  const rawPupilY = useMotionValue(0);
  const pupilX = useSpring(rawPupilX, { stiffness: 150, damping: 20 });
  const pupilY = useSpring(rawPupilY, { stiffness: 150, damping: 20 });

  const handleMouseMove = useCallback((e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const faceCX = rect.left + rect.width * 0.5;
    const faceCY = rect.top + rect.height * 0.45;

    const dx = e.clientX - faceCX;
    const dy = e.clientY - faceCY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 500;
    const EYE_RANGE = 7;

    if (dist > 0) {
      const t = Math.min(dist / maxDist, 1);
      rawPupilX.set((dx / dist) * t * EYE_RANGE);
      rawPupilY.set((dy / dist) * t * EYE_RANGE);
    }
  }, [rawPupilX, rawPupilY]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const blinkLoop = () => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
      const next = 3000 + Math.random() * 3000;
      return setTimeout(blinkLoop, next);
    };
    const id = setTimeout(blinkLoop, 2000);
    return () => clearTimeout(id);
  }, []);

  const VCX = 160, VCY = 150;

  return (
    <div
      className={`g-sf-wrap ${className}`}
      style={{ width: size, height: showStem ? Math.round(size * 1.5) : size, flexShrink: 0 }}
    >
      <motion.svg
        ref={svgRef}
        viewBox={showStem ? '20 10 280 370' : '20 10 280 280'}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="g-sf-svg"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
        aria-label="CommonGround sunflower mascot"
        role="img"
      >
        {showStem && (
          <>
            <path d="M160 345 Q148 300 158 220" stroke="#3D7C45" strokeWidth="11" strokeLinecap="round" />
            <path d="M158 300 Q94 278 108 248 Q146 264 158 300" fill="#5BCB77" stroke="#2D6035" strokeWidth="4.5" strokeLinejoin="round" />
            <path d="M159 268 Q224 248 213 218 Q175 234 159 268" fill="#5BCB77" stroke="#2D6035" strokeWidth="4.5" strokeLinejoin="round" />
          </>
        )}

        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const d = i % 2 === 0 ? 84 : 72;
          const px = VCX + d * Math.sin(rad);
          const py = VCY - d * Math.cos(rad);
          return (
            <ellipse key={deg} cx={px} cy={py}
              rx={i % 2 === 0 ? 27 : 21}
              ry={i % 2 === 0 ? 43 : 34}
              fill="#F9F5ED" stroke="#1A1A1A" strokeWidth="3.5"
              transform={`rotate(${deg}, ${px}, ${py})`}
            />
          );
        })}

        <circle cx={VCX} cy={VCY} r="60" fill="#F5C842" stroke="#1A1A1A" strokeWidth="4" />
        <circle cx={VCX} cy={VCY} r="48" fill="#E8B200" opacity="0.22" />

        <ellipse cx="142" cy="140" rx="12" ry="14" fill="white" stroke="#1A1A1A" strokeWidth="2" />
        <ellipse cx="178" cy="140" rx="12" ry="14" fill="white" stroke="#1A1A1A" strokeWidth="2" />

        <motion.ellipse cx="142" cy="140"
          rx={blink ? 9 : 7} ry={blink ? 2 : 9}
          fill="#1A1A1A" style={{ x: pupilX, y: pupilY }} />
        <motion.ellipse cx="178" cy="140"
          rx={blink ? 9 : 7} ry={blink ? 2 : 9}
          fill="#1A1A1A" style={{ x: pupilX, y: pupilY }} />

        {!blink && (
          <>
            <motion.circle cx="146" cy="135" r="3" fill="white" style={{ x: pupilX, y: pupilY }} />
            <motion.circle cx="182" cy="135" r="3" fill="white" style={{ x: pupilX, y: pupilY }} />
          </>
        )}

        <path d="M 140 165 Q 160 186 180 165" stroke="#1A1A1A" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <ellipse cx="128" cy="164" rx="11" ry="7" fill="#F47B7B" opacity="0.38" />
        <ellipse cx="192" cy="164" rx="11" ry="7" fill="#F47B7B" opacity="0.38" />
      </motion.svg>
    </div>
  );
}

function PottedPlant({ className, style }) {
  return (
    <svg viewBox="0 0 80 100" className={className} style={style} fill="none" aria-hidden="true">
      <path d="M28 68 L52 68 L47 92 L33 92 Z" fill="#FF914D" stroke="#111" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M22 60 L58 60 L58 68 L22 68 Z" fill="#FFD43B" stroke="#111" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M40 60 Q38 38 30 24" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M40 60 Q42 42 54 30" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M30 24 Q14 18 19 6 Q32 12 30 24" fill="#5BCB77" stroke="#111" strokeWidth="2" />
      <path d="M54 30 Q70 24 66 12 Q52 19 54 30" fill="#5BCB77" stroke="#111" strokeWidth="2" />
      <path d="M40 16 Q36 8 40 4 Q44 8 40 16" fill="#FF72B6" stroke="#111" strokeWidth="1.5" />
      <ellipse cx="18" cy="50" rx="4" ry="2.5" fill="#FF72B6" opacity="0.55" />
      <ellipse cx="62" cy="46" rx="4" ry="2.5" fill="#FF72B6" opacity="0.55" />
    </svg>
  );
}

const PEOPLE = [
  { id: 'p1', name: 'Meera Shah',      label: 'Photography Lover', bio: 'Photography lover & visual storyteller', interests: ['Photography', 'Film', 'Drawing'],    location: 'Mumbai',    communities: 4, posts: ['Just captured golden hour at Marine Drive 🌅', 'Film photography is a whole different vibe.'],            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', accent: '#FFF3D4' },
  { id: 'p2', name: 'Kabir Singh',    label: 'Guitarist',          bio: 'Guitarist & acoustic session host',       interests: ['Guitar', 'Music', 'Songwriting'],    location: 'Delhi',     communities: 3, posts: ['Teaching myself fingerpicking this week 🎸', 'Acoustic session on Saturday — who is coming?'],          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', accent: '#E0EFFF' },
  { id: 'p3', name: 'Tanya Mehta',    label: 'Sketch Artist',      bio: 'Sketch artist & charcoal enthusiast',    interests: ['Drawing', 'Illustration', 'Pottery'], location: 'Pune',      communities: 5, posts: ['Working on a charcoal portrait series ✏️', 'Sketching at the park — the best therapy.'],            avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80', accent: '#FFE6F4' },
  { id: 'p4', name: 'Arjun Verma',    label: 'Runner',             bio: 'Runner & fitness enthusiast',            interests: ['Running', 'Fitness', 'Yoga'],          location: 'Bangalore', communities: 2, posts: ['Hit a new personal best this morning! 🏃', 'Morning runs are underrated. 5 AM energy.'],              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', accent: '#E0F7EC' },
  { id: 'p5', name: 'Priya Rajan',    label: 'Book Lover',         bio: 'Book lover & creative writer',           interests: ['Reading', 'Writing', 'Poetry'],        location: 'Chennai',   communities: 6, posts: ['Just finished "The God of Small Things" 📚', 'Writing short stories between study breaks.'],          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c4?auto=format&fit=crop&w=150&q=80', accent: '#EDE8FF' },
  { id: 'p6', name: 'Rohan Das',      label: 'Hobby Chef',         bio: 'Foodie & hobby chef',                    interests: ['Cooking', 'Baking', 'Travel'],         location: 'Kolkata',   communities: 3, posts: ['Made homemade pasta for the first time! 🍝', 'Food is the best way to connect with people.'],          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', accent: '#FFF8E5' },
  { id: 'p7', name: 'Sneha Kulkarni', label: 'Ceramics Maker',     bio: 'Pottery & ceramics maker',               interests: ['Pottery', 'Ceramics', 'Art'],          location: 'Ahmedabad', communities: 4, posts: ['Made my first bowl on the wheel today! 🏺', 'There is something meditative about clay.'],               avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', accent: '#E0F7EC' },
  { id: 'p8', name: 'Aarav Mehta',    label: 'AI & ML Explorer',   bio: 'AI & ML explorer',                       interests: ['AI & ML', 'Coding', 'Chess'],          location: 'Hyderabad', communities: 7, posts: ['Building an image classifier as a side project 🤖', 'AI is not magic — it is a lot of linear algebra.'],  avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=150&q=80', accent: '#E0EFFF' },
];

function ProfileModal({ person, onClose, followed, onFollow }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', fn);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      className="g-modal-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="g-modal"
        initial={{ opacity: 0, y: 60, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label={`${person.name}'s profile`}
      >
        <div className="g-modal__header-band" style={{ background: person.accent }} />
        <button className="g-modal__close" onClick={onClose} aria-label="Close"><X size={15} /></button>

        <div className="g-modal__top">
          <img src={person.avatar} alt={person.name} className="g-modal__avatar" />
          <div className="g-modal__identity">
            <h2 className="g-modal__name font-rounded">{person.name}</h2>
            <p className="g-modal__label">{person.label}</p>
            <p className="g-modal__bio">{person.bio}</p>
            <div className="g-modal__loc"><MapPin size={11} /><span>{person.location}</span></div>
          </div>
        </div>

        <div className="g-modal__stats">
          {[{ n: person.communities, l: 'Communities' }, { n: person.posts.length, l: 'Posts' }, { n: person.interests.length, l: 'Interests' }].map(({ n, l }, i) => (
            <div key={l} className="g-modal__stat-item">
              {i > 0 && <div className="g-modal__stat-sep" />}
              <div className="g-modal__stat">
                <span className="g-modal__stat-n font-rounded">{n}</span>
                <span className="g-modal__stat-l">{l}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="g-modal__section">
          <h3 className="g-modal__section-title font-rounded">Interests</h3>
          <div className="g-modal__tags">
            {person.interests.map(t => <span key={t} className="g-modal__tag">{t}</span>)}
          </div>
        </div>

        <div className="g-modal__section">
          <h3 className="g-modal__section-title font-rounded">Recent posts</h3>
          {person.posts.map((p, i) => (
            <div key={i} className="g-modal__post">
              <Sparkles size={12} style={{ color: '#FF72B6', flexShrink: 0, marginTop: 3 }} />
              <span>{p}</span>
            </div>
          ))}
        </div>

        <button
          className={`g-modal__follow font-rounded ${followed ? 'g-modal__follow--active' : ''}`}
          onClick={() => onFollow(person.id)}
        >
          <Users size={14} />
          {followed ? 'Connected ✓' : 'Connect'}
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function Ground({ initialTab }) {
  const navigate = useNavigate();
  const location = useLocation();

  const defaultTab = initialTab || (
    location.pathname === '/explore' || location.search.includes('tab=discover') ? 'discover' : 'ground'
  );

  const [activeTab, setActiveTab]                     = useState(defaultTab);
  const [followed, setFollowed]                       = useState({});
  const [liked, setLiked]                             = useState({});
  const [bookmarked, setBookmarked]                   = useState({});
  const [likes, setLikes]                             = useState({ p1: 128, p2: 87, p3: 64, p4: 95, p5: 154, p6: 110 });
  const [discLiked, setDiscLiked]                     = useState({});
  const [discLikes, setDiscLikes]                     = useState({ p1: 18, p2: 24, p3: 31, p4: 42, p5: 27, p6: 36, p7: 15, p8: 12 });
  const [joinedCommunities, setJoinedCommunities]     = useState({});
  
  const [showAllHobbies, setShowAllHobbies]           = useState(false);
  const [showAllCommunities, setShowAllCommunities]   = useState(false);
  const [selectedVibe, setSelectedVibe]               = useState(null);
  const [showAllPosts, setShowAllPosts]               = useState(false);
  const [showAllPeople, setShowAllPeople]             = useState(false);
  
  const [previewPerson, setPreviewPerson]             = useState(null);
  const [searchQuery, setSearchQuery]                 = useState('');
  const [activeCategory, setActiveCategory]           = useState('All');
  const [surpriseSpin, setSurpriseSpin]               = useState(false);

  const trendingRef = useRef(null);
  const hobbiesRef  = useRef(null);
  const vibeRef     = useRef(null);

  // Dynamic user interests from localStorage with rich curated fallback
  const userInterests = useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('cg-interests') || '[]');
      const mapped = stored.map(id => getHobbyById(id)).filter(Boolean);
      if (mapped.length > 0) return mapped;
    } catch {
      // fallback
    }
    const defaultIds = ['photography', 'guitar', 'drawing', 'cooking', 'astronomy', 'bouldering'];
    return defaultIds.map(id => getHobbyById(id)).filter(Boolean);
  }, []);

  const hasInterests = userInterests.length > 0;

  // Compute dynamic personalized discussions matching selected interests
  const personalizedDiscussions = useMemo(() => {
    const list = [];
    userInterests.forEach(hobby => {
      list.push(...getPostsByInterest(hobby.id));
    });
    const pool = list.length > 0 ? list : defaultPosts;
    const unique = [];
    const seen = new Set();
    for (const p of pool) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        unique.push(p);
      }
    }
    if (unique.length < 4) {
      for (const p of defaultPosts) {
        if (!seen.has(p.id)) {
          seen.add(p.id);
          unique.push(p);
        }
      }
    }
    return unique.slice(0, 6);
  }, [userInterests]);

  const toggleDiscLike = (id) => {
    setDiscLiked(prev => {
      const next = !prev[id];
      setDiscLikes(cur => ({ ...cur, [id]: next ? (cur[id] || 0) + 1 : (cur[id] || 1) - 1 }));
      return { ...prev, [id]: next };
    });
  };

  // Suggested unpicked hobbies for user
  const suggestions = useMemo(() => {
    const ids = new Set(userInterests.map(h => h.id));
    return hobbies.filter(h => !ids.has(h.id)).slice(0, 6);
  }, [userInterests]);

  // Display items for interest shelf: selected hobbies + recommended to always fill grid gracefully
  const displayShelfItems = useMemo(() => {
    const selectedIds = new Set(userInterests.map(h => h.id));
    const items = userInterests.map(h => ({ ...h, isUserSelected: true }));
    if (items.length < 5) {
      const needed = 5 - items.length;
      const recs = hobbies.filter(h => !selectedIds.has(h.id)).slice(0, needed);
      recs.forEach(h => {
        items.push({ ...h, isUserSelected: false });
      });
    }
    return items;
  }, [userInterests]);

  // Map hobby images for AccordionGallery — real photographic images of people engaged in each hobby
  const HOBBY_IMAGES = {
    photography: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80',
    guitar: 'https://tse1.mm.bing.net/th/id/OIP.Er4GdXe4rKz6eOZ9_jwqqAHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    pottery: 'https://th.bing.com/th/id/OIP.m0hkLeKnpTZbdDyTZRCXtQHaE7?w=277&h=185&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    running: 'https://th.bing.com/th/id/OIP.0OMUeUBy8T23DYb2obsoTAHaEK?w=239&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    film: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    'ai-ml': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    drawing: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
    cooking: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
    writing: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    bouldering: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&w=800&q=80',
    dance: 'https://th.bing.com/th/id/OIP.p04t-NRA0PJ4SBXUG1Dd9wHaEJ?w=303&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    chess: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80',
    gardening: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80',
    gaming: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    fashion: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    woodworking: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    cycling: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    astronomy: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    calligraphy: 'https://images.unsplash.com/photo-1583321500900-82807e458f3c?auto=format&fit=crop&w=800&q=80',
    skateboarding: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&w=800&q=80',
  };

  const FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
  ];

  const accordionItems = useMemo(() => {
    return displayShelfItems.slice(0, 6).map((hobby, i) => ({
      image: HOBBY_IMAGES[hobby.id] || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
      label: `${hobby.emoji} ${hobby.name}`,
      alt: hobby.name,
    }));
  }, [displayShelfItems]);

  useEffect(() => {
    if (location.pathname === '/explore' || location.search.includes('tab=discover')) {
      setActiveTab('discover');
    } else if (location.pathname === '/ground' && !location.search.includes('tab=discover')) {
      setActiveTab('ground');
    }
  }, [location.pathname, location.search]);

  const toggleFollow   = (id) => setFollowed(p => ({ ...p, [id]: !p[id] }));
  const toggleBookmark = (id) => setBookmarked(p => ({ ...p, [id]: !p[id] }));
  const toggleJoinComm = (id) => setJoinedCommunities(p => ({ ...p, [id]: !p[id] }));
  const toggleLike     = (id) => {
    setLiked(prev => {
      const next = !prev[id];
      setLikes(cur => ({ ...cur, [id]: next ? (cur[id] || 0) + 1 : (cur[id] || 1) - 1 }));
      return { ...prev, [id]: next };
    });
  };

  const scrollToTrending = () => {
    if (activeTab !== 'discover') {
      setActiveTab('discover');
      setTimeout(() => {
        trendingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } else {
      trendingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToHobby = (hobbyId) => {
    const targetComm = communities.find(c => c.hobbyId === hobbyId);
    if (targetComm) {
      navigate(`/community/${targetComm.id}`);
    } else if (hobbiesRef.current) {
      hobbiesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredHobbies = useMemo(() => {
    let r = ALL_HOBBIES_DATA;
    if (activeCategory !== 'All') {
      const categoryMap = {
        'Creative': ['photography', 'drawing', 'writing', 'pottery', 'fashion', 'calligraphy'],
        'Music': ['guitar', 'dance'],
        'Fitness': ['running', 'bouldering', 'cycling'],
        'Tech': ['ai-ml', 'gaming'],
        'Lifestyle': ['cooking', 'gardening'],
        'Strategy': ['chess'],
        'Entertainment': ['film', 'astronomy'],
        'Sports': ['skateboarding', 'bouldering', 'running']
      };
      const allowedIds = categoryMap[activeCategory] || [];
      r = r.filter(h => allowedIds.includes(h.id));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      r = r.filter(h => h.name.toLowerCase().includes(q));
    }
    return r;
  }, [searchQuery, activeCategory]);

  const visiblePeople = showAllPeople ? PEOPLE : PEOPLE.slice(0, 4);
  const visibleCommunities = showAllCommunities ? RICH_COMMUNITIES : RICH_COMMUNITIES.slice(0, 5);

  const vibeRecommendations = useMemo(() => {
    if (!selectedVibe) return [];
    const current = VIBES.find(v => v.id === selectedVibe);
    if (!current) return [];
    return current.hobbies.map(hid => ALL_HOBBIES_DATA.find(h => h.id === hid)).filter(Boolean);
  }, [selectedVibe]);

  const handleSurpriseMe = () => {
    setSurpriseSpin(true);
    setTimeout(() => setSurpriseSpin(false), 700);
    const rh = ALL_HOBBIES_DATA[Math.floor(Math.random() * ALL_HOBBIES_DATA.length)];
    const comm = communities.find(c => c.hobbyId === rh.id) || communities[0];
    setTimeout(() => navigate(`/community/${comm.id}`), 350);
  };

  const POSTS = [
    { id: 'p1', cls: 'g-av--photo',    emoji: '🎮', community: 'Gaming Club', time: '2h ago',  text: "Where every game becomes a shared adventure.", img: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80', alt: 'Sunset cityscape',    comments: 24, shares: 12 },
    { id: 'p2', cls: 'g-av--acoustic', emoji: '🎸', community: 'Acoustic Sessions',        time: '4h ago',  text: 'Jam session this Saturday! Open for everyone 🎸 DM to join!',                               img: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1200&q=80', alt: 'Guitar players',      comments: 18, shares: 5  },
    { id: 'p3', cls: 'g-av--sketch',   emoji: '✏️', community: 'Sketch Squad',             time: '6h ago',  text: 'Quick sketch from class today ✏️',                                                         img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80', alt: 'Pencil sketch art',  comments: 11, shares: 3  },
  ];
  const EXTRA_POSTS = [
    { id: 'p4', cls: 'g-av--sketch',   emoji: '✏️', community: 'Sketch Squad',             time: '8h ago',  text: 'Experimenting with charcoal today! What do you think?',                                    img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80', alt: 'Charcoal art',       comments: 14, shares: 8  },
    { id: 'p5', cls: 'g-av--photo',    emoji: '📸', community: 'Street Photography Club', time: '10h ago', text: 'Every great story starts with a single frame.',                          img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80', alt: 'Rainy reflections',  comments: 32, shares: 21 },
    { id: 'p6', cls: 'g-av--acoustic', emoji: '🎸', community: 'Acoustic Sessions',        time: '12h ago', text: 'Folk music nights are back! Wednesday 7 PM in the common hall.',                          img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80', alt: 'Folk music night',   comments: 20, shares: 15 },
  ];

  const PostCard = ({ post, delay = 0 }) => (
    <motion.article
      className="g-post"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, boxShadow: '0 10px 28px rgba(0,0,0,0.07)' }}
      layout
    >
      <div className="g-post__header">
        <div className="g-post__author">
          <div className={`g-post__avbox ${post.cls}`}>{post.emoji}</div>
          <div>
            <h3 className="g-post__community font-rounded">{post.community}</h3>
            <span className="g-post__time">{post.time}</span>
          </div>
        </div>
        <button className="g-post__more" aria-label="More options"><MoreHorizontal size={16} /></button>
      </div>
      <p className="g-post__text">{post.text}</p>
      <div className="g-post__img-wrap">
        <img src={post.img} alt={post.alt} className="g-post__img" loading="lazy" />
      </div>
      <div className="g-post__actions">
        <div className="g-post__action-row">
          <button
            className={`g-act-btn ${liked[post.id] ? 'g-act-btn--liked' : ''}`}
            onClick={() => toggleLike(post.id)}
            aria-label={`Like — ${likes[post.id] ?? 0}`}
          >
            <Heart size={14} fill={liked[post.id] ? 'var(--red)' : 'none'} />
            <span>{likes[post.id] ?? 0}</span>
          </button>
          <button className="g-act-btn" aria-label={`Comment — ${post.comments}`}>
            <MessageCircle size={14} /><span>{post.comments}</span>
          </button>
          <button className="g-act-btn" aria-label={`Share — ${post.shares}`}>
            <Share2 size={14} /><span>{post.shares}</span>
          </button>
        </div>
        <button
          className={`g-bookmark-btn ${bookmarked[post.id] ? 'g-bookmark-btn--on' : ''}`}
          onClick={() => toggleBookmark(post.id)}
          aria-label="Bookmark"
        >
          <Bookmark size={14} fill={bookmarked[post.id] ? 'var(--text)' : 'none'} />
        </button>
      </div>
    </motion.article>
  );

  return (
    <PageCanvas>
      <KineticCheckerboard />
      <div className="g-checker-bg" aria-hidden="true" />

      <div className="ground">
        {/* ══ HEADER ══════════════════════════════════ */}
        <header className="g-header">
          <div className="g-header__brand">
            <span className="g-header__logo font-rounded">CommonGround</span>
            <Heart size={14} fill="#FF72B6" style={{ animation: 'g-pulse 2s ease-in-out infinite' }} />
          </div>

          <div className="g-header__center">
            <div className="g-toggle-pill">
              <button
                className={`g-toggle-btn ${activeTab === 'ground' ? 'g-toggle-btn--on' : ''}`}
                onClick={() => setActiveTab('ground')}
              >Your Ground</button>
              <button
                className={`g-toggle-btn ${activeTab === 'discover' ? 'g-toggle-btn--on' : ''}`}
                onClick={() => setActiveTab('discover')}
              >Discover</button>
            </div>
          </div>

          <div className="g-header__actions">
            <button
              className="g-icon-btn"
              aria-label="Search"
              onClick={() => { setActiveTab('discover'); setTimeout(() => document.getElementById('g-search')?.focus(), 150); }}
            >
              <Search size={18} />
            </button>
            <button className="g-icon-btn" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="My profile"
              className="g-header__avatar"
              onClick={() => navigate('/profile')}
            />
          </div>
        </header>

        {/* ══ VIEW SWITCHER ════════════════════════════ */}
        <AnimatePresence mode="wait">
          {activeTab === 'ground' ? (
            /* ─── YOUR GROUND VIEW ─────────────────── */
            <motion.div
              key="ground"
              className="g-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Floating ambient doodles */}
              <Sparkles size={16} style={{ position:'absolute', top: 120, left:'-0.6%', color:'#FFD43B', opacity:0.6, animation:'g-float 5.5s ease-in-out infinite', pointerEvents:'none' }} />
              <Camera   size={16} style={{ position:'absolute', top: 320, right:'-0.6%', color:'#4D7CFE', opacity:0.4, animation:'g-float 7s ease-in-out infinite 1.4s', pointerEvents:'none' }} />
              <Music    size={16} style={{ position:'absolute', bottom:'50%', left:'-0.4%', color:'#FF72B6', opacity:0.38, animation:'g-float 6s ease-in-out infinite 0.7s', pointerEvents:'none' }} />

              {/* HERO ROW */}
              <div className="g-hero">
                <div className="g-greeting">
                  <svg className="g-greeting__trail" viewBox="0 0 120 60" fill="none" aria-hidden="true">
                    <path d="M10 50 Q 50 -10 110 30" stroke="#FFD43B" strokeWidth="2.5" strokeDasharray="5 5" strokeLinecap="round" />
                  </svg>

                  <div className="g-greeting__text">
                    <h1 className="g-greeting__title font-rounded">
                      {hasInterests ? 'Good morning, Explorer! ☀️' : 'Welcome to CommonGround! ☀️'}
                    </h1>
                    <p className="g-greeting__sub">
                      {hasInterests
                        ? `${userInterests.length} interest${userInterests.length !== 1 ? 's' : ''} · Let's make today meaningful.`
                        : "Discover hobbies and build your personalized space."
                      }
                    </p>
                  </div>

                  <GroundSunflower showStem size={120} className="g-greeting__sf" />
                </div>

                <div className="g-inspiration">
                  <div className="g-inspiration__body">
                    <p className="g-inspiration__quote font-rounded">"Small conversations can lead to big connections."</p>
                  </div>
                  <div className="g-inspiration__plant">
                    <PottedPlant className="g-plant-svg" />
                  </div>
                </div>
              </div>

              {/* ══ USER SELECTED INTERESTS HUB ══════════════════ */}
              <section className="g-interests-hub-section">
                <div className="g-sec-hdr" style={{ marginBottom: 14 }}>
                  <div>
                    <h2 className="g-sec-title font-rounded">
                      Your selected interests <span className="g-title-spark">🌟</span>
                    </h2>
                    <p className="g-sec-subtitle text-muted">
                      Your personalized ground is tailored around these passions
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <button
                      className="g-edit-interests-btn font-rounded"
                      onClick={() => navigate('/discover')}
                      title="Discover more hobbies"
                    >
                      <Plus size={14} />
                      <span>Discover More</span>
                    </button>
                  </div>
                </div>

                <AccordionGallery
                  items={accordionItems}
                  defaultIndex={1}
                  expandRatio={0.48}
                  trigger="hover"
                  height={380}
                  gap={8}
                  radius={20}
                  accentColor="#FFD43B"
                  overlayColor="#111111"
                  textColor="#ffffff"
                  grayscale={true}
                  showLabels={true}
                  duration={0.5}
                  tilt={6}
                  parallax={0.4}
                />
              </section>

              {/* CUTE STICKY NOTE DOODLES */}
              <div className="g-notes-row">
                <CuteStickyNote title="Weekly Goal 🎯" text="Try 1 new hobby walk or meetup this weekend!" variant="yellow" rotate="-1.5deg" />
                <CuteStickyNote title="Quote of the day 🌿" text="Creation is a muscle. Practice daily." variant="pink" rotate="1.5deg" />
                <CuteStickyNote title="Campus Buzz ⚡" text="18 students active in bouldering & creative hobbies today!" variant="blue" rotate="-1deg" />
              </div>

              {/* 2-COLUMN MAIN */}
              <div className="g-cols">
                <div className="g-feed-col">
                  <div className="g-sec-hdr">
                    <h2 className="g-sec-title font-rounded">Your community posts ✨</h2>
                    <button className="g-see-all" onClick={() => setShowAllPosts(p => !p)}>
                      {showAllPosts ? 'Show less ↑' : 'See all →'}
                    </button>
                  </div>

                  <div className="g-posts-list">
                    {POSTS.map((p, i) => <PostCard key={p.id} post={p} delay={i * 0.06} />)}

                    <AnimatePresence>
                      {showAllPosts && (
                        <motion.div
                          className="g-posts-extra"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                        >
                          {EXTRA_POSTS.map((p, i) => <PostCard key={p.id} post={p} delay={i * 0.07} />)}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      className="g-load-more font-rounded"
                      onClick={() => setShowAllPosts(p => !p)}
                    >
                      {showAllPosts ? '↑ Show less' : 'See all community posts →'}
                    </button>
                  </div>
                </div>

                <div className="g-side-col">
                  <h2 className="g-sec-title font-rounded" style={{ marginBottom: 14 }}>
                    What's happening 🌟
                  </h2>
                  <div className="g-happenings">
                    {[
                      { bg: 'g-hap--green',  icon: <DBubble  size={18} />, title: 'New conversations waiting for you', sub: 'Jump into discussions that matter.' },
                      { bg: 'g-hap--purple', icon: <DPlane   size={18} color="var(--text)" />,  title: 'Your community activity', sub: "See what's new in your communities." },
                      { bg: 'g-hap--yellow', icon: <DTrophy  size={18} />, title: "Your streak is looking good!", sub: "Keep going, you're doing amazing." },
                    ].map(({ bg, icon, title, sub }) => (
                      <motion.div
                        key={title}
                        className={`g-hap ${bg}`}
                        onClick={() => setActiveTab('discover')}
                        whileHover={{ x: 4, transition: { type: 'spring', stiffness: 400 } }}
                      >
                        <div className="g-hap__inner">
                          <div className="g-hap__icon">{icon}</div>
                          <div>
                            <p className="g-hap__title font-rounded">{title}</p>
                            <p className="g-hap__sub">{sub}</p>
                          </div>
                        </div>
                        <ArrowRight size={14} className="g-hap__arrow" />
                      </motion.div>
                    ))}
                  </div>

                  <div style={{ marginTop: 20 }}>
                    <CuteStickyNote title="Did you know? 💡" text="Most friendships start by sharing a simple interest." variant="green" rotate="-1.5deg" />
                  </div>
                </div>
              </div>

              {/* ══ 3D DISCUSSIONS AROUND YOUR INTERESTS ══════════ */}
              {personalizedDiscussions.length > 0 && (
                <section className="g-discussions-section">
                  <div className="g-sec-hdr" style={{ marginBottom: 16 }}>
                    <div>
                      <h2 className="g-sec-title font-rounded">
                        Discussions around your interests <span className="g-title-spark">💬</span>
                      </h2>
                      <p className="g-sec-subtitle text-muted">
                        Real questions, project updates, and sparks from campus peers
                      </p>
                    </div>
                    <button
                      className="g-start-disc-btn font-rounded"
                      onClick={() => navigate('/create')}
                    >
                      <Plus size={14} />
                      <span>Start discussion</span>
                    </button>
                  </div>

                  <div className="g-disc-3d-grid">
                    {personalizedDiscussions.map((post, i) => {
                      const author = users.find(u => u.id === post.authorId) || { name: 'Explorer', bio: '' };
                      const hobbyId = post.interests?.[0];
                      const hobbyObj = getHobbyById(hobbyId) || { name: 'Interest', emoji: '✨', color: '#FF72B6' };
                      const isLiked = discLiked[post.id];
                      const likeCount = discLikes[post.id] ?? (post.replyCount * 2 + 3);

                      return (
                        <motion.article
                          key={post.id}
                          className="g-disc-3d-card"
                          style={{
                            '--card-accent': hobbyObj.color || '#FF72B6',
                          }}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.08 + i * 0.05, duration: 0.3 }}
                          whileHover={{ y: -6, x: -3 }}
                          onClick={() => {
                            const targetComm = communities.find(c => c.id === post.communityId || c.hobbyId === hobbyId);
                            if (targetComm) navigate(`/community/${targetComm.id}`);
                          }}
                        >
                          <div className="g-disc-card__top">
                            <div className="g-disc-author">
                              <div
                                className="g-disc-author__avatar font-rounded"
                                style={{
                                  backgroundColor: hobbyObj.color ? `${hobbyObj.color}22` : 'rgba(255,114,182,0.15)',
                                  borderColor: hobbyObj.color || 'var(--border-light)'
                                }}
                              >
                                {hobbyObj.emoji || '🌱'}
                              </div>
                              <div>
                                <span className="g-disc-author__name font-rounded">{author.name}</span>
                                <span className="g-disc-author__time">2h ago</span>
                              </div>
                            </div>

                            <span className="g-disc-type-pill font-rounded">
                              {post.type === 'question' ? '💡 Question' : post.type === 'project' ? '🎨 Project' : '💬 Discussion'}
                            </span>
                          </div>

                          <h3 className="g-disc-card__title font-rounded">{post.title}</h3>
                          {post.body && (
                            <p className="g-disc-card__snippet">{post.body}</p>
                          )}

                          <div className="g-disc-card__tags">
                            <span className="g-disc-hobby-pill font-rounded">
                              {hobbyObj.emoji} {hobbyObj.name}
                            </span>
                            {post.tags?.slice(0, 2).map(tag => (
                              <span key={tag} className="g-disc-subtag font-rounded">#{tag}</span>
                            ))}
                          </div>

                          <div className="g-disc-card__footer" onClick={e => e.stopPropagation()}>
                            <div className="g-disc-card__actions">
                              <button
                                className={`g-disc-action-btn ${isLiked ? 'g-disc-action-btn--liked' : ''}`}
                                onClick={() => toggleDiscLike(post.id)}
                                aria-label="Upvote discussion"
                              >
                                <Heart size={14} fill={isLiked ? 'var(--red)' : 'none'} />
                                <span>{likeCount}</span>
                              </button>

                              <div className="g-disc-replies font-rounded">
                                <MessageCircle size={14} />
                                <span>{post.replyCount || 0} replies</span>
                              </div>
                            </div>

                            <button
                              className="g-disc-join-btn font-rounded"
                              onClick={() => {
                                const targetComm = communities.find(c => c.id === post.communityId || c.hobbyId === hobbyId);
                                if (targetComm) navigate(`/community/${targetComm.id}`);
                              }}
                            >
                              <span>Join in</span>
                              <ArrowRight size={13} />
                            </button>
                          </div>
                        </motion.article>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* PEOPLE YOU MAY LIKE */}
              <section className="g-people-sec">
                <div className="g-sec-hdr">
                  <h2 className="g-sec-title font-rounded">People you may like 💛</h2>
                  <button className="g-see-all" onClick={() => setShowAllPeople(p => !p)}>
                    {showAllPeople ? 'Show less ↑' : 'See all →'}
                  </button>
                </div>
                <motion.div className="g-people-grid" layout>
                  <AnimatePresence>
                    {visiblePeople.map((person, i) => (
                      <motion.div
                        key={person.id}
                        className="g-person-card"
                        initial={{ opacity: 0, scale: 0.93 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: i * 0.045, duration: 0.24 }}
                        whileHover={{ y: -4, boxShadow: '0 10px 28px rgba(0,0,0,0.09)' }}
                      >
                        <div className="g-person-card__band" style={{ background: person.accent }} />
                        <img src={person.avatar} alt={person.name} className="g-person-card__avatar" />
                        <p className="g-person-card__name font-rounded">{person.name}</p>
                        <p className="g-person-card__label">{person.label}</p>
                        <div className="g-person-card__pills">
                          {person.interests.slice(0, 2).map(t => (
                            <span key={t} className="g-tag-pill">{t}</span>
                          ))}
                        </div>
                        <button
                          className="g-view-btn font-rounded"
                          onClick={() => setPreviewPerson(person)}
                        >
                          View Profile
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </section>

              {/* FINAL CTA */}
              <section className="g-cta">
                <div className="g-cta__plane" aria-hidden="true">
                  <DPlane size={48} color="var(--purple)" className="g-cta-plane-anim" />
                </div>
                <div className="g-cta__content">
                  <h2 className="g-cta__title font-rounded">Start something new today!</h2>
                  <p className="g-cta__sub">
                    Explore communities, join conversations, and make connections that matter.
                  </p>
                  <Button variant="primary" onClick={() => setActiveTab('discover')}>
                    Explore Communities →
                  </Button>
                </div>
                <div className="g-cta__sf" aria-hidden="true">
                  <GroundSunflower showStem size={95} />
                </div>
              </section>
            </motion.div>

          ) : (

            /* ─── DISCOVER VIEW ────────────────────── */
            <motion.div
              key="discover"
              className="g-discover"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Floating ambient doodles */}
              <Sparkles size={18} style={{ position:'absolute', top: 20, right: '4%', color: '#FF72B6', opacity: 0.7, animation: 'g-float 4s ease-in-out infinite', pointerEvents: 'none' }} />
              <PenTool size={18} style={{ position:'absolute', top: 380, left: '-0.5%', color: '#9B72FF', opacity: 0.5, animation: 'g-float 6s ease-in-out infinite 1s', pointerEvents: 'none' }} />
              <BookOpen size={18} style={{ position:'absolute', top: 820, right: '-0.5%', color: '#5BCB77', opacity: 0.5, animation: 'g-float 5s ease-in-out infinite 0.5s', pointerEvents: 'none' }} />

              {/* QUIZ BANNER */}
              <div className="g-quiz-banner">
                <div className="g-quiz-banner__body">
                  <h2 className="g-quiz-banner__title font-rounded">Not sure what to explore?</h2>
                  <p className="g-quiz-banner__sub">Take our 30-sec quiz to find hobbies you'll actually love.</p>
                  <button className="g-quiz-btn font-rounded" onClick={() => navigate('/onboarding')}>
                    Take the Quiz →
                  </button>
                </div>
                <GroundSunflower showStem size={85} className="g-quiz-banner__sf" />
              </div>

              {/* SEARCH */}
              <div className="g-search-box">
                <Search size={18} className="g-search-icon" aria-hidden="true" />
                <input
                  id="g-search"
                  type="text"
                  className="g-search-input font-rounded"
                  placeholder="Search hobbies, communities, people…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {/* CATEGORY PILLS */}
              <div className="g-pills" role="group" aria-label="Filter by category">
                <button
                  className={`g-pill font-rounded ${activeCategory === 'All' ? 'g-pill--on' : ''}`}
                  onClick={() => setActiveCategory('All')}
                >All</button>
                {hobbyCategories.map(cat => (
                  <button
                    key={cat}
                    className={`g-pill font-rounded ${activeCategory === cat ? 'g-pill--on' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >{cat}</button>
                ))}
              </div>

              {/* FIND YOUR COMMUNITY HERO */}
              <div className="g-community-banner">
                <div className="g-community-banner__body">
                  <h2 className="g-community-banner__title font-rounded">
                    FIND YOUR<br />
                    <span className="g-community-banner__accent">COMMUNITY.</span>
                  </h2>
                  <p className="g-community-banner__sub">
                    Discover hobbies, join communities, and connect with people who share your vibe.
                  </p>
                  <button
                    className="g-community-btn font-rounded"
                    onClick={scrollToTrending}
                  >
                    Explore communities →
                  </button>
                </div>
                <div className="g-community-banner__illo">
                  <svg className="g-community-trail" viewBox="0 0 200 120" fill="none" aria-hidden="true">
                    <path d="M10 100 Q 80 10 190 60" stroke="#FFD43B" strokeWidth="2.5" strokeDasharray="6 6" strokeLinecap="round" />
                  </svg>
                  <DPlane size={30} color="var(--pink)" className="g-disc-plane" />
                  <GroundSunflower showStem size={130} />
                </div>
              </div>

              {/* DISCOVER STICKY NOTE DOODLE */}
              <div className="g-notes-row" style={{ margin: '0' }}>
                <CuteStickyNote title="Discover Tips 💡" text="Click any hobby tile below to jump into its active community!" variant="blue" rotate="1.2deg" />
              </div>

              {/* 1. ALL HOBBIES SECTION */}
              <section ref={hobbiesRef}>
                <div className="g-sec-hdr" style={{ marginBottom: 16 }}>
                  <h2 className="g-sec-title font-rounded">
                    All Hobbies <span className="g-count">({filteredHobbies.length})</span>
                  </h2>
                  <button
                    className="g-see-all"
                    onClick={() => setShowAllHobbies(p => !p)}
                  >
                    {showAllHobbies ? 'Show less ↑' : 'See all →'}
                  </button>
                </div>

                <div className="g-hobbies-ref-grid">
                  {(showAllHobbies || searchQuery || activeCategory !== 'All' ? filteredHobbies : filteredHobbies.slice(0, 8)).map((h, i) => (
                    <motion.div
                      key={h.id}
                      className="g-hobby-ref-card"
                      style={{
                        '--hobby-bg-light': h.bgLight,
                        '--hobby-bg-dark': h.bgDark
                      }}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.025, duration: 0.25 }}
                      whileHover={{ y: -6, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => scrollToHobby(h.id)}
                    >
                      <div className="g-hobby-ref-card__icon-wrap">
                        <RenderHobbyIllustration hobby={h} size={48} />
                      </div>
                      <h3 className="g-hobby-ref-card__title font-rounded">{h.name}</h3>
                      <span className="g-hobby-ref-card__count">{h.count}</span>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* SURPRISE BANNER */}
              <div className="g-surprise-banner">
                <div className="g-surp-blob g-surp-blob--pink" aria-hidden="true" />
                <div className="g-surp-blob g-surp-blob--green" aria-hidden="true" />
                <div className="g-surp-blob g-surp-blob--yellow" aria-hidden="true" />

                <div className="g-surp-doodles" aria-hidden="true">
                  <img src={imgPhoto} alt="" className="g-surp-sticker g-surp-sticker--a" />
                  <img src={imgGuitar} alt="" className="g-surp-sticker g-surp-sticker--b" />
                  <img src={imgCooking} alt="" className="g-surp-sticker g-surp-sticker--c" />
                  <img src={imgRunning} alt="" className="g-surp-sticker g-surp-sticker--d" />
                  <img src={imgDrawing} alt="" className="g-surp-sticker g-surp-sticker--e" />
                  <DPlane className="g-surp-plane" size={22} color="var(--blue)" />
                </div>

                <div className="g-surp-content">
                  <h2 className="g-surp-title font-rounded">
                    Something new<br />might be your thing ✨
                  </h2>
                  <p className="g-surp-sub">Keep exploring. You never know what you'll discover.</p>
                  <button
                    className={`g-surp-btn font-rounded ${surpriseSpin ? 'g-surp-btn--spin' : ''}`}
                    onClick={handleSurpriseMe}
                  >
                    <RefreshCw size={13} className="g-surp-btn-icon" />
                    Surprise me
                  </button>
                </div>
              </div>

              {/* 2. TRENDING COMMUNITIES */}
              <section ref={trendingRef} className="g-trending-section">
                <div className="g-sec-hdr" style={{ marginBottom: 16 }}>
                  <h2 className="g-sec-title font-rounded">Trending Communities 🔥</h2>
                  <button
                    className="g-see-all"
                    onClick={() => setShowAllCommunities(p => !p)}
                  >
                    {showAllCommunities ? 'Show less ↑' : 'See all →'}
                  </button>
                </div>

                <div className="g-trending-ref-grid">
                  {visibleCommunities.map((c, i) => (
                    <motion.div
                      key={c.id}
                      className="g-trending-ref-card"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.28 }}
                      whileHover={{ y: -5, scale: 1.012 }}
                      onClick={() => navigate(`/community/${c.id}`)}
                    >
                      <div className="g-trending-ref-card__img" style={{ backgroundColor: c.bgColor }}>
                        <RenderCommunityHeaderImage community={c} />
                      </div>

                      <div className="g-trending-ref-card__body">
                        <h3 className="g-trending-ref-card__title font-rounded">{c.name}</h3>
                        <p className="g-trending-ref-card__stats">{c.peopleCount} · {c.postCount}</p>

                        <div className="g-trending-ref-card__footer">
                          <div className="g-trending-ref-card__avatars">
                            {c.avatars.map((av, idx) => (
                              <img key={idx} src={av} alt="member" className="g-comm-avatar" style={{ zIndex: 3 - idx }} />
                            ))}
                          </div>

                          <button
                            className={`g-join-btn font-rounded ${joinedCommunities[c.id] ? 'g-join-btn--active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleJoinComm(c.id);
                            }}
                          >
                            {joinedCommunities[c.id] ? 'Joined ✓' : 'Join'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* 3. PICK YOUR VIBE ✨ */}
              <section ref={vibeRef} className="g-vibe-sec">
                <div className="g-sec-hdr" style={{ marginBottom: 6 }}>
                  <div>
                    <h2 className="g-sec-title font-rounded">Pick Your Vibe ✨</h2>
                    <p className="g-sec-sub">What are you in the mood for today?</p>
                  </div>
                  {selectedVibe && (
                    <button
                      className="g-vibe-clear-btn font-rounded"
                      onClick={() => setSelectedVibe(null)}
                    >
                      Reset vibe ✕
                    </button>
                  )}
                </div>

                <div className="g-vibe-grid">
                  {VIBES.map((vibe) => {
                    const isSelected = selectedVibe === vibe.id;
                    return (
                      <motion.button
                        key={vibe.id}
                        className={`g-vibe-card font-rounded ${isSelected ? 'g-vibe-card--selected' : ''}`}
                        style={{
                          '--vibe-accent': vibe.color,
                          '--vibe-bg-light': vibe.bgLight,
                          '--vibe-bg-dark': vibe.bgDark
                        }}
                        onClick={() => setSelectedVibe(isSelected ? null : vibe.id)}
                        whileHover={{ y: -4, scale: 1.025 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <div className="g-vibe-card__icon-wrap">
                          <img src={vibe.image} alt={vibe.label} className="g-vibe-img" />
                        </div>
                        <span className="g-vibe-card__label">{vibe.label}</span>
                        {isSelected && (
                          <motion.span
                            className="g-vibe-card__dot"
                            layoutId="vibeActiveDot"
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  {selectedVibe ? (
                    <motion.div
                      key={selectedVibe}
                      className="g-vibe-results"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="g-vibe-results__hdr">
                        <div className="g-vibe-results__badge font-rounded">
                          <span>Made for you today ✨</span>
                          <span className="g-vibe-badge-pill" style={{ background: VIBES.find(v => v.id === selectedVibe)?.bgLight, color: 'var(--text)' }}>
                            {VIBES.find(v => v.id === selectedVibe)?.emoji} {VIBES.find(v => v.id === selectedVibe)?.label}
                          </span>
                        </div>
                        <button
                          className="g-vibe-switch-btn font-rounded"
                          onClick={() => {
                            const currentIndex = VIBES.findIndex(v => v.id === selectedVibe);
                            const nextVibe = VIBES[(currentIndex + 1) % VIBES.length];
                            setSelectedVibe(nextVibe.id);
                          }}
                        >
                          Choose another vibe ↻
                        </button>
                      </div>

                      <div className="g-vibe-rec-grid">
                        {vibeRecommendations.map((h, idx) => (
                          <motion.div
                            key={h.id}
                            className="g-vibe-rec-card"
                            style={{
                              '--hobby-bg-light': h.bgLight,
                              '--hobby-bg-dark': h.bgDark
                            }}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05, duration: 0.28 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            onClick={() => scrollToHobby(h.id)}
                          >
                            <div className="g-vibe-rec-card__icon-wrap">
                              <RenderHobbyIllustration hobby={h} size={44} />
                            </div>
                            <div className="g-vibe-rec-card__content">
                              <h4 className="g-vibe-rec-card__title font-rounded">{h.name}</h4>
                              <p className="g-vibe-rec-card__desc">{h.description || h.count}</p>
                              <span className="g-vibe-rec-card__action font-rounded">
                                Explore →
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      className="g-vibe-idle-banner"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sparkles size={16} color="var(--pink)" />
                      <span>Select any vibe above to reveal curated hobbies and communities!</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {previewPerson && (
          <ProfileModal
            person={previewPerson}
            onClose={() => setPreviewPerson(null)}
            followed={followed[previewPerson.id]}
            onFollow={toggleFollow}
          />
        )}
      </AnimatePresence>
    </PageCanvas>
  );
}