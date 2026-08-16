import * as Icons from 'lucide-react';

export default function AchievementsCard({ achievements }) {
  return (
    <div className="profile-card profile-card--sidebar profile-card--achievements">
      <div className="profile-card__header">
        <h3 className="profile-card__title">Your Achievements</h3>
      </div>
      
      <div className="profile-card__body">
        <div className="profile-achievements-list">
          {achievements.map((ach) => {
            // Dynmically map the string representation to Lucide icon components
            const IconComponent = Icons[ach.icon] || Icons.Award;
            
            return (
              <div key={ach.id} className="profile-achievement-item">
                <div 
                  className="profile-achievement-item__icon-wrap"
                  style={{ '--badge-bg-color': ach.color }}
                >
                  <IconComponent size={16} />
                </div>
                <div className="profile-achievement-item__info">
                  <h4 className="profile-achievement-item__title">{ach.title}</h4>
                  <p className="profile-achievement-item__desc text-muted">{ach.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
