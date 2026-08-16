import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import Button from '../common/Button';

export default function ShareVibeCard({ vibe }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText("Check out my vibe on CommonGround: Curious Explorer! yashika.dev");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="profile-card profile-card--sidebar profile-card--vibe">
      <div className="profile-card__header">
        <h3 className="profile-card__title">Share Your Vibe</h3>
      </div>
      
      <div className="profile-card__body">
        <div className="profile-vibe-display" style={{ '--vibe-color': vibe.color }}>
          <div className="profile-vibe-display__badge">
            <span className="profile-vibe-display__emoji">{vibe.emoji}</span>
            <span className="profile-vibe-display__title">{vibe.badge}</span>
          </div>
          
          <div className="profile-vibe-display__tags">
            {vibe.hobbies.map((hob) => (
              <span key={hob} className="profile-vibe-display__tag">{hob}</span>
            ))}
          </div>
        </div>
        
        <p className="profile-card__sidebar-desc">
          Generate a shareable snippet or graphic card of your current interests to share on other socials!
        </p>
        
        <Button
          size="sm"
          className="profile-card__sidebar-btn"
          iconLeft={copied ? <Check size={14} /> : <Share2 size={14} />}
          onClick={handleShare}
        >
          {copied ? "Copied Link!" : "Share Vibe"}
        </Button>
      </div>
    </div>
  );
}
