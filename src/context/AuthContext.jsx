import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  // Sign-in dialog: opened from the profile page, or when a write needs an account
  const [prompt, setPrompt] = useState({ open: false, reason: '' });

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) setPrompt({ open: false, reason: '' });
    });
    return () => subscription.unsubscribe();
  }, []);

  const sendMagicLink = useCallback(async (email) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      // Come back to the page you signed in from
      options: { emailRedirectTo: window.location.origin + window.location.pathname },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const openSignIn = useCallback((reason = '') => setPrompt({ open: true, reason }), []);
  const closeSignIn = useCallback(() => setPrompt({ open: false, reason: '' }), []);

  const value = useMemo(() => ({
    configured: isSupabaseConfigured,
    user: session?.user ?? null,
    loading,
    sendMagicLink,
    signOut,
    signInPrompt: prompt,
    openSignIn,
    closeSignIn,
  }), [session, loading, sendMagicLink, signOut, prompt, openSignIn, closeSignIn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
