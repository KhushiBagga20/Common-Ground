import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Supabase client, or null when the env vars aren't set.
 * Without it the app runs in demo mode on the bundled mock data,
 * keeping your joins/likes/posts in this browser only.
 */
export const supabase = url && anonKey
  ? createClient(url, anonKey, { auth: { flowType: 'pkce' } })
  : null;

export const isSupabaseConfigured = Boolean(supabase);
