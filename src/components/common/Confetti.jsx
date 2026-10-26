import { useBursts } from '../../lib/celebrate';
import './Confetti.css';

function Piece({ piece }) {
  const style = {
    '--dx': `${piece.dx}px`,
    '--dy': `${piece.dy}px`,
    '--rot': `${piece.rot}deg`,
    '--size': `${piece.size}px`,
    color: piece.color,
    animationDelay: `${piece.delay}ms`,
  };

  if (piece.shape === 'star') {
    return (
      <svg className="confetti__piece" style={style} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z" fill="currentColor" stroke="#111" strokeWidth="1.5" />
      </svg>
    );
  }
  if (piece.shape === 'heart') {
    return (
      <svg className="confetti__piece" style={style} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" fill="currentColor" stroke="#111" strokeWidth="1.5" />
      </svg>
    );
  }
  return <span className={`confetti__piece confetti__piece--${piece.shape}`} style={style} aria-hidden="true" />;
}

/* Draws every active burst from celebrate() */
export default function Confetti() {
  const bursts = useBursts();

  return (
    <div className="confetti" aria-hidden="true">
      {bursts.map(burst => (
        <div key={burst.id} className="confetti__burst" style={{ left: burst.x, top: burst.y }}>
          {burst.pieces.map((piece, i) => <Piece key={i} piece={piece} />)}
        </div>
      ))}
    </div>
  );
}
