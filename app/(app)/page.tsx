import { createClient } from "@/lib/supabase/server";
import { getRecentSongs } from "@/lib/songs";
import { getUserPlaylists } from "@/lib/playlists";
import SongCard from "@/components/SongCard";
import PlaylistCard from "@/components/PlaylistCard";
import Link from "next/link";
import { Upload } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [recentSongs, playlists] = await Promise.all([
    getRecentSongs(20),
    user ? getUserPlaylists(user.id) : [],
  ]);

  const recommended = recentSongs.slice(10);
  const featured = recentSongs.slice(0, 10);

  return (
    <div className="pb-8 overflow-hidden">
      {/* Hero banner */}
      <div 
        className="px-4 md:px-8 pt-8 md:pt-12 pb-8 border-b border-[#1e1e30]"
        style={{
          background: "linear-gradient(145deg, #2d1b69 0%, #1c1c2e 50%, #0d0d14 100%)",
        }}
      >
        <h1 className="text-white text-3xl md:text-4xl font-extrabold tracking-tight mb-1">
          Good {getGreeting()}
        </h1>
        <p className="text-[#a0a0b8] text-sm md:text-base">
          Welcome back! Here&apos;s what&apos;s trending.
        </p>
      </div>

      <div className="px-4 md:px-8">
        {/* Recently Added */}
        <section style={{ marginTop: "2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <h2 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Recently Added
            </h2>
            <Link
              href="/upload"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "#a78bfa",
                fontSize: "0.8125rem",
                fontWeight: 700,
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                transition: "color 0.2s",
              }}
            >
              <Upload size={14} />
              Upload song
            </Link>
          </div>

          {featured.length === 0 ? (
            <EmptyState
              message="No songs yet. Upload your first song!"
              action={{ href: "/upload", label: "Upload a song" }}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {featured.map((song) => (
                <SongCard key={song.id} song={song} queue={featured} />
              ))}
            </div>
          )}
        </section>

        {/* Your Playlists */}
        {playlists.length > 0 && (
          <section style={{ marginTop: "3rem" }}>
            <h2
              style={{
                color: "#fff",
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "1rem",
              }}
            >
              Your Playlists
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {playlists.map((pl) => (
                <PlaylistCard key={pl.id} playlist={pl} />
              ))}
            </div>
          </section>
        )}

        {/* Recommended */}
        {recommended.length > 0 && (
          <section style={{ marginTop: "3rem" }}>
            <h2
              style={{
                color: "#fff",
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "1rem",
              }}
            >
              Recommended
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {recommended.map((song) => (
                <SongCard key={song.id} song={song} queue={recommended} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function EmptyState({
  message,
  action,
}: {
  message: string;
  action?: { href: string; label: string };
}) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "3rem 2rem",
        background: "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, #13131f 100%)",
        borderRadius: "16px",
        border: "1px solid #2a2a40",
      }}
    >
      <p style={{ color: "#a0a0b8", marginBottom: "1rem" }}>{message}</p>
      {action && (
        <Link
          href={action.href}
          style={{
            display: "inline-block",
            padding: "12px 32px",
            borderRadius: "500px",
            background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
            color: "#fff",
            fontWeight: 700,
            textDecoration: "none",
            fontSize: "0.875rem",
            boxShadow: "0 4px 16px rgba(124,58,237,0.4)",
          }}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
