import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profiles";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch profile + stats in parallel
  const [profile, songsResult, playlistsResult] = await Promise.all([
    getProfile(user.id),
    supabase
      .from("songs")
      .select("id", { count: "exact", head: true })
      .eq("uploaded_by", user.id),
    supabase
      .from("playlists")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  return (
    <ProfileForm
      userId={user.id}
      initialDisplayName={profile?.display_name ?? null}
      initialAvatarUrl={profile?.avatar_url ?? null}
      email={user.email ?? ""}
      songCount={songsResult.count ?? 0}
      playlistCount={playlistsResult.count ?? 0}
    />
  );
}
