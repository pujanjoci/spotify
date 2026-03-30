// Shared TypeScript types for the Spotify clone

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  audio_url: string;
  cover_url: string | null;
  duration: number | null;
  uploaded_by: string;
  created_at: string;
}

export interface Playlist {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

export interface PlaylistSong {
  id: string;
  playlist_id: string;
  song_id: string;
  position: number;
  added_at: string;
  song?: Song;
}

export interface PlaylistWithSongs extends Playlist {
  playlist_songs: (PlaylistSong & { song: Song })[];
}
