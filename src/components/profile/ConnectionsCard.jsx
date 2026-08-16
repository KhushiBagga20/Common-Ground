import { ArrowRight } from 'lucide-react';

export default function ConnectionsCard({ connections }) {
  return (
    <div className="profile-card profile-card--sidebar profile-card--connections">
      <div className="profile-card__header">
        <h3 className="profile-card__title">Your Connections</h3>
      </div>
      
      <div className="profile-card__body">
        <div className="profile-connections-list">
          {connections.map((conn) => (
            <div key={conn.name} className="profile-connection-item">
              <div 
                className="profile-connection-item__avatar"
                style={{ backgroundColor: conn.avatarColor }}
              >
                {conn.avatarEmoji}
              </div>
              <div className="profile-connection-item__info">
                <h4 className="profile-connection-item__name">{conn.name}</h4>
                <p className="profile-connection-item__role">{conn.role}</p>
                <span className="profile-connection-item__mutual text-muted">
                  {conn.mutualCount} mutual connections
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <button className="profile-card__view-all-btn text-muted">
          <span>View all connections</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
