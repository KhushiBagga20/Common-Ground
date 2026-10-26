import './KineticCheckerboard.css';

/** Drifting checkerboard behind app pages; `tint` washes the squares in the page's colour */
export default function KineticCheckerboard({ tint }) {
  return (
    <div
      className={`kinetic-checkerboard ${tint ? 'kinetic-checkerboard--tinted' : ''}`}
      style={tint ? { '--checker-tint': tint } : undefined}
      aria-hidden="true"
    />
  );
}
