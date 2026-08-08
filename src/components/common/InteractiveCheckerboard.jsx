import { useRef, useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import './InteractiveCheckerboard.css';

/* ---------------------------------------------------------------
   CONSTANTS
   --------------------------------------------------------------- */
const TILE  = 80;     // tile size in px
const COLS  = 24;     // number of columns — covers wide viewports
const ROWS  = 16;     // number of rows — covers tall viewports
const PROXIMITY_R = 180; // cursor proximity radius in px

/* Accent colors that occasionally flash on proximity */
const ACCENTS = ['#FFD43B', '#4D7CFE', '#FF72B6', '#5BCB77', '#FF914D', '#9B72FF'];

/* ---------------------------------------------------------------
   InteractiveCheckerboard

   Pure CSS grid of DOM divs. No canvas, no JS animation loop.
   
   Interaction:
   - Throttled mousemove sets CSS custom properties on nearby tiles
   - CSS transitions handle smooth shift/color change (GPU composited)
   - ~240 lightweight divs, each only updates on proximity
   - A slow diagonal drift via CSS animation on the container
   --------------------------------------------------------------- */
export default function InteractiveCheckerboard() {
  const gridRef   = useRef(null);
  const rafRef    = useRef(null);
  const cursorRef = useRef({ x: -9999, y: -9999 });
  const { theme } = useTheme();

  /* Stable tile data — computed once */
  const [tiles] = useState(() => {
    const arr = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const isLight = (r + c) % 2 === 0;
        arr.push({ r, c, isLight });
      }
    }
    return arr;
  });

  /* Throttled proximity update via RAF */
  const updateProximity = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const { x: mx, y: my } = cursorRef.current;
    const rect = grid.getBoundingClientRect();
    const children = grid.children;

    for (let i = 0; i < children.length; i++) {
      const tile = children[i];
      const r = Math.floor(i / COLS);
      const c = i % COLS;
      const tileCX = c * TILE + TILE / 2;
      const tileCY = r * TILE + TILE / 2;

      // Mouse position relative to grid
      const relX = mx - rect.left;
      const relY = my - rect.top;

      const dx = tileCX - relX;
      const dy = tileCY - relY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < PROXIMITY_R && mx > -1000) {
        const t = 1 - dist / PROXIMITY_R;
        const tSmooth = t * t * (3 - 2 * t); // smoothstep

        // Push tile away from cursor (1-4px)
        const pushX = dist > 1 ? (dx / dist) * tSmooth * 4 : 0;
        const pushY = dist > 1 ? (dy / dist) * tSmooth * 4 : 0;

        tile.style.transform = `translate(${pushX.toFixed(1)}px, ${pushY.toFixed(1)}px)`;
        tile.style.opacity = (0.85 + tSmooth * 0.15).toFixed(2);

        // Closest tiles may flash an accent color
        if (tSmooth > 0.7) {
          tile.classList.add('ichecker__tile--accent');
          // Pick accent based on tile position (deterministic, not random)
          const accentIdx = (r * COLS + c) % ACCENTS.length;
          tile.style.setProperty('--tile-accent', ACCENTS[accentIdx]);
        } else {
          tile.classList.remove('ichecker__tile--accent');
        }
      } else {
        tile.style.transform = '';
        tile.style.opacity = '';
        tile.classList.remove('ichecker__tile--accent');
      }
    }

    rafRef.current = null;
  }, []);

  const handleMouseMove = useCallback((e) => {
    cursorRef.current.x = e.clientX;
    cursorRef.current.y = e.clientY;
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(updateProximity);
    }
  }, [updateProximity]);

  const handleMouseLeave = useCallback(() => {
    cursorRef.current = { x: -9999, y: -9999 };
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(updateProximity);
    }
  }, [updateProximity]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  return (
    <motion.div
      className="ichecker"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div
        ref={gridRef}
        className="ichecker__grid"
        style={{
          gridTemplateColumns: `repeat(${COLS}, ${TILE}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${TILE}px)`,
        }}
      >
        {tiles.map(({ r, c, isLight }) => (
          <div
            key={`${r}-${c}`}
            className={`ichecker__tile ${isLight ? 'ichecker__tile--light' : 'ichecker__tile--dark'}`}
          />
        ))}
      </div>
    </motion.div>
  );
}
