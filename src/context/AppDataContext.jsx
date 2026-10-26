import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from '../lib/toast';
import { useAuth } from './AuthContext';
import { hobbies as mockHobbies } from '../data/hobbies';
import { communities as mockCommunities } from '../data/communities';
import { posts as mockPosts } from '../data/posts';
import { events as mockEvents, eventImages } from '../data/events';
import { users } from '../data/users';

/* ============================================================
   APP DATA — the one door into content and user actions.
   With Supabase configured, the catalogue comes from the
   database and actions are saved to your account. Without it
   (demo mode), the bundled mock data is used and your joins,
   likes, RSVPs and posts are kept in this browser.
   ============================================================ */

const AppDataContext = createContext(null);

const LOCAL_STATE_KEY = 'cg-user-state';
const LOCAL_POSTS_KEY = 'cg-local-posts';
const INTERESTS_KEY = 'cg-interests';

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or blocked — demo state just won't survive a reload
  }
}

const demoAuthorName = (id) => users.find(u => u.id === id)?.name;

const MOCK_CATALOG = {
  hobbies: mockHobbies,
  communities: mockCommunities,
  posts: mockPosts.map(p => ({ ...p, authorName: demoAuthorName(p.authorId) })),
  events: mockEvents,
};

/* ── Supabase rows → the shapes the pages already use ── */
const fromHobbyRow = r => ({
  id: r.id, name: r.name, emoji: r.emoji, color: r.color, category: r.category,
  description: r.description, longDescription: r.long_description, memberCount: r.member_count,
});
const fromCommunityRow = r => ({
  id: r.id, hobbyId: r.hobby_id, name: r.name, description: r.description,
  memberCount: r.member_count, postCount: r.post_count, color: r.color, trending: r.trending,
  tags: r.tags, relatedHobbies: r.related_hobbies,
});
const fromPostRow = r => ({
  id: r.id, type: r.type, communityId: r.community_id,
  authorId: r.author_id ?? r.demo_author_id,
  authorName: r.author_name ?? demoAuthorName(r.demo_author_id),
  title: r.title, body: r.body, interests: r.interests, tags: r.tags, attachments: r.attachments,
  createdAt: r.created_at, replyCount: r.reply_count, likeCount: r.like_count,
});
const fromEventRow = r => ({
  id: r.id, title: r.title, category: r.category, date: r.date_label, time: r.time_label,
  locationType: r.location_type, location: r.location, description: r.description,
  interested: r.interested_count, imageKey: r.image_key, image: eventImages[r.image_key] ?? null,
});

async function fetchCatalog() {
  const [h, c, p, e] = await Promise.all([
    supabase.from('hobbies').select('*').order('sort_order'),
    supabase.from('communities').select('*').order('sort_order'),
    supabase.from('posts').select('*').order('created_at', { ascending: false }),
    supabase.from('events').select('*').order('sort_order'),
  ]);
  const error = h.error || c.error || p.error || e.error;
  if (error) throw error;
  return {
    hobbies: h.data.map(fromHobbyRow),
    communities: c.data.map(fromCommunityRow),
    posts: p.data.map(fromPostRow),
    events: e.data.map(fromEventRow),
  };
}

function adjustCount(list, id, field, delta) {
  return list.map(item => (item.id === id ? { ...item, [field]: Math.max(0, (item[field] ?? 0) + delta) } : item));
}

const toSets = (s = {}) => ({
  joined: new Set(s.joined),
  liked: new Set(s.liked),
  interested: new Set(s.interested),
  going: new Set(s.going),
});

const EMPTY_SETS = toSets();

