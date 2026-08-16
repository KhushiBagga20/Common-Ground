export default function DoodleDaisy({ size = 48, className = "", style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={`doodle-daisy ${className}`}
      style={{ display: 'inline-block', overflow: 'visible', ...style }}
      aria-hidden="true"
    >
      {/* Hand-drawn style petals */}
      <g stroke="var(--border)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {/* Petal 1 (Top) */}
        <path d="M50 34 C44 14, 56 14, 50 34" fill="#FFFFFF" />
        {/* Petal 2 (Top Right) */}
        <path d="M61 39 C78 22, 84 36, 61 39" fill="#FFFFFF" />
        {/* Petal 3 (Right) */}
        <path d="M66 50 C86 44, 86 56, 66 50" fill="#FFFFFF" />
        {/* Petal 4 (Bottom Right) */}
        <path d="M61 61 C84 64, 78 78, 61 61" fill="#FFFFFF" />
        {/* Petal 5 (Bottom) */}
        <path d="M50 66 C56 86, 44 86, 50 66" fill="#FFFFFF" />
        {/* Petal 6 (Bottom Left) */}
        <path d="M39 61 C16 78, 22 64, 39 61" fill="#FFFFFF" />
        {/* Petal 7 (Left) */}
        <path d="M34 50 C14 56, 14 44, 34 50" fill="#FFFFFF" />
        {/* Petal 8 (Top Left) */}
        <path d="M39 39 C22 36, 16 22, 39 39" fill="#FFFFFF" />
      </g>
      
      {/* Yellow Center */}
      <circle cx="50" cy="50" r="16" fill="var(--yellow)" stroke="var(--border)" strokeWidth="3" />
      
      {/* Friendly Playful Face */}
      <circle cx="45" cy="46" r="2.5" fill="#111111" />
      <circle cx="55" cy="46" r="2.5" fill="#111111" />
      {/* Smile */}
      <path d="M46 53 Q50 57 54 53" stroke="#111111" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
