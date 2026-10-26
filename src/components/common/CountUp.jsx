import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';
import { prefersReducedMotion } from '../../lib/motion';

/** Counts up from zero the first time it scrolls into view */
export default function CountUp({ value, duration = 1.1, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });
  const [shown, setShown] = useState(() => (prefersReducedMotion() ? value : 0));

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setShown(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: v => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {shown}
    </span>
  );
}
