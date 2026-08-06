import './ChessPattern.css';

export default function ChessPattern({
  rows = 4,
  cols = 8,
  cellSize = 16,
  opacity = 0.06,
  color,
  className = '',
  style = {},
}) {
  return (
    <div
      className={`chess-pattern ${className}`}
      style={{
        '--chess-size': `${cellSize}px`,
        '--chess-opacity': opacity,
        '--chess-color': color || 'var(--text)',
        '--chess-rows': rows,
        '--chess-cols': cols,
        ...style,
      }}
      aria-hidden="true"
    />
  );
}
