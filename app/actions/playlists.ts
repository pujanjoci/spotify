"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/** Server Action: Create a new playlist */
export async function createPlaylist(name: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("playlists")
    .insert({ name, user_id: user.id })
    .select()
    .single();

  if (error) return { error: error.message };
  revalidatePath("/");
  return { data };
}

/** Server Action: Add a song to a playlist */
export async function addSongToPlaylist(playlistId: string, songId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("playlist_songs")
    .insert({ playlist_id: playlistId, song_id: songId });

  if (error) return { error: error.message };
  revalidatePath(`/playlist/${playlistId}`);
  return { success: true };
}

/** Server Action: Remove a song from a playlist */
export async function removeSongFromPlaylist(
  playlistId: string,
  songId: string
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("playlist_songs")
    .delete()
    .eq("playlist_id", playlistId)
    .eq("song_id", songId);

  if (error) return { error: error.message };
  revalidatePath(`/playlist/${playlistId}`);
  return { success: true };
}

/** Server Action: Delete a playlist entirely */
export async function deletePlaylist(playlistId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("playlists")
    .delete()
    .eq("id", playlistId);

  if (error) return { error: error.message };
  revalidatePath("/");
  return { success: true };
}
