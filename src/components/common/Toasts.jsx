import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useToasts, dismissToast } from '../../lib/toast';
import './Toasts.css';

function ToastCard({ toast }) {
  useEffect(() => {
    const timer = setTimeout(() => dismissToast(toast.id), 3200);
    return () => clearTimeout(timer);
  }, [toast.id]);

  return (
    <motion.li
      layout
      className={`toast toast--${toast.tone}`}
      initial={{ y: 40, rotate: -6, scale: 0.8, opacity: 0 }}
      animate={{ y: 0, rotate: toast.id % 2 ? 1.5 : -1.5, scale: 1, opacity: 1 }}
      exit={{ x: -60, rotate: -8, opacity: 0, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 18 }}
    >
      <div className="toast__text">
        <strong>{toast.title}</strong>
        {toast.body && <span className="toast__body">{toast.body}</span>}
      </div>
      <button type="button" className="toast__x" aria-label="Dismiss" onClick={() => dismissToast(toast.id)}>
        <X size={14} strokeWidth={3} />
      </button>
    </motion.li>
  );
}

export default function Toasts() {
  const toasts = useToasts();

  return (
    <ol className="toasts" aria-live="polite" aria-label="Notifications">
      <AnimatePresence initial={false}>
        {toasts.map(t => <ToastCard key={t.id} toast={t} />)}
      </AnimatePresence>
    </ol>
  );
}
