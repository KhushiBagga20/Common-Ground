-- ================================================================
-- CommonGround — initial schema
-- Catalogue (hobbies, communities, posts, events) is readable by
-- everyone. Each user can only write their own profile, posts,
-- memberships, likes and RSVPs. Counts are kept by triggers.
-- ================================================================

-- ── Catalogue ────────────────────────────────────────────────────
create table public.hobbies (
  id               text primary key,
  name             text not null,
  emoji            text,
  color            text,
  category         text,
  description      text,
  long_description text,
  member_count     integer not null default 0,
  sort_order       integer not null default 0
);

create table public.communities (
  id              text primary key,
  hobby_id        text references public.hobbies (id) on delete set null,
  name            text not null,
  description     text,
  member_count    integer not null default 0,
  post_count      integer not null default 0,
  color           text,
  trending        boolean not null default false,
  tags            text[] not null default '{}',
  related_hobbies text[] not null default '{}',
  sort_order      integer not null default 0
);

create table public.events (
  id               text primary key default gen_random_uuid()::text,
  title            text not null,
  category         text,
  date_label       text,
  time_label       text,
  location_type    text check (location_type in ('in-person', 'online')),
  location         text,
  description      text,
  interested_count integer not null default 0,
  image_key        text,  -- maps to bundled art in src/data/events.js
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now()
);

-- ── People ───────────────────────────────────────────────────────
create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       text check (char_length(name) <= 80),
  role       text check (char_length(role) <= 120),
  bio        text check (char_length(bio) <= 1000),
  location   text check (char_length(location) <= 120),
  website    text check (char_length(website) <= 200),
  interests  text[] not null default '{}',
  details    jsonb not null default '{}'::jsonb,  -- about, hobbies, activity feed, badges…
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.posts (
  id             text primary key default gen_random_uuid()::text,
  community_id   text references public.communities (id) on delete set null,
  author_id      uuid references public.profiles (id) on delete cascade,
  demo_author_id text,  -- seeded sample posts point at the app's sample people instead
  author_name    text,
  type           text not null default 'discussion'
                 check (type in ('discussion', 'question', 'idea', 'project')),
  title          text not null check (char_length(title) between 1 and 200),
  body           text check (char_length(body) <= 5000),
  interests      text[] not null default '{}',
  tags           text[] not null default '{}',
  attachments    jsonb not null default '{}'::jsonb
                 check (octet_length(attachments::text) <= 20000),
  reply_count    integer not null default 0,
  like_count     integer not null default 0,
  created_at     timestamptz not null default now()
);

create index posts_community_created_idx on public.posts (community_id, created_at desc);
create index posts_author_idx on public.posts (author_id);

-- ── What each person did ─────────────────────────────────────────
create table public.community_members (
  community_id text not null references public.communities (id) on delete cascade,
  user_id      uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  joined_at    timestamptz not null default now(),
  primary key (community_id, user_id)
);

create table public.post_likes (
  post_id    text not null references public.posts (id) on delete cascade,
  user_id    uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table public.event_rsvps (
  event_id   text not null references public.events (id) on delete cascade,
  user_id    uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  status     text not null check (status in ('interested', 'going')),
  created_at timestamptz not null default now(),
  primary key (event_id, user_id, status)
);

create index community_members_user_idx on public.community_members (user_id);
create index post_likes_user_idx on public.post_likes (user_id);
create index event_rsvps_user_idx on public.event_rsvps (user_id);

-- ── Triggers ─────────────────────────────────────────────────────

-- Every new auth user gets a profile, named after their email
create function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, name)
  values (new.id, left(split_part(new.email, '@', 1), 80));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Counts run as definer: users can't update catalogue rows themselves
create function public.count_community_members()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    update public.communities set member_count = member_count + 1 where id = new.community_id;
    return new;
  end if;
  update public.communities set member_count = greatest(member_count - 1, 0) where id = old.community_id;
  return old;
end;
$$;

create trigger community_members_count
  after insert or delete on public.community_members
  for each row execute function public.count_community_members();

