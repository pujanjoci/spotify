import Sidebar from "@/components/Sidebar";
import PlayerBar from "@/components/PlayerBar";
import MobileNav from "@/components/MobileNav";
import SessionWarning from "@/components/SessionWarning";
import { createClient } from "@/lib/supabase/server";
import { getUserPlaylists } from "@/lib/playlists";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const playlists = user ? await getUserPlaylists(user.id) : [];

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#0d0d14]">
      {/* Sidebar — hidden on mobile */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar playlists={playlists} userId={user?.id ?? ""} />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-[calc(64px+90px)] md:pb-[90px]">
        {children}
      </main>

      {/* Fixed bottom player */}
      <PlayerBar />

      {/* Mobile bottom nav */}
      <div className="block md:hidden">
        <MobileNav />
      </div>

      {/* Session expiry warning toast — renders only when < 2 min remain */}
      <SessionWarning />
    </div>
  );
}
