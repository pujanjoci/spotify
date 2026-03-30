-- ============================================================
-- Spotify Clone - Supabase Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- ─── USERS ───────────────────────────────────────────────
create table if not exists public.users (
  id          uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  avatar_url  text,
  created_at  timestamptz default now()
);

-- Auto-create user record when a user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();spotify

-- ─── SONGS ──────────────────────────────────────────────────
create table if not exists public.songs (
  id          uuid default gen_random_uuid() primary key,
  title       text not null,
  artist      text not null,
  audio_url   text not null,
  cover_url   text,
  duration    numeric(6,2),          -- in seconds
  uploaded_by uuid references public.users(id) on delete cascade,
  created_at  timestamptz default now()
);

-- ─── PLAYLISTS ──────────────────────────────────────────────
create table if not exists public.playlists (
  id         uuid default gen_random_uuid() primary key,
  name       text not null,
  user_id    uuid references public.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- ─── PLAYLIST_SONGS ─────────────────────────────────────────
create table if not exists public.playlist_songs (
  id          uuid default gen_random_uuid() primary key,
  playlist_id uuid references public.playlists(id) on delete cascade,
  song_id     uuid references public.songs(id) on delete cascade,
  position    integer default 0,
  added_at    timestamptz default now(),
  unique(playlist_id, song_id)
);

-- ─── LIKES ──────────────────────────────────────────────────
create table if not exists public.likes (
  user_id uuid references public.users(id) on delete cascade,
  song_id uuid references public.songs(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, song_id)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- users
alter table public.users enable row level security;
create policy "Users are viewable by everyone" on public.users
  for select using (true);
create policy "Users can insert their own record" on public.users
  for insert with check (auth.uid() = id);
create policy "Users can update their own record" on public.users
  for update using (auth.uid() = id);

-- songs
alter table public.songs enable row level security;
create policy "Songs are viewable by everyone" on public.songs
  for select using (true);
create policy "Authenticated users can insert songs" on public.songs
  for insert with check (auth.uid() = uploaded_by);
create policy "Users can update their own songs" on public.songs
  for update using (auth.uid() = uploaded_by);
create policy "Users can delete their own songs" on public.songs
  for delete using (auth.uid() = uploaded_by);

-- playlists
alter table public.playlists enable row level security;
create policy "Playlists are viewable by everyone" on public.playlists
  for select using (true);
create policy "Authenticated users can create playlists" on public.playlists
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own playlists" on public.playlists
  for update using (auth.uid() = user_id);
create policy "Users can delete their own playlists" on public.playlists
  for delete using (auth.uid() = user_id);

-- playlist_songs
alter table public.playlist_songs enable row level security;
create policy "Playlist songs are viewable by everyone" on public.playlist_songs
  for select using (true);
create policy "Playlist owners can manage songs" on public.playlist_songs
  for all using (
    auth.uid() = (
      select user_id from public.playlists where id = playlist_id
    )
  );

-- likes
alter table public.likes enable row level security;
create policy "Users can view all likes" on public.likes
  for select using (true);
create policy "Users can manage their own likes" on public.likes
  for all using (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKET SETUP (run separately or in dashboard)
-- ============================================================
-- Create these buckets in Supabase dashboard > Storage:
--   songs   (public)
--   covers  (public)
--   avatars (public)
-- ============================================================
