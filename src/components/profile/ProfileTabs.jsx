export default function ProfileTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'communities', label: 'My Communities' },
    { id: 'hobbies', label: 'My Hobbies' },
    { id: 'activity', label: 'My Activity' },
    { id: 'saved', label: 'Saved' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <div className="profile-tabs-wrapper">
      <div className="profile-tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`profile-tabs__btn ${isActive ? 'profile-tabs__btn--active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
              {isActive && <div className="profile-tabs__active-indicator" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
