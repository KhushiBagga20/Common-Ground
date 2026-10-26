import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../context/AppDataContext';
import './LiveTicker.css';

const truncate = (text, max) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

/** Interleave lists so the strip alternates kinds of news */
function interleave(...lists) {
  const out = [];
  const longest = Math.max(...lists.map(l => l.length));
  for (let i = 0; i < longest; i++) {
    lists.forEach(list => { if (list[i]) out.push(list[i]); });
  }
  return out;
}

/* A scrolling "what's happening" strip built from real app data. Pauses on hover. */
export default function LiveTicker() {
  const navigate = useNavigate();
  const { posts, events, communities, trendingCommunities, isJoined } = useAppData();

  const items = useMemo(() => {
    const nameOf = id => communities.find(c => c.id === id)?.name;

    const joined = communities.filter(c => isJoined(c.id)).slice(0, 3).map(c => ({
      key: `in-${c.id}`, emoji: '🌻', text: `You're in ${c.name}`, to: `/community/${c.id}`,
    }));
    const fresh = [...posts]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .filter(p => p.communityId)
      .slice(0, 4)
      .map(p => ({
        key: `post-${p.id}`, emoji: '💬',
        text: `New in ${nameOf(p.communityId) ?? 'a community'}: “${truncate(p.title, 46)}”`,
        to: `/community/${p.communityId}`,
      }));
    const trending = trendingCommunities.slice(0, 4).map(c => ({
      key: `hot-${c.id}`, emoji: '🔥', text: `${c.name} · ${c.memberCount} members`, to: `/community/${c.id}`,
    }));
    const upcoming = events.slice(0, 3).map(e => ({
      key: `evt-${e.id}`, emoji: '📅', text: `${e.title} · ${e.date.replace(/ \d{4}$/, '')}`, to: '/events',
    }));

    return [...joined, ...interleave(fresh, trending, upcoming)];
  }, [posts, events, communities, trendingCommunities, isJoined]);

  if (items.length === 0) return null;

  return (
    <div className="live-ticker" role="region" aria-label="What's happening on CommonGround">
      <span className="live-ticker__badge mono-label">
        <span className="live-ticker__dot" aria-hidden="true" />
        Live
      </span>
      <div className="live-ticker__viewport">
        {/* The list is drawn twice so the loop is seamless; the copy is hidden from assistive tech */}
        <div className="live-ticker__track" style={{ '--ticker-duration': `${items.length * 5}s` }}>
          {[0, 1].map(copy => (
            <ul key={copy} className="live-ticker__list" aria-hidden={copy === 1 || undefined}>
              {items.map(item => (
                <li key={item.key}>
                  <button
                    type="button"
                    className="live-ticker__item"
                    onClick={() => navigate(item.to)}
                    tabIndex={copy === 1 ? -1 : 0}
                  >
                    <span aria-hidden="true">{item.emoji}</span>
                    {item.text}
                  </button>
                  <span className="live-ticker__sep" aria-hidden="true">✦</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
