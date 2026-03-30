import { createClient } from "@/lib/supabase/server";
import { Profile } from "@/types";

/** Fetch a user's profile */
export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("getProfile:", error.message);
    return null;
  }
  return data as Profile;
}

/** Update a user's profile (display_name, avatar_url) */
export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, "display_name" | "avatar_url">>
): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId);

  if (error) {
    console.error("updateProfile:", error.message);
    return false;
  }
  return true;
}
