/** Starburst sticker ("NEW!", "HOT", "YES!") */
export default function Burst({ text, color = 'var(--green)', size = 84, rotate = -10, points = 14, className = '' }) {
  // Alternate outer/inner radii around the centre to draw the spikes
  const path = Array.from({ length: points * 2 }, (_, i) => {
    const r = i % 2 === 0 ? 48 : 38;
    const a = (Math.PI * i) / points - Math.PI / 2;
    return `${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`burst ${className}`}
      style={{ rotate: `${rotate}deg` }}
      aria-hidden="true"
    >
      <polygon points={path} fill="#111111" transform="translate(3 3)" />
      <polygon points={path} fill={color} stroke="#111111" strokeWidth="3" strokeLinejoin="round" />
      <text
        x="50"
        y="51"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#111111"
        fontFamily="Archivo, Inter, sans-serif"
        fontWeight="900"
        fontStretch="70%"
        fontSize={text.length > 4 ? 15 : 20}
      >
        {text.toUpperCase()}
      </text>
    </svg>
  );
}
