import { useState, useEffect } from 'react';
import { MessageSquare, Trash2, ExternalLink, CalendarDays, BarChart2 } from 'lucide-react';

/* ── Inline Markdown Renderer ─────────────────────────────────── */
function renderMarkdown(text) {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, li) => {
    if (line.startsWith('- ')) {
      const content = line.slice(2);
      return <li key={li} style={{ marginLeft: '1.2em', listStyleType: 'disc' }}>{inlineMarkdown(content)}</li>;
    }
    if (line.startsWith('> ')) {
      const content = line.slice(2);
      return (
        <blockquote key={li} style={{
          borderLeft: '3px solid var(--profile-pink)', paddingLeft: '10px',
          color: 'var(--muted)', margin: '4px 0', fontStyle: 'italic'
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
  const parts = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let last = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[0].startsWith('**')) {
      parts.push(<strong key={key++} style={{ fontWeight: 800 }}>{match[2]}</strong>);
    } else if (match[0].startsWith('*')) {
      parts.push(<em key={key++} style={{ fontStyle: 'italic' }}>{match[3]}</em>);
    } else if (match[0].startsWith('`')) {
      parts.push(
        <code key={key++} style={{
          background: 'var(--profile-bg)', border: '1.5px solid var(--border-light)',
          borderRadius: '4px', padding: '1px 5px', fontFamily: 'monospace', fontSize: '0.9em'
        }}>{match[4]}</code>
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length > 0 ? parts : text;
}

export default function ActivityCard({ activities: initialActivities }) {
  const [activities, setActivities] = useState(initialActivities || []);
  const [deletingId, setDeletingId] = useState(null);
  const [pollVotes, setPollVotes] = useState({}); // { [activityId]: optionIndex }

  useEffect(() => {
    setActivities(initialActivities || []);
  }, [initialActivities]);

  const getBadgeStyleClass = (type) => {
    switch (type) {
      case 'discussion':
        return 'profile-activity-item__badge--discussion';
      case 'question':
        return 'profile-activity-item__badge--question';
      case 'idea':
        return 'profile-activity-item__badge--idea';
      case 'project':
        return 'profile-activity-item__badge--project';
      case 'reply':
        return 'profile-activity-item__badge--reply';
      case 'post':
      default:
        return 'profile-activity-item__badge--post';
    }
  };

  const handleDelete = (id) => {
    // Filter local component state
    const updated = activities.filter(act => act.id !== id);
    setActivities(updated);
    setDeletingId(null);

    // Update global state in localStorage
    const saved = localStorage.getItem('cg-profile');
    if (saved) {
      try {
        const profile = JSON.parse(saved);
        profile.activities = profile.activities.filter(act => act.id !== id);
        localStorage.setItem('cg-profile', JSON.stringify(profile));
      } catch (e) {
        console.error("Failed to delete activity from localStorage", e);
      }
    }
  };

  const handleVote = (activityId, optionIdx) => {
    if (pollVotes[activityId] !== undefined) return; // already voted
    setPollVotes(prev => ({
      ...prev,
      [activityId]: optionIdx
    }));
  };

  return (
    <div className="profile-card profile-card--activity">
      <div className="profile-card__header">
        <h3 className="profile-card__title">Recent Activity</h3>
      </div>
      
      <div className="profile-card__body">
        <div className="profile-activity-list">
          {activities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-lg)', color: 'var(--muted)', fontSize: 'var(--text-sm)' }}>
              No recent activity. Create a post to get started!
            </div>
          ) : (
            activities.map((act) => {
              const isUserPost = act.userCreated || (typeof act.id === 'number' && act.id > 1000);
              const userVote = pollVotes[act.id];

              return (
                <div key={act.id} className="profile-activity-item">
                  {/* Header Row */}
                  <div className="profile-activity-item__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                      <span className={`profile-activity-item__badge ${getBadgeStyleClass(act.type)}`}>
                        {act.type}
                      </span>
                      <span className="profile-activity-item__community">{act.community}</span>
                      <span className="profile-activity-item__dot">•</span>
                      <span className="profile-activity-item__time">{act.timestamp}</span>
                    </div>

                    {/* Delete Options */}
                    {isUserPost && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {deletingId === act.id ? (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'var(--pastel-pink-bg)',
                            border: '1.5px solid var(--pastel-pink-border)',
                            borderRadius: '8px',
                            padding: '3px 8px',
                            zIndex: 10
                          }}>
                            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--pastel-pink-text)' }}>Delete post?</span>
                            <button
                              onClick={() => handleDelete(act.id)}
                              style={{
                                fontSize: '10px',
                                fontWeight: 800,
                                padding: '2px 8px',
                                background: '#FF5C5C',
                                color: 'white',
                                borderRadius: '6px',
                                border: '1.5px solid var(--profile-card-border)',
                                cursor: 'pointer'
                              }}
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeletingId(null)}
                              style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '2px 8px',
                                background: 'var(--profile-card-bg)',
                                color: 'var(--text)',
                                borderRadius: '6px',
                                border: '1.5px solid var(--border-light)',
                                cursor: 'pointer'
                              }}
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeletingId(act.id)}
                            style={{
                              color: 'var(--muted)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              padding: '4px',
                              borderRadius: '50%',
                              transition: 'all 0.2s'
                            }}
                            title="Delete this post"
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#FF5C5C'; e.currentTarget.style.background = 'var(--pastel-pink-bg)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'transparent'; }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Title */}
                  <h4 className="profile-activity-item__title" style={{ marginTop: '4px' }}>{act.title}</h4>

                  {/* Body with Markdown Formatting */}
                  {act.body && (
                    <div 
                      className="profile-activity-item__body" 
                      style={{ 
                        fontSize: 'var(--text-xs)', 
                        color: 'var(--text-secondary)',
                        marginTop: '6px',
                        wordBreak: 'break-word',
                        lineHeight: '1.6'
                      }}
                    >
                      {renderMarkdown(act.body)}
                    </div>
                  )}

                  {/* ── media display ── */}
                  {act.media && (
                    <div style={{ marginTop: '10px', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--profile-card-border)', boxShadow: '3px 3px 0 var(--profile-shadow-offset)' }}>
                      {act.media.type?.startsWith('video/') ? (
                        <video src={act.media.dataUrl} controls style={{ width: '100%', maxHeight: '320px', display: 'block', objectFit: 'contain', background: '#000' }} />
                      ) : (
                        <img src={act.media.dataUrl} alt="Post attachments" style={{ width: '100%', maxHeight: '320px', display: 'block', objectFit: 'cover' }} />
                      )}
                    </div>
                  )}

                  {/* ── poll display ── */}
                  {act.poll && (
                    <div style={{
                      marginTop: '10px',
                      padding: '12px',
                      borderRadius: '12px',
                      border: '2px solid var(--profile-card-border)',
                      background: 'var(--profile-ivory)',
                      boxShadow: '3px 3px 0 var(--profile-shadow-offset)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--text)' }}>
                        <BarChart2 size={16} color="var(--profile-pink)" />
                        <span>{act.poll.question}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {act.poll.options.map((opt, idx) => {
                          const totalVotes = userVote !== undefined ? 21 : 20; // seed votes
                          let optVotes = idx === 0 ? 12 : idx === 1 ? 8 : 0; // seeded options
                          if (userVote === idx) optVotes += 1;
                          const percent = Math.round((optVotes / totalVotes) * 100);

                          return (
                            <button
                              key={idx}
                              onClick={() => handleVote(act.id, idx)}
                              disabled={userVote !== undefined}
                              style={{
                                width: '100%',
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1.5px solid var(--border-light)',
                                background: userVote === idx ? 'var(--pastel-pink-bg)' : 'var(--profile-card-bg)',
                                color: 'var(--text)',
                                cursor: userVote !== undefined ? 'default' : 'pointer',
                                overflow: 'hidden',
                                fontSize: '11px',
                                fontWeight: 600,
                                textAlign: 'left',
                                transition: 'all 0.2s'
                              }}
                            >
                              {/* Background progress bar when voted */}
                              {userVote !== undefined && (
                                <div style={{
                                  position: 'absolute',
                                  left: 0,
                                  top: 0,
                                  bottom: 0,
                                  width: `${percent}%`,
                                  background: userVote === idx ? 'rgba(255, 143, 171, 0.25)' : 'rgba(26, 26, 26, 0.05)',
                                  zIndex: 0,
                                  transition: 'width 0.6s var(--ease-out)'
                                }} />
                              )}
                              <span style={{ zIndex: 1 }}>{opt}</span>
                              {userVote !== undefined && (
                                <span style={{ zIndex: 1, fontWeight: 700, color: 'var(--muted)' }}>{percent}%</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── event display ── */}
                  {act.event && (
                    <div style={{
                      marginTop: '10px',
                      padding: '12px',
                      borderRadius: '12px',
                      border: '2px solid var(--profile-card-border)',
                      background: 'var(--profile-cream-light)',
                      boxShadow: '3px 3px 0 var(--profile-shadow-offset)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--text)' }}>
                        <CalendarDays size={16} color="var(--profile-pink)" />
                        <span>{act.event.name}</span>
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--muted)', display: 'flex', flexWrap: 'wrap', gap: '6px 12px' }}>
                        {act.event.date && <span>📅 {act.event.date}</span>}
                        {act.event.time && <span>⏰ {act.event.time}</span>}
                        {act.event.location && <span>📍 {act.event.location}</span>}
                      </div>
                      {act.event.description && (
                        <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px', borderTop: '1px dashed var(--border-light)', paddingTop: '4px' }}>
                          {act.event.description}
                        </p>
                      )}
                    </div>
                  )}

                  {/* ── link display ── */}
                  {act.link && (
                    <a
                      href={act.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="profile-card__tag"
                      style={{
                        alignSelf: 'flex-start',
                        marginTop: '10px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        fontSize: '11px',
                        color: 'var(--pastel-blue-text)',
                        background: 'var(--pastel-blue-bg)',
                        border: '1.5px solid var(--pastel-blue-border)',
                        boxShadow: '2px 2px 0 var(--profile-shadow-offset)',
                        textTransform: 'none'
                      }}
                    >
                      <span>Clickable Link</span>
                      <ExternalLink size={12} />
                    </a>
                  )}

                  {/* Tag interests */}
                  {act.interests && act.interests.length > 0 && (
                    <div 
                      className="profile-activity-item__interests" 
                      style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '6px', 
                        marginTop: '8px' 
                      }}
                    >
                      {act.interests.map((interest) => (
                        <span 
                          key={interest} 
                          className="profile-card__tag" 
                          style={{ 
                            padding: '2px 8px', 
                            fontSize: '9px', 
                            textTransform: 'capitalize', 
                            margin: 0,
                            boxShadow: 'none',
                            border: '1.5px solid var(--border-light)',
                            background: 'var(--profile-cream-light)',
                            color: 'var(--text-secondary)',
                            fontWeight: 700
                          }}
                        >
                          #{interest}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Replies Info */}
                  <div className="profile-activity-item__footer text-muted" style={{ marginTop: '8px' }}>
                    <MessageSquare size={14} className="profile-activity-item__icon" />
                    <span>{act.replies} replies</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