/* Demo mode: fold this browser's saved actions and posts into the mock counts */
function initialDemoCatalog(sets, localPosts) {
  let { communities, posts, events } = MOCK_CATALOG;
  sets.joined.forEach(id => { communities = adjustCount(communities, id, 'memberCount', 1); });
  localPosts.forEach(p => { if (p.communityId) communities = adjustCount(communities, p.communityId, 'postCount', 1); });
  posts = [...localPosts, ...posts];
  sets.liked.forEach(id => { posts = adjustCount(posts, id, 'likeCount', 1); });
  sets.interested.forEach(id => { events = adjustCount(events, id, 'interested', 1); });
  return { ...MOCK_CATALOG, communities, posts, events };
}

/* Upload a data-URL image to Storage so posts don't carry base64 blobs */
async function uploadMedia(userId, media) {
  const blob = await (await fetch(media.dataUrl)).blob();
  const safeName = media.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${userId}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from('post-media').upload(path, blob, { contentType: blob.type });
  if (error) throw error;
  const { data } = supabase.storage.from('post-media').getPublicUrl(path);
  return { url: data.publicUrl, name: media.name, type: media.type };
}

export function AppDataProvider({ children }) {
  const { configured, user, openSignIn } = useAuth();
  const userId = user?.id ?? null;

  const [userState, setUserState] = useState(() =>
    configured ? EMPTY_SETS : toSets(readJSON(LOCAL_STATE_KEY, {})));
  const [catalog, setCatalog] = useState(() =>
    configured ? MOCK_CATALOG : initialDemoCatalog(userState, readJSON(LOCAL_POSTS_KEY, [])));
  const [interests, setInterests] = useState(() => readJSON(INTERESTS_KEY, []));
  const [profileName, setProfileName] = useState(null);

  // Refs let the async actions read the latest state without re-creating callbacks
  const stateRef = useRef(userState);
  const catalogRef = useRef(catalog);
  useLayoutEffect(() => {
    stateRef.current = userState;
    catalogRef.current = catalog;
  });

  /* ── Load the catalogue from Supabase ── */
  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    fetchCatalog()
      .then(next => {
        if (cancelled) return;
        if (next.hobbies.length === 0) {
          console.warn('[CommonGround] Supabase tables are empty — run supabase/seed.sql. Showing mock data.');
          return;
        }
        setCatalog(next);
      })
      .catch(err => {
        console.error('[CommonGround] Could not load data from Supabase', err);
        toast({ title: "Couldn't reach the database", body: 'Showing sample data for now.', tone: 'red' });
      });
    return () => { cancelled = true; };
  }, [configured]);

  /* ── Load the signed-in user's memberships, likes, RSVPs and interests ── */
  useEffect(() => {
    if (!configured) return;
    if (!userId) {
      setUserState(EMPTY_SETS);
      setProfileName(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const [m, l, r, p] = await Promise.all([
        supabase.from('community_members').select('community_id').eq('user_id', userId),
        supabase.from('post_likes').select('post_id').eq('user_id', userId),
        supabase.from('event_rsvps').select('event_id, status').eq('user_id', userId),
        supabase.from('profiles').select('name, interests').eq('id', userId).maybeSingle(),
      ]);
      if (cancelled) return;
      const error = m.error || l.error || r.error || p.error;
      if (error) {
        toast({ title: "Couldn't load your activity", body: error.message, tone: 'red' });
        return;
      }
      setUserState(toSets({
        joined: m.data.map(row => row.community_id),
        liked: l.data.map(row => row.post_id),
        interested: r.data.filter(row => row.status === 'interested').map(row => row.event_id),
        going: r.data.filter(row => row.status === 'going').map(row => row.event_id),
      }));
      setProfileName(p.data?.name ?? null);

      // Carry over hobbies picked before signing in
      const saved = p.data?.interests ?? [];
      const local = readJSON(INTERESTS_KEY, []);
      if (saved.length === 0 && local.length > 0) {
        await supabase.from('profiles').update({ interests: local }).eq('id', userId);
      } else if (saved.length > 0) {
        setInterests(saved);
      }
    })();
    return () => { cancelled = true; };
  }, [configured, userId]);

  /* Demo mode: remember actions in this browser */
  useEffect(() => {
    if (configured) return;
    writeJSON(LOCAL_STATE_KEY, {
      joined: [...userState.joined],
      liked: [...userState.liked],
      interested: [...userState.interested],
      going: [...userState.going],
    });
  }, [configured, userState]);

  /** Writes need an account when Supabase is on; demo mode never asks. */
  const requireAccount = useCallback((reason) => {
    if (!configured || userId) return true;
    openSignIn(reason);
    return false;
  }, [configured, userId, openSignIn]);

  /**
   * Flip `id` in one of the user's sets, keep the matching catalogue count in step,
   * and persist. Optimistic: reverts with a toast if the save fails.
   * Returns the new on/off state, or null if the save failed.
   */
  const flip = useCallback(async (kind, id, persist, count) => {
    const wasOn = stateRef.current[kind].has(id);
    const apply = (on) => {
      setUserState(s => {
        const next = new Set(s[kind]);
        if (on) next.add(id); else next.delete(id);
        return { ...s, [kind]: next };
      });
      if (count) {
        setCatalog(c => ({ ...c, [count.list]: adjustCount(c[count.list], id, count.field, on ? 1 : -1) }));
      }
    };
    apply(!wasOn);
    if (!configured) return !wasOn;
    try {
      const { error } = await persist(!wasOn);
      if (error) throw error;
      return !wasOn;
    } catch (err) {
      apply(wasOn);
      toast({ title: "Couldn't save that", body: err.message, tone: 'red' });
      return null;
    }
  }, [configured]);

  /* Insert or delete one of the user's rows in a join table */
  const rowWriter = useCallback((table, match) => (on) => (on
    ? supabase.from(table).insert({ ...match, user_id: userId })
    : supabase.from(table).delete().match({ ...match, user_id: userId })
  ), [userId]);

  const toggleJoin = useCallback(async (communityId) => {
    if (!requireAccount('Sign in to join communities.')) return null;
    const joined = await flip('joined', communityId,
      rowWriter('community_members', { community_id: communityId }),
      { list: 'communities', field: 'memberCount' });
    if (joined === null) return null;
    const name = catalogRef.current.communities.find(c => c.id === communityId)?.name ?? 'the community';
    toast(joined
      ? { title: `Joined ${name} 🌻`, body: 'Say hi in the feed.', tone: 'yellow' }
      : { title: `Left ${name}`, tone: 'ink' });
    return joined;
  }, [requireAccount, flip, rowWriter]);

  const toggleLike = useCallback(async (postId) => {
    if (!requireAccount('Sign in to like posts.')) return null;
    return flip('liked', postId, rowWriter('post_likes', { post_id: postId }), { list: 'posts', field: 'likeCount' });
  }, [requireAccount, flip, rowWriter]);

  const toggleInterested = useCallback(async (eventId) => {
    if (!requireAccount('Sign in to save events.')) return null;
    const on = await flip('interested', eventId,
      rowWriter('event_rsvps', { event_id: eventId, status: 'interested' }),
      { list: 'events', field: 'interested' });
    if (on) toast({ title: 'Saved to Interested ♡', tone: 'pink' });
    return on;
  }, [requireAccount, flip, rowWriter]);

  const markGoing = useCallback(async (eventId) => {
    if (stateRef.current.going.has(eventId)) return true;
    if (!requireAccount('Sign in to RSVP.')) return null;
    const on = await flip('going', eventId, rowWriter('event_rsvps', { event_id: eventId, status: 'going' }));
    if (on) toast({ title: "You're going! 🎉", body: "We'll keep your spot.", tone: 'green' });
    return on;
  }, [requireAccount, flip, rowWriter]);

  /** Hobbies picked on Discover. Never prompts — signed-out picks sync on sign-in. */
  const saveInterests = useCallback(async (ids) => {
    setInterests(ids);
    writeJSON(INTERESTS_KEY, ids);
    if (configured && userId) {
      const { error } = await supabase.from('profiles').update({ interests: ids }).eq('id', userId);
      if (error) toast({ title: "Couldn't save your hobbies", body: error.message, tone: 'red' });
    }
  }, [configured, userId]);

  /**
   * Publish a post. input: { type, title, body, communityId, interests, tags, attachments, authorName }
   * Returns the new post, or null if it wasn't published.
   */
  const createPost = useCallback(async (input) => {
    if (!requireAccount('Sign in to post.')) return null;
    const { media, ...rest } = input.attachments ?? {};

    let post;
    if (!configured) {
      post = {
        id: `local-${Date.now()}`,
        type: input.type,
        communityId: input.communityId,
        authorId: 'me',
        authorName: input.authorName,
        title: input.title,
        body: input.body,
        interests: input.interests,
        tags: input.tags,
        attachments: rest, // media data URLs are too big to keep twice in this browser's storage
        createdAt: new Date().toISOString(),
        replyCount: 0,
        likeCount: 0,
      };
      writeJSON(LOCAL_POSTS_KEY, [post, ...readJSON(LOCAL_POSTS_KEY, [])]);
    } else {
      try {
        const attachments = media?.dataUrl ? { ...rest, media: await uploadMedia(userId, media) } : input.attachments ?? {};
        const { data, error } = await supabase.from('posts').insert({
          community_id: input.communityId,
          author_id: userId,
          author_name: profileName ?? input.authorName,
          type: input.type,
          title: input.title,
          body: input.body,
          interests: input.interests,
          tags: input.tags,
          attachments,
        }).select().single();
        if (error) throw error;
        post = fromPostRow(data);
      } catch (err) {
        toast({ title: "Couldn't publish your post", body: err.message, tone: 'red' });
        return null;
      }
    }

    setCatalog(c => ({
      ...c,
      posts: [post, ...c.posts],
      communities: post.communityId ? adjustCount(c.communities, post.communityId, 'postCount', 1) : c.communities,
    }));
    return post;
  }, [requireAccount, configured, userId, profileName]);

  /** Remove one of your posts. Returns true when it's gone. */
  const deletePost = useCallback(async (postId) => {
    const post = catalogRef.current.posts.find(p => p.id === postId);
    if (configured) {
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if (error) {
        toast({ title: "Couldn't delete your post", body: error.message, tone: 'red' });
        return false;
      }
    } else {
      writeJSON(LOCAL_POSTS_KEY, readJSON(LOCAL_POSTS_KEY, []).filter(p => p.id !== postId));
    }
    setCatalog(c => ({
      ...c,
      posts: c.posts.filter(p => p.id !== postId),
      communities: post?.communityId ? adjustCount(c.communities, post.communityId, 'postCount', -1) : c.communities,
    }));
    return true;
  }, [configured]);

  const value = useMemo(() => {
    const { hobbies, communities, posts, events } = catalog;
    return {
      mode: configured ? 'supabase' : 'demo',
      hobbies,
      communities,
      posts,
      events,
      interests,
      getHobby: id => hobbies.find(h => h.id === id),
      getCommunity: id => communities.find(c => c.id === id),
      communitiesForHobby: hobbyId => communities.filter(c => c.hobbyId === hobbyId),
      trendingCommunities: communities.filter(c => c.trending),
      postsForCommunity: id => posts.filter(p => p.communityId === id),
      postsForInterest: id => posts.filter(p => p.interests?.includes(id)),
      isJoined: id => userState.joined.has(id),
      isLiked: id => userState.liked.has(id),
      isInterested: id => userState.interested.has(id),
      isGoing: id => userState.going.has(id),
      interestedEventIds: userState.interested,
      toggleJoin,
      toggleLike,
      toggleInterested,
      markGoing,
      saveInterests,
      createPost,
      deletePost,
    };
  }, [catalog, configured, interests, userState, toggleJoin, toggleLike, toggleInterested, markGoing, saveInterests, createPost, deletePost]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  return useContext(AppDataContext);
}
