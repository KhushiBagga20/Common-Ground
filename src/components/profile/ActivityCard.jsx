import { MessageSquare } from 'lucide-react';

export default function ActivityCard({ activities }) {
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

  return (
    <div className="profile-card profile-card--activity">
      <div className="profile-card__header">
        <h3 className="profile-card__title">Recent Activity</h3>
      </div>
      
      <div className="profile-card__body">
        <div className="profile-activity-list">
          {activities.map((act) => (
            <div key={act.id} className="profile-activity-item">
              <div className="profile-activity-item__header">
                <span className={`profile-activity-item__badge ${getBadgeStyleClass(act.type)}`}>
                  {act.type}
                </span>
                <span className="profile-activity-item__community">{act.community}</span>
                <span className="profile-activity-item__dot">•</span>
                <span className="profile-activity-item__time">{act.timestamp}</span>
              </div>
              
              <h4 className="profile-activity-item__title">{act.title}</h4>

              {act.body && (
                <p 
                  className="profile-activity-item__body" 
                  style={{ 
                    fontSize: 'var(--text-xs)', 
                    color: 'var(--text-secondary)',
                    marginTop: '6px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    lineHeight: '1.5'
                  }}
                >
                  {act.body}
                </p>
              )}

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
              
              <div className="profile-activity-item__footer text-muted">
                <MessageSquare size={14} className="profile-activity-item__icon" />
                <span>{act.replies} replies</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
