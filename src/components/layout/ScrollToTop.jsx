import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/* Scroll positions per history entry, so Back/Forward land where you left off */
const savedPositions = new Map();

export default function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const keyRef = useRef(location.key);

  // We restore positions ourselves; stop the browser from fighting us
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const savePosition = () => savedPositions.set(keyRef.current, window.scrollY);
    window.addEventListener('scroll', savePosition, { passive: true });
    return () => window.removeEventListener('scroll', savePosition);
  }, []);

  useLayoutEffect(() => {
    keyRef.current = location.key;
    const top = navigationType === 'POP' ? savedPositions.get(location.key) ?? 0 : 0;
    // 'instant' overrides the global `scroll-behavior: smooth` so the page doesn't visibly glide up
    window.scrollTo({ top, left: 0, behavior: 'instant' });
  }, [location.key, navigationType]);

  return null;
}
