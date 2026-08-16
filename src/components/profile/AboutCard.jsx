import Smiley from '../common/Smiley';
import DoodleDaisy from '../common/DoodleDaisy';

export default function AboutCard({ aboutMe }) {
  // Map index to soft pastel color combinations
  const pastels = [
    { bg: 'var(--pastel-pink-bg)', border: 'var(--pastel-pink-border)', text: 'var(--pastel-pink-text)' },
    { bg: 'var(--pastel-yellow-bg)', border: 'var(--pastel-yellow-border)', text: 'var(--pastel-yellow-text)' },
    { bg: 'var(--pastel-green-bg)', border: 'var(--pastel-green-border)', text: 'var(--pastel-green-text)' },
    { bg: 'var(--pastel-blue-bg)', border: 'var(--pastel-blue-border)', text: 'var(--pastel-blue-text)' },
    { bg: 'var(--pastel-purple-bg)', border: 'var(--pastel-purple-border)', text: 'var(--pastel-purple-text)' }
  ];

  return (
    <div className="profile-card profile-card--about">
      {/* Decorative Daisy */}
      <DoodleDaisy 
        size={36} 
        style={{ position: 'absolute', top: '16px', right: '55px', opacity: 0.85 }} 
      />

      <div className="profile-card__header">
        <h3 className="profile-card__title">About Me</h3>
        <Smiley size={24} mood="happy" animate={false} />
      </div>
      
      <div className="profile-card__body">
        <p className="profile-card__text">{aboutMe.description}</p>
        
        <div className="profile-card__subsection">
          <h4 className="profile-card__subtitle font-accent">Things I enjoy</h4>
          <div className="profile-card__tags">
            {aboutMe.interests.map((interest, idx) => {
              const colorConfig = pastels[idx % pastels.length];
              return (
                <span
                  key={interest}
                  className="profile-card__tag"
                  style={{ 
                    '--tag-bg': colorConfig.bg,
                    '--tag-border': colorConfig.border,
                    '--tag-text': colorConfig.text
                  }}
                >
                  {interest}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
