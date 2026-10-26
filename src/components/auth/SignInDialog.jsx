import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Smiley from '../common/Smiley';
import './SignInDialog.css';

/* Passwordless sign-in: enter an email, open the link Supabase sends */
export default function SignInDialog() {
  const { signInPrompt, closeSignIn, sendMagicLink } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!signInPrompt.open) return;
    setStatus('idle');
    setError('');
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 50);
    const onKeyDown = (e) => { if (e.key === 'Escape') closeSignIn(); };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [signInPrompt.open, closeSignIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await sendMagicLink(email.trim());
      setStatus('sent');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {signInPrompt.open && (
        <motion.div
          className="signin-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) closeSignIn(); }}
        >
          <motion.div
            className="signin-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="signin-title"
            initial={{ y: 30, rotate: -2, scale: 0.94, opacity: 0 }}
            animate={{ y: 0, rotate: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, opacity: 0, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 26 }}
          >
            <button type="button" className="signin-card__close" onClick={closeSignIn} aria-label="Close">
              <X size={16} strokeWidth={2.5} />
            </button>

            {status === 'sent' ? (
              <div className="signin-card__sent">
                <Smiley size={52} mood="happy" />
                <h2 id="signin-title" className="signin-card__title">Check your inbox ✨</h2>
                <p className="signin-card__text">
                  We sent a sign-in link to <strong>{email}</strong>. Open it in this browser and you're in.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <span className="signin-card__eyebrow mono-label">
                  <span className="signin-card__led" aria-hidden="true" />
                  Magic link
                </span>
                <h2 id="signin-title" className="signin-card__title">Sign in to CommonGround</h2>
                <p className="signin-card__text">
                  {signInPrompt.reason || 'Save your communities, events and posts to your account.'}
                  {' '}No password — we'll email you a link.
                </p>

                <label className="signin-card__field">
                  <Mail size={16} aria-hidden="true" />
                  <input
                    ref={inputRef}
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email address"
                  />
                </label>

                {status === 'error' && <p className="signin-card__error">{error}</p>}

                <button type="submit" className="signin-card__submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send magic link →'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
