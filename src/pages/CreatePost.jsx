import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Send, Image, BarChart2, CalendarDays, Link2,
  Bold, Italic, List, Quote, Code2, ChevronDown, Globe, Settings2,
  Plus, X, Trash2, ExternalLink,
} from 'lucide-react';
import PageCanvas from '../components/layout/PageCanvas';
import InterestTag from '../components/common/InterestTag';
import Smiley from '../components/common/Smiley';
import KineticCheckerboard from '../components/common/KineticCheckerboard';
import { hobbies } from '../data/hobbies';
import { profileData } from '../data/profileData';
import { staggerContainer, staggerItem } from '../animations/variants';
import './CreatePost.css';

/* ── Constants ────────────────────────────────────────────────── */
const POST_TYPES = [
  { id: 'discussion', label: 'Discussion', emoji: '💬' },
  { id: 'question',   label: 'Question',   emoji: '❓' },
  { id: 'idea',       label: 'Idea',       emoji: '💡' },
  { id: 'project',    label: 'Project',    emoji: '🚀' },
];

const TOOL_BUTTONS = [
  { id: 'photo',  label: 'Photo / Video', icon: Image,        color: '#FFE8F0', border: '#FFBDCF', iconColor: '#C4003A' },
  { id: 'poll',   label: 'Poll',          icon: BarChart2,    color: '#FFF8CC', border: '#F0D95A', iconColor: '#7A5F00' },
  { id: 'event',  label: 'Event',         icon: CalendarDays, color: '#E0FAF0', border: '#A0E8C8', iconColor: '#0A5C3A' },
  { id: 'link',   label: 'Link',          icon: Link2,        color: '#F0EAFF', border: '#C9AEFF', iconColor: '#5900B3' },
];

const TITLE_MAX = 200;
const BODY_MAX  = 1000;

/* ── Markdown renderer (plain-text → formatted spans) ─────────── */
function renderMarkdown(text) {
  if (!text) return null;
  // Split by newlines to handle line-level syntax
  const lines = text.split('\n');
  return lines.map((line, li) => {
    // Bullet list
    if (line.startsWith('- ')) {
      const content = line.slice(2);
      return <li key={li} style={{ marginLeft: '1.2em', listStyleType: 'disc' }}>{inlineMarkdown(content)}</li>;
    }
    // Blockquote
    if (line.startsWith('> ')) {
      const content = line.slice(2);
      return (
        <blockquote key={li} style={{
          borderLeft: '3px solid var(--pink)', paddingLeft: '10px',
          color: 'var(--muted)', margin: '2px 0', fontStyle: 'italic', fontSize: '0.92em'
        }}>
          {inlineMarkdown(content)}
        </blockquote>
      );
    }
    if (line === '') return <br key={li} />;
    return <span key={li} style={{ display: 'block' }}>{inlineMarkdown(line)}</span>;
  });
}