create function public.count_post_likes()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    update public.posts set like_count = like_count + 1 where id = new.post_id;
    return new;
  end if;
  update public.posts set like_count = greatest(like_count - 1, 0) where id = old.post_id;
  return old;
end;
$$;

create trigger post_likes_count
  after insert or delete on public.post_likes
  for each row execute function public.count_post_likes();

create function public.count_event_interest()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' and new.status = 'interested' then
    update public.events set interested_count = interested_count + 1 where id = new.event_id;
  elsif tg_op = 'DELETE' and old.status = 'interested' then
    update public.events set interested_count = greatest(interested_count - 1, 0) where id = old.event_id;
  end if;
  return coalesce(new, old);
end;
$$;

create trigger event_rsvps_count
  after insert or delete on public.event_rsvps
  for each row execute function public.count_event_interest();

-- Only real members' posts count; seeded sample posts are already in post_count
create function public.count_community_posts()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' and new.community_id is not null and new.author_id is not null then
    update public.communities set post_count = post_count + 1 where id = new.community_id;
  elsif tg_op = 'DELETE' and old.community_id is not null and old.author_id is not null then
    update public.communities set post_count = greatest(post_count - 1, 0) where id = old.community_id;
  end if;
  return coalesce(new, old);
end;
$$;

create trigger posts_count
  after insert or delete on public.posts
  for each row execute function public.count_community_posts();

-- Stamp the author's current display name so it can't be spoofed from the client
create function public.set_post_author_name()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.author_id is not null then
    select p.name into new.author_name from public.profiles p where p.id = new.author_id;
  end if;
  return new;
end;
$$;

create trigger posts_author_name
  before insert on public.posts
  for each row execute function public.set_post_author_name();

-- ── Row level security ───────────────────────────────────────────
alter table public.hobbies           enable row level security;
alter table public.communities       enable row level security;
alter table public.events            enable row level security;
alter table public.profiles          enable row level security;
alter table public.posts             enable row level security;
alter table public.community_members enable row level security;
alter table public.post_likes        enable row level security;
alter table public.event_rsvps       enable row level security;

create policy "Hobbies are public" on public.hobbies for select using (true);
create policy "Communities are public" on public.communities for select using (true);
create policy "Events are public" on public.events for select using (true);
create policy "Posts are public" on public.posts for select using (true);
create policy "Profiles are public" on public.profiles for select using (true);

create policy "Users update their own profile" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "Users publish their own posts" on public.posts
  for insert to authenticated
  with check (
    author_id = (select auth.uid())
    and demo_author_id is null
    and like_count = 0
    and reply_count = 0
  );

create policy "Users delete their own posts" on public.posts
  for delete to authenticated
  using (author_id = (select auth.uid()));

create policy "Users see their own memberships" on public.community_members
  for select to authenticated using (user_id = (select auth.uid()));
create policy "Users join communities" on public.community_members
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "Users leave communities" on public.community_members
  for delete to authenticated using (user_id = (select auth.uid()));

create policy "Users see their own likes" on public.post_likes
  for select to authenticated using (user_id = (select auth.uid()));
create policy "Users like posts" on public.post_likes
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "Users unlike posts" on public.post_likes
  for delete to authenticated using (user_id = (select auth.uid()));

create policy "Users see their own RSVPs" on public.event_rsvps
  for select to authenticated using (user_id = (select auth.uid()));
create policy "Users RSVP to events" on public.event_rsvps
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "Users cancel RSVPs" on public.event_rsvps
  for delete to authenticated using (user_id = (select auth.uid()));

grant select on public.hobbies, public.communities, public.events, public.posts, public.profiles
  to anon, authenticated;
grant update on public.profiles to authenticated;
grant insert, delete on public.posts to authenticated;
grant select, insert, delete on public.community_members, public.post_likes, public.event_rsvps
  to authenticated;

-- ── Storage: images attached to posts ────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-media', 'post-media', true, 20971520,  -- 20 MB
  array['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do nothing;

-- Files live under <user id>/… so people can only write to their own folder
create policy "Users upload post media to their folder" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'post-media' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Users delete their own post media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'post-media' and (storage.foldername(name))[1] = (select auth.uid())::text);
