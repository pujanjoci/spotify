import { createClient } from "@/lib/supabase/server";
import { Playlist, PlaylistWithSongs } from "@/types";

/** Get all playlists for a user */
export async function getUserPlaylists(userId: string): Promise<Playlist[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getUserPlaylists:", error.message);
    return [];
  }
  return data as Playlist[];
}

/** Get a playlist with all its songs */
export async function getPlaylistWithSongs(
  id: string
): Promise<PlaylistWithSongs | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("playlists")
    .select(
      `*, playlist_songs(*, song:songs(*))`
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("getPlaylistWithSongs:", error.message);
    return null;
  }
  return data as PlaylistWithSongs;
}
