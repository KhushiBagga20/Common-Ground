import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from '../lib/toast';
import { useAuth } from '../context/AuthContext';
import { profileData } from '../data/profileData';

const LOCAL_KEY = 'cg-profile';
// Columns on the profiles table; everything else lives in its `details` jsonb
const COLUMNS = ['name', 'role', 'bio', 'location', 'website'];

function readLocalProfile() {
  try {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // fall through to the sample profile
  }
  return profileData;
}

function writeLocalProfile(profile) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(profile));
  } catch {
    // storage full or blocked
  }
}

/* A new account starts from the sample layout, with its own name and no activity */
function fromRow(row) {
  const details = row.details ?? {};
  const isNew = Object.keys(details).length === 0;
  const base = isNew
    ? { ...profileData, activities: [], joined: `Joined ${new Date(row.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` }
    : profileData;
  const profile = { ...base, ...details, id: row.id };
  for (const col of COLUMNS) {
    if (row[col] != null) profile[col] = row[col];
  }
  return profile;
}

function toRow(profile) {
  const details = { ...profile };
  delete details.id;
  const row = { details };
  for (const col of COLUMNS) {
    row[col] = profile[col] ?? null;
    delete details[col];
  }
  return row;
}

/**
 * The profile shown on /profile. Signed in: your row in Supabase.
 * Otherwise: the sample profile, with edits kept in this browser.
 * Returns { profile, updateProfile, loading }.
 */
export function useProfile() {
  const { configured, user } = useAuth();
  const userId = user?.id ?? null;
  const signedIn = configured && userId;
  const [remote, setRemote] = useState(null);
  const [local, setLocal] = useState(readLocalProfile);
  // Saves merge onto the latest loaded profile, not a stale render's copy
  const remoteRef = useRef(null);

  useEffect(() => {
    if (!signedIn) {
      remoteRef.current = null;
      setRemote(null);
      return;
    }
    let cancelled = false;
    supabase.from('profiles').select('*').eq('id', userId).single().then(({ data, error }) => {
      if (cancelled) return;
      if (error) {
        toast({ title: "Couldn't load your profile", body: error.message, tone: 'red' });
        return;
      }
      remoteRef.current = fromRow(data);
      setRemote(remoteRef.current);
    });
    return () => { cancelled = true; };
  }, [signedIn, userId]);

  const updateProfile = useCallback(async (fields) => {
    if (!signedIn) {
      setLocal(prev => {
        const next = { ...prev, ...fields };
        writeLocalProfile(next);
        return next;
      });
      return;
    }
    const next = { ...remoteRef.current, ...fields };
    remoteRef.current = next;
    setRemote(next);
    const { error } = await supabase.from('profiles').update(toRow(next)).eq('id', userId);
    if (error) toast({ title: "Couldn't save your profile", body: error.message, tone: 'red' });
  }, [signedIn, userId]);

  return {
    profile: signedIn ? remote : local,
    updateProfile,
    loading: Boolean(signedIn && !remote),
  };
}