function inlineMarkdown(text) {
  // Process **bold**, *italic*, `code` inline
  const parts = [];
  // Regex: matches **bold**, *italic*, `code` in order
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let last = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[0].startsWith('**')) {
      parts.push(<strong key={key++}>{match[2]}</strong>);
    } else if (match[0].startsWith('*')) {
      parts.push(<em key={key++}>{match[3]}</em>);
    } else if (match[0].startsWith('`')) {
      parts.push(
        <code key={key++} style={{
          background: 'var(--bg)', border: '1px solid var(--border-light)',
          borderRadius: '3px', padding: '0 4px', fontFamily: 'monospace', fontSize: '0.9em'
        }}>{match[4]}</code>
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length > 0 ? parts : text;
}

/* ── Main component ───────────────────────────────────────────── */
export default function CreatePost() {
  const navigate = useNavigate();
  const bodyRef  = useRef(null);
  const fileRef  = useRef(null);

  // Core post state
  const [postType,          setPostType]          = useState('discussion');
  const [title,             setTitle]             = useState('');
  const [body,              setBody]              = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [customTags,        setCustomTags]        = useState([]);
  const [showCustomInput,   setShowCustomInput]   = useState(false);
  const [customInput,       setCustomInput]       = useState('');
  const [submitted,         setSubmitted]         = useState(false);

  // Active tool panel: null | 'photo' | 'poll' | 'event' | 'link'
  const [activeTool, setActiveTool] = useState(null);

  // Photo / Video
  const [mediaFile,    setMediaFile]    = useState(null); // { dataUrl, name, type }

  // Poll
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions,  setPollOptions]  = useState(['', '']);

  // Event
  const [eventName,   setEventName]   = useState('');
  const [eventDate,   setEventDate]   = useState('');
  const [eventTime,   setEventTime]   = useState('');
  const [eventLoc,    setEventLoc]    = useState('');
  const [eventDesc,   setEventDesc]   = useState('');

  // Link
  const [linkUrl,     setLinkUrl]     = useState('');
  const [linkError,   setLinkError]   = useState('');

  /* ── Tool toggle ──────────────────────────────────────────── */
  const toggleTool = (id) => {
    setActiveTool(prev => prev === id ? null : id);
  };

  /* ── Interest helpers ─────────────────────────────────────── */
  const toggleInterest = (hobbyId) => {
    setSelectedInterests(prev =>
      prev.includes(hobbyId) ? prev.filter(id => id !== hobbyId) : [...prev, hobbyId]
    );
  };

  const addCustomTag = () => {
    const tag = customInput.trim();
    if (tag && !customTags.includes(tag)) {
      setCustomTags(prev => [...prev, tag]);
      setSelectedInterests(prev => [...prev, `custom:${tag}`]);
    }
    setCustomInput('');
    setShowCustomInput(false);
  };

  const removeCustomTag = (tag) => {
    setCustomTags(prev => prev.filter(t => t !== tag));
    setSelectedInterests(prev => prev.filter(id => id !== `custom:${tag}`));
  };

  /* ── Formatting ───────────────────────────────────────────── */
  const insertFormat = (syntax) => {
    const el = bodyRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end   = el.selectionEnd;
    const sel   = body.slice(start, end);
    let inserted = '';
    switch (syntax) {
      case 'bold':   inserted = `**${sel || 'bold text'}**`;       break;
      case 'italic': inserted = `*${sel || 'italic text'}*`;       break;
      case 'list':   inserted = `\n- ${sel || 'list item'}`;       break;
      case 'quote':  inserted = `\n> ${sel || 'quoted text'}`;     break;
      case 'code':   inserted = `\`${sel || 'code'}\``;            break;
      default: return;
    }
    const next = body.slice(0, start) + inserted + body.slice(end);
    setBody(next);
    setTimeout(() => {
      el.focus();
      const cursor = start + inserted.length;
      el.setSelectionRange(cursor, cursor);
    }, 0);
  };

  /* ── Photo / Video ────────────────────────────────────────── */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setMediaFile({ dataUrl: ev.target.result, name: file.name, type: file.type });
    };
    reader.readAsDataURL(file);
    // Reset file input so same file can be re-selected
    e.target.value = '';
  };

  /* ── Poll helpers ─────────────────────────────────────────── */
  const updatePollOption = (idx, val) => {
    setPollOptions(prev => prev.map((o, i) => i === idx ? val : o));
  };
  const addPollOption = () => {
    if (pollOptions.length < 6) setPollOptions(prev => [...prev, '']);
  };
  const removePollOption = (idx) => {
    if (pollOptions.length > 2) setPollOptions(prev => prev.filter((_, i) => i !== idx));
  };

  /* ── Link validation ──────────────────────────────────────── */
  const validateAndSetLink = (val) => {
    setLinkUrl(val);
    if (!val) { setLinkError(''); return; }
    try {
      new URL(val.startsWith('http') ? val : `https://${val}`);
      setLinkError('');
    } catch {
      setLinkError('Please enter a valid URL.');
    }
  };

  const normaliseLink = (val) => {
    if (!val) return '';
    return val.startsWith('http') ? val : `https://${val}`;
  };

  /* ── Build attachment objects for storage ─────────────────── */
  const buildAttachments = () => {
    const att = {};
    if (mediaFile) att.media = mediaFile;
    if (activeTool === 'poll' && pollQuestion.trim() && pollOptions.filter(o => o.trim()).length >= 2) {
      att.poll = { question: pollQuestion.trim(), options: pollOptions.filter(o => o.trim()) };
    }
    if (activeTool === 'event' && eventName.trim()) {
      att.event = {
        name: eventName.trim(), date: eventDate, time: eventTime,
        location: eventLoc.trim(), description: eventDesc.trim(),
      };
    }
    if (activeTool === 'link' && linkUrl.trim() && !linkError) {
      att.link = normaliseLink(linkUrl.trim());
    }
    return att;
  };

  /* ── Submit ───────────────────────────────────────────────── */
  const handleSubmit = () => {
    const interestNames = selectedInterests
      .map(id => id.startsWith('custom:') ? id.replace('custom:', '') : hobbies.find(h => h.id === id)?.name)
      .filter(Boolean);

    const firstHobby    = hobbies.find(h => h.id === selectedInterests[0]);
    const communityName = firstHobby ? firstHobby.name : customTags[0] || 'General';

    const savedProfile = localStorage.getItem('cg-profile');
    let currentProfile = profileData;
    if (savedProfile) {
      try { currentProfile = JSON.parse(savedProfile); } catch { /* keep default */ }
    }

    const newActivity = {
      id:          Date.now(),
      userCreated: true,          // sentinel: this post can be deleted
      type:        postType,
      community:   communityName,
      title:       title,
      body:        body,
      interests:   interestNames,
      timestamp:   'Just now',
      replies:     0,
      createdAt:   new Date().toISOString(),
      ...buildAttachments(),
    };

    localStorage.setItem('cg-profile', JSON.stringify({
      ...currentProfile,
      activities: [newActivity, ...currentProfile.activities],
    }));

    setSubmitted(true);
    setTimeout(() => navigate('/ground'), 2000);
  };

  const canSubmit = title.trim().length > 0 && selectedInterests.length > 0;

  /* ── Success screen ───────────────────────────────────────── */
  if (submitted) {
    return (
      <PageCanvas>
        <KineticCheckerboard />
        <motion.div
          className="create-post__success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <Smiley size={56} mood="happy" />
          <h2>Posted!</h2>
          <p className="text-muted">Your post is now live. Taking you back to Ground…</p>
        </motion.div>
      </PageCanvas>
    );
  }

  /* ── Preview data ─────────────────────────────────────────── */
  const previewType    = POST_TYPES.find(t => t.id === postType);
  const previewTagList = selectedInterests.slice(0, 3).map(id =>
    id.startsWith('custom:') ? id.replace('custom:', '') : hobbies.find(h => h.id === id)?.name
  ).filter(Boolean);

  const att = buildAttachments();

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <PageCanvas maxWidth="1200px">
      <KineticCheckerboard />

      {/* Page doodles */}
      <div className="cp-page-doodles" aria-hidden="true">
        <span className="cp-doodle cp-doodle--star-tl">✦</span>
        <span className="cp-doodle cp-doodle--heart-tl">♡</span>
        <svg className="cp-doodle cp-doodle--sunflower-tr" width="52" height="72" viewBox="0 0 52 72" fill="none">
          <circle cx="26" cy="22" r="9" fill="#FFD43B" stroke="#191919" strokeWidth="1.5"/>
          <circle cx="26" cy="22" r="5" fill="#8B6300" stroke="#191919" strokeWidth="1"/>
          {[0,45,90,135,180,225,270,315].map((deg, i) => (
            <ellipse key={i} cx="26" cy="22" rx="5" ry="10"
              transform={`rotate(${deg} 26 22)`}
              fill="#FFD43B" stroke="#191919" strokeWidth="1" opacity="0.85"/>
          ))}
          <path d="M26 32 Q20 48 28 68" stroke="#5BCB77" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 4" fill="none"/>
        </svg>
        <span className="cp-doodle cp-doodle--star-tr">★</span>
        <span className="cp-doodle cp-doodle--heart-bl">♡</span>
        <svg className="cp-doodle cp-doodle--arrow-bl" width="48" height="36" viewBox="0 0 48 36" fill="none">
          <path d="M4 18 Q20 4 40 18" stroke="#191919" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 4" fill="none"/>
          <path d="M34 12 L40 18 L34 24" stroke="#191919" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        <span className="cp-doodle cp-doodle--sparkle-br">✦</span>
        <svg className="cp-doodle cp-doodle--sunflower-br" width="40" height="56" viewBox="0 0 40 56" fill="none">
          <circle cx="20" cy="16" r="7" fill="#FF72B6" stroke="#191919" strokeWidth="1.5"/>
          <circle cx="20" cy="16" r="4" fill="#C4003A" stroke="#191919" strokeWidth="1"/>
          {[0,60,120,180,240,300].map((deg, i) => (
            <ellipse key={i} cx="20" cy="16" rx="3.5" ry="8"
              transform={`rotate(${deg} 20 16)`}
              fill="#FF72B6" stroke="#191919" strokeWidth="1" opacity="0.9"/>
          ))}
          <path d="M20 24 Q15 38 22 54" stroke="#5BCB77" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 4" fill="none"/>
        </svg>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Two-column grid */}
      <motion.div className="cp-two-col" variants={staggerContainer} initial="initial" animate="animate">

        {/* ══════════════════════════════════════════════════════
            LEFT — Create a post
        ══════════════════════════════════════════════════════ */}
        <motion.div className="cp-left-card" variants={staggerItem}>
          <div className="cp-left-accent" />

          <motion.button className="cp-back-btn" onClick={() => navigate(-1)} whileHover={{ x: -3 }}>
            <ArrowLeft size={16} /><span>Back</span>
          </motion.button>

          <div className="cp-heading-block">
            <h1 className="cp-heading">Create a post ✨</h1>
            <p className="cp-subheading">Share your thoughts, ideas or projects with the community! 💗</p>
          </div>

          {/* Post type */}
          <div className="cp-type-row">
            {POST_TYPES.map(type => (
              <button
                key={type.id}
                className={`cp-type-btn cp-type-btn--${type.id} ${postType === type.id ? 'cp-type-btn--active' : ''}`}
                onClick={() => setPostType(type.id)}
              >
                <span>{type.emoji}</span><span>{type.label}</span>
              </button>
            ))}
          </div>

          {/* Title */}
          <div className="cp-field">
            <input
              type="text"
              className="cp-input"
              placeholder="What's on your mind?"
              value={title}
              maxLength={TITLE_MAX}
              onChange={e => setTitle(e.target.value)}
            />
            <span className="cp-char-count">{title.length} / {TITLE_MAX}</span>
          </div>

          {/* Body */}
          <div className="cp-field">
            <textarea
              ref={bodyRef}
              className="cp-textarea"
              placeholder="Share more details... (supports **bold**, *italic*, `code`, > quote, - list)"
              rows={6}
              value={body}
              maxLength={BODY_MAX}
              onChange={e => setBody(e.target.value)}
            />
            <span className="cp-char-count">{body.length} / {BODY_MAX}</span>
          </div>

          {/* ── Media preview (in left card) ─────────────────── */}
          <AnimatePresence>
            {mediaFile && (
              <motion.div
                className="cp-media-preview"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {mediaFile.type.startsWith('video/') ? (
                  <video src={mediaFile.dataUrl} controls className="cp-media-preview__el" />
                ) : (
                  <img src={mediaFile.dataUrl} alt="Attached media" className="cp-media-preview__el" />
                )}
                <button
                  className="cp-media-preview__remove"
                  onClick={() => setMediaFile(null)}
                  title="Remove media"
                >
                  <X size={14} /> Remove
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Poll editor (inline) ──────────────────────────── */}
          <AnimatePresence>
            {activeTool === 'poll' && (
              <motion.div
                className="cp-panel cp-panel--poll"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="cp-panel__header">
                  <span>📊 Poll</span>
                  <button className="cp-panel__close" onClick={() => setActiveTool(null)}><X size={14}/></button>
                </div>
                <input
                  className="cp-panel__input"
                  placeholder="Poll question…"
                  value={pollQuestion}
                  onChange={e => setPollQuestion(e.target.value)}
                />
                <div className="cp-poll-options">
                  {pollOptions.map((opt, idx) => (
                    <div key={idx} className="cp-poll-option">
                      <span className="cp-poll-option__num">{idx + 1}</span>
                      <input
                        className="cp-panel__input cp-panel__input--option"
                        placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={e => updatePollOption(idx, e.target.value)}
                      />
                      {pollOptions.length > 2 && (
                        <button className="cp-poll-option__remove" onClick={() => removePollOption(idx)}>
                          <X size={12}/>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {pollOptions.length < 6 && (
                  <button className="cp-panel__add-option" onClick={addPollOption}>
                    <Plus size={13}/> Add option
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Event editor (inline) ─────────────────────────── */}
          <AnimatePresence>
            {activeTool === 'event' && (
              <motion.div
                className="cp-panel cp-panel--event"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="cp-panel__header">
                  <span>📅 Event</span>
                  <button className="cp-panel__close" onClick={() => setActiveTool(null)}><X size={14}/></button>
                </div>
                <input className="cp-panel__input" placeholder="Event name *" value={eventName} onChange={e => setEventName(e.target.value)} />
                <div className="cp-panel__row">
                  <input className="cp-panel__input" type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} />
                  <input className="cp-panel__input" type="time" value={eventTime} onChange={e => setEventTime(e.target.value)} />
                </div>
                <input className="cp-panel__input" placeholder="Location" value={eventLoc} onChange={e => setEventLoc(e.target.value)} />
                <textarea className="cp-panel__input cp-panel__textarea" placeholder="Description (optional)" value={eventDesc} onChange={e => setEventDesc(e.target.value)} rows={2} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Link editor (inline) ──────────────────────────── */}
          <AnimatePresence>
            {activeTool === 'link' && (
              <motion.div
                className="cp-panel cp-panel--link"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="cp-panel__header">
                  <span>🔗 Link</span>
                  <button className="cp-panel__close" onClick={() => setActiveTool(null)}><X size={14}/></button>
                </div>
                <input
                  className={`cp-panel__input ${linkError ? 'cp-panel__input--error' : ''}`}
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={e => validateAndSetLink(e.target.value)}
                />
                {linkError && <span className="cp-panel__error">{linkError}</span>}
                {linkUrl && !linkError && (
                  <a
                    className="cp-panel__link-preview"
                    href={normaliseLink(linkUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={12} /> {normaliseLink(linkUrl)}
                  </a>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tag interests */}
          <div className="cp-field">
            <label className="cp-field-label">Tag interests</label>
            <div className="cp-interest-picker">
              {hobbies.slice(0, 14).map(hobby => (
                <InterestTag
                  key={hobby.id}
                  label={hobby.name}
                  emoji={hobby.emoji}
                  color={hobby.color}
                  size="sm"
                  selected={selectedInterests.includes(hobby.id)}
                  onClick={() => toggleInterest(hobby.id)}
                />
              ))}
              {customTags.map(tag => (
                <motion.span
                  key={tag}
                  className={`cp-custom-tag ${selectedInterests.includes(`custom:${tag}`) ? 'cp-custom-tag--selected' : ''}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {tag}
                  <button className="cp-custom-tag__remove" onClick={() => removeCustomTag(tag)} aria-label={`Remove ${tag}`}>
                    <X size={10} />
                  </button>
                </motion.span>
              ))}
              {showCustomInput ? (
                <motion.div className="cp-custom-input-wrap" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <input
                    className="cp-custom-input"
                    autoFocus
                    placeholder="Tag name…"
                    value={customInput}
                    maxLength={24}
                    onChange={e => setCustomInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') addCustomTag();
                      if (e.key === 'Escape') { setShowCustomInput(false); setCustomInput(''); }
                    }}
                  />
                  <button className="cp-custom-add-ok" onClick={addCustomTag}>Add</button>
                </motion.div>
              ) : (
                <button className="cp-add-custom-btn" onClick={() => setShowCustomInput(true)}>
                  <Plus size={13} /> Add custom
                </button>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="cp-actions">
            <motion.button
              className="cp-post-btn"
              onClick={handleSubmit}
              disabled={!canSubmit}
              whileHover={canSubmit ? { scale: 1.03, y: -1 } : {}}
              whileTap={canSubmit ? { scale: 0.97 } : {}}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Send size={16} /> Post
            </motion.button>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════
            RIGHT — Post Editor
        ══════════════════════════════════════════════════════ */}
        <motion.div className="cp-right-card" variants={staggerItem}>
          <h2 className="cp-right-heading">Post Editor ✨</h2>

          {/* ── Section 1: Add to post ─────────────────────── */}
          <div className="cp-section">
            <p className="cp-section__title">Add to your post</p>
            <div className="cp-tool-grid">
              {TOOL_BUTTONS.map(btn => {
                const Icon = btn.icon;
                const isActive = activeTool === btn.id || (btn.id === 'photo' && mediaFile);
                return (
                  <motion.button
                    key={btn.id}
                    className={`cp-tool-btn ${isActive ? 'cp-tool-btn--active' : ''}`}
                    style={{ '--tool-bg': btn.color, '--tool-border': btn.border, '--tool-icon': btn.iconColor }}
                    onClick={() => {
                      if (btn.id === 'photo') {
                        fileRef.current?.click();
                      } else {
                        toggleTool(btn.id);
                      }
                    }}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <Icon size={18} style={{ color: isActive ? btn.iconColor : btn.iconColor }} />
                    <span>{btn.label}</span>
                    {isActive && btn.id !== 'photo' && <span className="cp-tool-btn__dot" />}
                    {btn.id === 'photo' && mediaFile && <span className="cp-tool-btn__dot" />}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* ── Section 2: Formatting ──────────────────────── */}
          <div className="cp-section">
            <p className="cp-section__title">Formatting</p>
            <div className="cp-fmt-row">
              {[
                { id: 'bold',   Icon: Bold,  title: 'Bold (**text**)' },
                { id: 'italic', Icon: Italic, title: 'Italic (*text*)' },
                { id: 'list',   Icon: List,  title: 'Bullet list (- item)' },
                { id: 'quote',  Icon: Quote, title: 'Quote (> text)' },
                { id: 'code',   Icon: Code2, title: 'Code (`code`)' },
              ].map(fmt => (
                <motion.button
                  key={fmt.id}
                  className={`cp-fmt-btn ${fmt.id === 'bold' ? 'cp-fmt-btn--bold' : ''} ${fmt.id === 'italic' ? 'cp-fmt-btn--italic' : ''}`}
                  title={fmt.title}
                  onClick={() => insertFormat(fmt.id)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                >
                  <fmt.Icon size={14} />
                </motion.button>
              ))}
            </div>
          </div>

          {/* ── Section 3: Post Preview ────────────────────── */}
          <div className="cp-section">
            <p className="cp-section__title">Post Preview</p>
            <div className="cp-preview">
              <div className="cp-preview__header">
                <span className={`cp-preview__type-badge cp-preview__type-badge--${postType}`}>
                  {previewType?.emoji} {previewType?.label}
                </span>
                <span className="cp-preview__time">Just now</span>
              </div>

              <p className="cp-preview__title">
                {title.trim() ? title : <span className="cp-preview__placeholder">Your title will appear here…</span>}
              </p>

              {body.trim() && (
                <div className="cp-preview__body cp-preview__body--rich">
                  {renderMarkdown(body.slice(0, 200))}
                  {body.length > 200 && <span style={{ color: 'var(--muted)' }}>…</span>}
                </div>
              )}

              {/* Media thumbnail in preview */}
              {mediaFile && (
                <div className="cp-preview__media">
                  {mediaFile.type.startsWith('video/') ? (
                    <div className="cp-preview__media-placeholder">🎬 {mediaFile.name}</div>
                  ) : (
                    <img src={mediaFile.dataUrl} alt="preview" className="cp-preview__media-img" />
                  )}
                </div>
              )}

              {/* Poll preview */}
              {att.poll && (
                <div className="cp-preview__poll">
                  <div className="cp-preview__poll-q">📊 {att.poll.question}</div>
                  {att.poll.options.map((o, i) => (
                    <div key={i} className="cp-preview__poll-opt">{o}</div>
                  ))}
                </div>
              )}

              {/* Event preview */}
              {att.event && (
                <div className="cp-preview__event">
                  <span>📅</span>
                  <div>
                    <div className="cp-preview__event-name">{att.event.name}</div>
                    {att.event.date && <div className="cp-preview__event-meta">{att.event.date}{att.event.time ? ` · ${att.event.time}` : ''}{att.event.location ? ` · ${att.event.location}` : ''}</div>}
                  </div>
                </div>
              )}

              {/* Link preview */}
              {att.link && (
                <a className="cp-preview__link" href={att.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={11} /> {att.link}
                </a>
              )}

              {previewTagList.length > 0 && (
                <div className="cp-preview__tags">
                  {previewTagList.map(t => (
                    <span key={t} className="cp-preview__tag">{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Section 4: Visibility ──────────────────────── */}
          <div className="cp-section">
            <p className="cp-section__title">Visibility</p>
            <button className="cp-dropdown-row">
              <div className="cp-dropdown-row__left">
                <Globe size={16} className="cp-dropdown-row__icon" />
                <div>
                  <span className="cp-dropdown-row__label">Everyone</span>
                  <span className="cp-dropdown-row__sub">Anyone on CommonGround</span>
                </div>
              </div>
              <ChevronDown size={16} className="cp-dropdown-row__chevron" />
            </button>
          </div>

          {/* ── Section 5: More options ────────────────────── */}
          <div className="cp-section cp-section--last">
            <button className="cp-dropdown-row">
              <div className="cp-dropdown-row__left">
                <Settings2 size={16} className="cp-dropdown-row__icon" />
                <div>
                  <span className="cp-dropdown-row__label">Advanced settings</span>
                </div>
              </div>
              <ChevronDown size={16} className="cp-dropdown-row__chevron" />
            </button>
          </div>
        </motion.div>

      </motion.div>
    </PageCanvas>
  );
}
