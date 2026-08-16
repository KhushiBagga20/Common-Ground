import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Link as LinkIcon, Calendar, Edit3, Settings, Camera, Image, X } from 'lucide-react';
import Sunflower from '../common/Sunflower';
import Button from '../common/Button';

/* ── Preset cover gradients ─────────────────────────────────── */
const COVER_GRADIENTS = [
  { id: 'g1', value: 'linear-gradient(135deg, #FFBDDA 0%, #FFE8A3 100%)', label: 'Blush Sunrise' },
  { id: 'g2', value: 'linear-gradient(135deg, #FFE8A3 0%, #FFCCAA 100%)', label: 'Honey Peach' },
  { id: 'g3', value: 'linear-gradient(135deg, #FFBDDA 0%, #D9BBFF 100%)', label: 'Berry Bloom' },
  { id: 'g4', value: 'linear-gradient(135deg, #B8F0D0 0%, #A3C9FF 100%)', label: 'Meadow Sky' },
  { id: 'g5', value: 'linear-gradient(135deg, #A3C9FF 0%, #D9BBFF 100%)', label: 'Lavender Dusk' },
  { id: 'g6', value: 'linear-gradient(135deg, #FF8FAB 0%, #FFE8A3 100%)', label: 'Poppy Field' },
];

/* ── Tiny doodle SVG components ─────────────────────────────── */
function StarDoodle({ size = 14, color = '#FFD43B', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={style}>
      <path d="M12 2 L13.5 9 L20 9 L14.8 13.5 L16.8 20.5 L12 16.5 L7.2 20.5 L9.2 13.5 L4 9 L10.5 9 Z"
        fill={color} stroke="#191919" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function HeartDoodle({ size = 14, color = '#FFBDDA', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={style}>
      <path d="M12 21 C12 21 3 14 3 8 C3 5.2 5.2 3 8 3 C9.8 3 11.4 3.9 12 5 C12.6 3.9 14.2 3 16 3 C18.8 3 21 5.2 21 8 C21 14 12 21 12 21 Z"
        fill={color} stroke="#191919" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function SparkDoodle({ size = 18, color = '#FFD43B', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={style}>
      <line x1="12" y1="2" x2="12" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="18" x2="12" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="2" y1="12" x2="6" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="12" x2="22" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="4.9" y1="4.9" x2="7.8" y2="7.8" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="16.2" y1="16.2" x2="19.1" y2="19.1" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="19.1" y1="4.9" x2="16.2" y2="7.8" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="7.8" y1="16.2" x2="4.9" y2="19.1" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* Dotted curved trail connecting decorative elements */
function DottedTrail({ style = {}, color = 'rgba(255,255,255,0.55)' }) {
  return (
    <svg width="140" height="44" viewBox="0 0 140 44" fill="none" aria-hidden="true" style={style}>
      <path
        d="M4 38 Q30 8 70 22 Q100 36 136 10"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="4 7"
        fill="none"
      />
    </svg>
  );
}

/* Tiny hand-drawn daisy for banner */
function TinyDaisy({ size = 18, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={style}>
      <ellipse cx="12" cy="6" rx="2.5" ry="4" fill="#fff" stroke="#ddd" strokeWidth="0.8" />
      <ellipse cx="12" cy="18" rx="2.5" ry="4" fill="#fff" stroke="#ddd" strokeWidth="0.8" />
      <ellipse cx="6" cy="12" rx="4" ry="2.5" fill="#fff" stroke="#ddd" strokeWidth="0.8" />
      <ellipse cx="18" cy="12" rx="4" ry="2.5" fill="#fff" stroke="#ddd" strokeWidth="0.8" />
      <ellipse cx="7.8" cy="7.8" rx="2.5" ry="4" fill="#fff" stroke="#ddd" strokeWidth="0.8" transform="rotate(-45 7.8 7.8)" />
      <ellipse cx="16.2" cy="16.2" rx="2.5" ry="4" fill="#fff" stroke="#ddd" strokeWidth="0.8" transform="rotate(-45 16.2 16.2)" />
      <ellipse cx="16.2" cy="7.8" rx="2.5" ry="4" fill="#fff" stroke="#ddd" strokeWidth="0.8" transform="rotate(45 16.2 7.8)" />
      <ellipse cx="7.8" cy="16.2" rx="2.5" ry="4" fill="#fff" stroke="#ddd" strokeWidth="0.8" transform="rotate(45 7.8 16.2)" />
      <circle cx="12" cy="12" r="3.5" fill="#FFD43B" stroke="#c8a200" strokeWidth="0.8" />
    </svg>
  );
}

export default function ProfileHeader({ data, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: data.name,
    role: data.role,
    bio: data.bio,
    location: data.location,
    website: data.website,
  });

  /* ── PFP state ──────────────────────────────────────────────── */
  const [pfpSrc, setPfpSrc] = useState(null);
  const pfpInputRef = useRef(null);

  /* ── Cover state ─────────────────────────────────────────────── */
  const [coverStyle, setCoverStyle] = useState({
    type: 'gradient',
    value: 'linear-gradient(135deg, #FFBDDA 0%, #FFE8A3 100%)',
  });
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const coverInputRef = useRef(null);
  const coverBtnRef = useRef(null);
  const pickerRef = useRef(null);

  /* ── Close picker on outside click ──────────────────────────── */
  const handleOutsideClick = useCallback((e) => {
    if (
      pickerRef.current && !pickerRef.current.contains(e.target) &&
      coverBtnRef.current && !coverBtnRef.current.contains(e.target)
    ) {
      setShowCoverPicker(false);
    }
  }, []);

  useEffect(() => {
    if (showCoverPicker) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showCoverPicker, handleOutsideClick]);

  /* ── Handlers ────────────────────────────────────────────────── */
  const handlePfpClick = () => pfpInputRef.current?.click();

  const handlePfpChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPfpSrc(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleCoverGradient = (gradient) => {
    setCoverStyle({ type: 'gradient', value: gradient.value });
    setShowCoverPicker(false);
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverStyle({ type: 'image', value: URL.createObjectURL(file) });
    setShowCoverPicker(false);
    e.target.value = '';
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  /* ── Cover background style object ──────────────────────────── */
  const bannerStyle =
    coverStyle.type === 'image'
      ? { backgroundImage: `url(${coverStyle.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : { background: coverStyle.value };

  return (
    <div className="profile-header">

      {/* ── Banner ──────────────────────────────────────────────── */}
      <div className="profile-header__banner" style={bannerStyle}>

        {/* Sunflower cluster on banner */}
        <div className="profile-banner__deco" aria-hidden="true">
          {/* ── Visual story: sunflower → dotted trail → sparkle → flower/heart ── */}

          {/* Primary large sunflower – right side, partially below banner edge */}
          <Sunflower size={78} color="#FFD43B" animate={false} className="ph-flower ph-flower--lg-right" />

          {/* Secondary sunflower – upper right, smaller, lighter */}
          <Sunflower size={42} color="#FFF0A0" animate={false} className="ph-flower ph-flower--md-right" />

          {/* Small accent sunflower – far left, gentle presence */}
          <Sunflower size={30} color="#FFD43B" animate={false} className="ph-flower ph-flower--sm-left" />

          {/* Dotted curved trail from left region toward right sunflowers */}
          <DottedTrail
            color="rgba(255,255,255,0.5)"
            style={{ position: 'absolute', bottom: 28, left: 80 }}
          />

          {/* Sparkle at the end of the trail */}
          <SparkDoodle
            size={20}
            color="#fff"
            style={{ position: 'absolute', bottom: 14, right: 185, opacity: 0.9, filter: 'drop-shadow(0 0 3px rgba(255,220,0,0.6))' }}
          />

          {/* Small star near sparkle */}
          <StarDoodle size={13} color="#FFD43B" style={{ position: 'absolute', top: 16, right: 168, opacity: 0.95 }} />

          {/* Tiny daisy flower – part of the story */}
          <TinyDaisy size={20} style={{ position: 'absolute', bottom: 22, right: 148, opacity: 0.88 }} />

          {/* Heart doodle – charming endpoint of the visual trail */}
          <HeartDoodle size={15} color="#FFBDDA" style={{ position: 'absolute', top: 18, right: 230, opacity: 0.9 }} />

          {/* Tiny extra star doodle floating near top-left */}
          <StarDoodle size={10} color="#fff" style={{ position: 'absolute', top: 14, left: 72, opacity: 0.65 }} />

          {/* Soft sparkle on the left side */}
          <SparkDoodle size={13} color="rgba(255,255,255,0.7)" style={{ position: 'absolute', top: 40, left: 48, opacity: 0.55 }} />
        </div>

        {/* ── Change Cover button — anchored top-right of banner ── */}
        <div className="profile-banner__cover-actions">
          <motion.button
            ref={coverBtnRef}
            className="profile-banner__cover-btn"
            onClick={() => setShowCoverPicker(p => !p)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Change cover"
            aria-expanded={showCoverPicker}
          >
            <Image size={12} />
            Change Cover
          </motion.button>
        </div>
      </div>

      {/* ── Cover picker – rendered OUTSIDE the banner, below it ── */}
      <AnimatePresence>
        {showCoverPicker && (
          <motion.div
            ref={pickerRef}
            className="profile-cover-picker"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-label="Choose cover"
          >
            <div className="profile-cover-picker__header">
              <span className="profile-cover-picker__label">Choose a cover</span>
              <button
                className="profile-cover-picker__close"
                onClick={() => setShowCoverPicker(false)}
                aria-label="Close cover picker"
              >
                <X size={13} />
              </button>
            </div>
            <div className="profile-cover-picker__swatches">
              {COVER_GRADIENTS.map((g) => (
                <motion.button
                  key={g.id}
                  className={`profile-cover-picker__swatch ${coverStyle.value === g.value ? 'profile-cover-picker__swatch--active' : ''}`}
                  style={{ background: g.value }}
                  onClick={() => handleCoverGradient(g)}
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.95 }}
                  title={g.label}
                />
              ))}
            </div>
            <div className="profile-cover-picker__divider" />
            <button
              className="profile-cover-picker__upload-btn"
              onClick={() => coverInputRef.current?.click()}
            >
              <Camera size={13} />
              Upload photo
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleCoverUpload}
              aria-label="Upload cover photo"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Content area ─────────────────────────────────────────── */}
      <div className="profile-header__content">

        {/* Extra sunflower stickers around avatar + one behind avatar for depth */}
        <div className="profile-header__avatar-deco" aria-hidden="true">
          {/* Sunflower behind avatar (z-index lower than avatar) */}
          <Sunflower
            size={52}
            color="#FFD43B"
            animate={false}
            style={{
              position: 'absolute',
              bottom: -20,
              left: 72,
              opacity: 0.85,
              zIndex: 0,
              filter: 'drop-shadow(1px 2px 0 rgba(0,0,0,0.1))',
            }}
          />
          {/* Small accent sunflower beside avatar */}
          <Sunflower size={22} color="#FFF0A0" animate={false} className="ph-avatar-flower--b" />
          {/* Star sparkle above */}
          <StarDoodle size={13} color="#FFD43B" style={{ position: 'absolute', top: -8, left: 70, pointerEvents: 'none' }} />
          {/* Tiny heart beside */}
          <HeartDoodle size={11} color="#FFBDDA" style={{ position: 'absolute', top: 10, left: 95, pointerEvents: 'none' }} />
          {/* Extra tiny sparkle */}
          <SparkDoodle size={10} color="#FFD43B" style={{ position: 'absolute', top: -4, left: 104, pointerEvents: 'none', opacity: 0.7 }} />
        </div>

        {/* Avatar */}
        <div className="profile-header__avatar-container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            className="profile-header__avatar-wrapper"
            onClick={handlePfpClick}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            title="Change profile picture"
          >
            {pfpSrc ? (
              <img src={pfpSrc} alt="Profile" className="profile-header__avatar-img" />
            ) : (
              <Sunflower size={88} className="profile-header__avatar-flower" animate={true} />
            )}
            <div className="profile-header__avatar-overlay">
              <Camera size={18} />
            </div>
          </motion.div>

          <input
            ref={pfpInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePfpChange}
            aria-label="Upload profile picture"
          />
        </div>

        {/* Action Buttons */}
        <div className="profile-header__actions">
          {isEditing ? (
            <>
              <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsEditing(true)}
                icon={<Edit3 size={14} />}
                className="profile-header__edit-btn"
              >
                Edit Profile
              </Button>
              <motion.button
                className="profile-header__settings-btn"
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.3 }}
                aria-label="Settings"
              >
                <Settings size={18} />
              </motion.button>
            </>
          )}
        </div>

        {/* User Info */}
        <div className="profile-header__details">
          {isEditing ? (
            <div className="profile-header__edit-fields">
              <input
                type="text"
                className="profile-header__input font-bold"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Name"
              />
              <input
                type="text"
                className="profile-header__input"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Tagline / Role"
              />
              <textarea
                className="profile-header__textarea"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Bio"
                rows={3}
              />
              <div className="profile-header__edit-row">
                <input
                  type="text"
                  className="profile-header__input profile-header__input--half"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Location"
                />
                <input
                  type="text"
                  className="profile-header__input profile-header__input--half"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="Website"
                />
              </div>
            </div>
          ) : (
            <>
              <h1 className="profile-header__name">{data.name}</h1>
              <p className="profile-header__role">{data.role}</p>
              <p className="profile-header__bio">{data.bio}</p>

              <div className="profile-header__meta">
                {data.location && (
                  <span className="profile-header__meta-item">
                    <MapPin size={13} className="profile-header__meta-icon" />
                    {data.location}
                  </span>
                )}
                {data.website && (
                  <span className="profile-header__meta-item">
                    <LinkIcon size={13} className="profile-header__meta-icon" />
                    <a
                      href={`https://${data.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="profile-header__website"
                    >
                      {data.website}
                    </a>
                  </span>
                )}
                <span className="profile-header__meta-item">
                  <Calendar size={13} className="profile-header__meta-icon" />
                  {data.joined}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
