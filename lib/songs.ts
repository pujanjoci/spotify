import { createClient } from "@/lib/supabase/server";
import { Song } from "@/types";

/** Get the most recently uploaded songs */
export async function getRecentSongs(limit = 20): Promise<Song[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRecentSongs:", error.message);
    return [];
  }
  return data as Song[];
}

/** Search songs by title or artist */
export async function searchSongs(query: string): Promise<Song[]> {
  if (!query.trim()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .or(`title.ilike.%${query}%,artist.ilike.%${query}%`)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("searchSongs:", error.message);
    return [];
  }
  return data as Song[];
}

/** Get all songs for a specific user */
export async function getUserSongs(userId: string): Promise<Song[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("uploaded_by", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getUserSongs:", error.message);
    return [];
  }
  return data as Song[];
}
