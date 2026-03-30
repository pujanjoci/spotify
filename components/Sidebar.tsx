"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Search, Library, Plus, LogOut, Music2, User, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Playlist } from "@/types";
import CreatePlaylistModal from "./CreatePlaylistModal";

interface SidebarProps {
  playlists: Playlist[];
  userId: string;
}

export default function Sidebar({ playlists, userId }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [localPlaylists, setLocalPlaylists] = useState(playlists);
  const [modalOpen, setModalOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handlePlaylistCreated = (newPlaylist: Playlist) => {
    setLocalPlaylists([newPlaylist, ...localPlaylists]);
    router.push(`/playlist/${newPlaylist.id}`);
  };

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/search", icon: Search, label: "Search" },
    { href: "/upload", icon: Upload, label: "Upload" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Modal */}
      {modalOpen && (
        <CreatePlaylistModal
          onClose={() => setModalOpen(false)}
          onCreated={handlePlaylistCreated}
        />
      )}

      <aside className="w-[240px] min-w-[240px] bg-[#0a0a12]/97 border-r border-[#1e1e30] flex flex-col h-full overflow-y-auto p-0">
        {/* Logo — SoundWave brand */}
        <div style={{ padding: "24px 24px 8px" }}>
          <Link
            href="/"
            style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
          >
            {/* Waveform icon */}
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(124,58,237,0.5)",
              }}
            >
              <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                <rect x="0" y="4" width="2.5" height="6" rx="1.25" fill="white" />
                <rect x="4" y="1" width="2.5" height="12" rx="1.25" fill="white" />
                <rect x="8" y="0" width="2.5" height="14" rx="1.25" fill="white" />
                <rect x="12" y="3" width="2.5" height="8" rx="1.25" fill="white" />
                <rect x="16" y="5" width="2.5" height="4" rx="1.25" fill="white" />
              </svg>
            </div>
            <span
              style={{
                color: "#fff",
                fontWeight: 800,
                fontSize: "1.125rem",
                letterSpacing: "-0.03em",
                background: "linear-gradient(90deg, #fff 0%, #a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              SoundWave
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav style={{ padding: "8px 12px 0" }}>
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  color: active ? "#fff" : "#a0a0b8",
                  fontWeight: active ? 700 : 400,
                  fontSize: "0.9375rem",
                  background: active
                    ? "linear-gradient(90deg, rgba(124,58,237,0.25) 0%, rgba(124,58,237,0.05) 100%)"
                    : "transparent",
                  borderLeft: active ? "2px solid #7c3aed" : "2px solid transparent",
                  transition: "all 0.2s",
                  marginBottom: "2px",
                }}
              >
                <Icon
                  size={20}
                  style={{ color: active ? "#a78bfa" : "inherit", flexShrink: 0 }}
                />
                {label}
              </Link>
            );
          })}
        </nav>

        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #2a2a40, transparent)", margin: "16px 0 0" }} />

        {/* Library */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 12px 8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Library size={20} style={{ color: "#a0a0b8" }} />
              <span style={{ color: "#a0a0b8", fontWeight: 700, fontSize: "0.8125rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Your Library
              </span>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              title="Create playlist"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                padding: "5px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "opacity 0.2s, transform 0.1s",
                boxShadow: "0 2px 8px rgba(124,58,237,0.4)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.opacity = "1";
              }}
            >
              <Plus size={16} />
            </button>
          </div>

          {localPlaylists.length === 0 ? (
            <div
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(28,28,46,0.8) 100%)",
                border: "1px dashed #2a2a40",
                borderRadius: "12px",
                padding: "16px",
                margin: "0 0 8px",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
              onClick={() => setModalOpen(true)}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a40")}
            >
              <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.875rem", marginBottom: "4px" }}>
                Create your first playlist
              </p>
              <p style={{ color: "#a0a0b8", fontSize: "0.8125rem", lineHeight: 1.4 }}>
                It&apos;s easy, we&apos;ll help you.
              </p>
            </div>
          ) : (
            <div>
              {localPlaylists.map((pl) => {
                const active = pathname === `/playlist/${pl.id}`;
                return (
                  <Link
                    key={pl.id}
                    href={`/playlist/${pl.id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "8px 10px",
                      borderRadius: "10px",
                      textDecoration: "none",
                      color: active ? "#fff" : "#a0a0b8",
                      background: active ? "rgba(124,58,237,0.15)" : "transparent",
                      transition: "all 0.2s",
                      marginBottom: "2px",
                      fontSize: "0.875rem",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        background: active
                          ? "linear-gradient(135deg, #7c3aed, #a78bfa)"
                          : "linear-gradient(135deg, #2a2a40, #1c1c2e)",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "background 0.2s",
                      }}
                    >
                      <Music2 size={16} style={{ color: active ? "#fff" : "#a0a0b8" }} />
                    </div>
                    <div style={{ overflow: "hidden" }}>
                      <div
                        style={{
                          color: active ? "#fff" : "#e0e0f0",
                          fontWeight: 500,
                          fontSize: "0.875rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {pl.name}
                      </div>
                      <div style={{ color: "#5a5a7a", fontSize: "0.75rem" }}>Playlist</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Logout */}
        <div style={{ padding: "12px" }}>
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              width: "100%",
              padding: "10px 12px",
              borderRadius: "10px",
              background: "none",
              border: "none",
              color: "#5a5a7a",
              cursor: "pointer",
              fontSize: "0.875rem",
              transition: "color 0.2s, background 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#5a5a7a";
              e.currentTarget.style.background = "none";
            }}
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
