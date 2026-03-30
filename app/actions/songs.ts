"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

interface CreateSongData {
  title: string;
  artist: string;
  audio_url: string;
  cover_url: string | null;
  duration: number | null;
}

/** Server Action: Insert a song record into the database */
export async function createSong(data: CreateSongData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase.from("songs").insert({
    ...data,
    uploaded_by: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}
