import { CheckCircle2, Circle } from 'lucide-react';

export default function ProfileCompletionCard({ items }) {
  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const percent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="profile-card profile-card--sidebar profile-card--completion">
      <div className="profile-card__header">
        <h3 className="profile-card__title">Profile Completion</h3>
        <span className="profile-card__badge-percent">{percent}%</span>
      </div>
      
      <div className="profile-card__body">
        {/* Progress Bar */}
        <div className="profile-progress-bar">
          <div className="profile-progress-bar__inner" style={{ width: `${percent}%` }} />
        </div>
        
        {/* Checklist */}
        <div className="profile-completion-list">
          {items.map((item) => (
            <div key={item.id} className="profile-completion-item">
              {item.completed ? (
                <CheckCircle2 size={16} className="profile-completion-item__icon profile-completion-item__icon--done" />
              ) : (
                <Circle size={16} className="profile-completion-item__icon profile-completion-item__icon--todo" />
              )}
              <span className={`profile-completion-item__text ${item.completed ? 'profile-completion-item__text--done' : ''}`}>
                {item.task}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
